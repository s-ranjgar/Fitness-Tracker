import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import { error } from 'protractor';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availabelExercises: Exercise[] = [];

    private exercises: Exercise[] = [];

    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    /**
     *
     */
    constructor(private db: AngularFirestore, private uiservice: UIService) {

    }

    fetchAvailableExercises() {
        this.uiservice.loadingStateChanged.next(true);
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
                this.availabelExercises = exercises;
                this.exercisesChanged.next([...this.availabelExercises]);
                this.uiservice.loadingStateChanged.next(false);

            },error=>{
                this.uiservice.loadingStateChanged.next(false);
                this.uiservice.showSnackbar('Fetching Exercises failed, please try again later',null,3000);
                this.exercisesChanged.next(null);
            }));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/'+selectedId).update({lastSelected:new Date()});
        this.runningExercise = this.availabelExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    stopExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(), state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchPastExercise() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
            }));
    }

    cancelSubscription() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}