import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { map } from 'rxjs/operators';

import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit,OnDestroy {
  workouts: Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }
  ngOnDestroy(): void {
    if(this.exerciseSubscription)
    {
      this.exerciseSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // this.workouts = this.trainingService.getAvailableExercises();
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises=>{
      this.workouts = exercises;
    })
    this.trainingService.fetchAvailableExercises();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
