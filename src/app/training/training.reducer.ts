
import * as trainingAction from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
    availableTrainings: Exercise[];
    finishedTrainings:Exercise[];
    activeTraining:Exercise;
}

export interface State extends fromRoot.State{
    training:TrainingState;
}

const initialState: TrainingState = {
    availableTrainings:[],
    finishedTrainings:[],
    activeTraining:null
};

export function trainingReducer(state = initialState, action: trainingAction.TrainingActions) {

    switch (action.type) {
        case trainingAction.SET_AVAILABLE_TRAININGS:
            return{
                ...state,
                availableTrainings : action.payload
            };

        case trainingAction.SET_FINISHED_TRAININGS:
            return{
                ...state,
                finishedTrainings:action.payload
            };
        
        case trainingAction.START_TRAINING:            
            return{
                ...state,
                activeTraining: {... state.availableTrainings.find(ex=>ex.id=== action.payload)}
            };
        
        case trainingAction.STOP_TRAINING:
            return{
                ...state,
                activeTraining:null
            };
        
        default:
            return state;
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableTrainings =createSelector(getTrainingState ,(state: TrainingState) => state.availableTrainings);
export const getFinishedTrainings = createSelector(getTrainingState ,(state: TrainingState) => state.finishedTrainings);
export const getActiveTraining = createSelector(getTrainingState ,(state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState ,(state: TrainingState) => state.activeTraining!=null);