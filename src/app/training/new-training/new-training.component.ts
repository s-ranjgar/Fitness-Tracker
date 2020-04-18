import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',  
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  workouts;

  constructor(private trainingService:TrainingService) { }

  ngOnInit(): void {
    this.workouts= this.trainingService.getAvailableExercises();
  }

  onStartTraining(form:NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
