import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import { error } from 'protractor';
import * as UI from '../shared/ui.actions';
import * as trainingAction from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
      
    private fbSubs: Subscription[] = [];

    /**
     *
     */
    constructor(private db: AngularFirestore, private uiservice: UIService,
        private store: Store<fromTraining.State>) {

    }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StopLoading());
        this.fbSubs.push(
            this.db.collection('availableExercises').snapshotChanges().pipe<any>(map(docArray => {
                return docArray.map(doc => {
                    // throw new Error();
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data()["name"],
                        duration: doc.payload.doc.data()["duration"],
                        calories: doc.payload.doc.data()["calories"],
                    };
                })
            })).subscribe((exercises: Exercise[]) => {
                // this.availabelExercises = exercises;
                // this.exercisesChanged.next([...this.availabelExercises]);
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new trainingAction.SetAvailableTrainings(exercises));

            },error=>{
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiservice.showSnackbar('Fetching Exercises failed, please try again later',null,3000);
            }));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/'+selectedId).update({lastSelected:new Date()});
        // this.runningExercise = this.availabelExercises.find(ex => ex.id === selectedId);
        // this.exerciseChanged.next({ ...this.runningExercise });
        this.store.dispatch(new trainingAction.StartTraining(selectedId));

    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
            this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });            
            this.store.dispatch(new trainingAction.StopTraining());
        });
    }

    stopExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(), state: 'cancelled'
            });
            this.store.dispatch(new trainingAction.StopTraining());    
        });                
    }

    fetchPastExercise() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
                // this.finishedExercisesChanged.next(exercises);
                this.store.dispatch(new trainingAction.SetFinishedTrainings(exercises));

            }));
    }

    cancelSubscription() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}