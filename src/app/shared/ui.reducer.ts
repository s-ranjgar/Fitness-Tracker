import { Action } from '@ngrx/store';

import * as uiAction from './ui.actions';

export interface State {
    isLoading: boolean
}

const initialState: State = {
    isLoading: false
};

export function uiReducer(state = initialState, action: Action) {

    switch (action.type) {
        case uiAction.START_LOADING:
            return{
                isLoading:true
            };

        case uiAction.STOP_LOADING:
            return{
                isLoading:false
            };
        
        default:
            return state;
    }
}

export const getIsLoading = (state:State) => state.isLoading;