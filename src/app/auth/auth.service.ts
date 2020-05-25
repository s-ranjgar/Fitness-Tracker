import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromAppp from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {        

    /**
     *
     */
    constructor(private router: Router
        , private afAuth: AngularFireAuth
        , private trainingService: TrainingService
        , private uiservice: UIService
        , private store: Store<fromAppp.State>) {

    }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscription();
                this.store.dispatch(new Auth.SetUnAuthenticated());
                this.router.navigate(['/login']);
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiservice.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());

        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());

            }).catch(error => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiservice.showSnackbar(error.message, null, 3000);
            });

    }

    login(authData: AuthData) {
        // this.uiservice.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            }).catch(error => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiservice.showSnackbar(error.message, null, 3000);
            });
    }

    logout() {
        this.afAuth.auth.signOut();

    }    


}