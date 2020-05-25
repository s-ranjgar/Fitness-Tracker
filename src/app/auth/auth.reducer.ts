import { Action } from '@ngrx/store';

import * as authAction from './auth.actions';

export interface State {
    isAuthenticated: boolean
}

const initialState: State = {
    isAuthenticated: false
};

export function authReducer(state = initialState, action: authAction.AuthActions) {

    switch (action.type) {
        case authAction.SET_AUTHENTICATED:
            return{
                isAuthenticated:true
            };

        case authAction.SET_UNAUTHENTICATED:
            return{
                isAuthenticated:false
            };
        
        default:
            return state;
    }
}

export const getIsAuth = (state:State) => state.isAuthenticated;