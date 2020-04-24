import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { map } from 'rxjs/operators';

import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  workouts: Exercise[];
  exerciseSubscription: Subscription;
  isLoading = false;
  loadingSubs: Subscription;

  constructor(private trainingService: TrainingService, private uiservice: UIService) { }

  ngOnInit(): void {
    // this.workouts = this.trainingService.getAvailableExercises();
    this.loadingSubs = this.uiservice.loadingStateChanged.subscribe(loadingState => {
      this.isLoading = loadingState;
    });

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.workouts = exercises;
    });
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }

    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
