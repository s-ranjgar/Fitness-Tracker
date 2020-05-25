import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/observable';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  workouts$: Observable<Exercise[]>;
  isLoading$:Observable<boolean>;

  constructor(private trainingService: TrainingService, private uiservice: UIService,private store:Store<fromTraining.State>) { }

  ngOnInit(): void {
    
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.workouts$ = this.store.select(fromTraining.getAvailableTrainings);
    
    this.fetchExercises();
  }


  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
