import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loadingSubs: Subscription;
  isLoading$:Observable<boolean>;
  constructor(private authService: AuthService, private uiservice: UIService, private store:Store<fromApp.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromApp.getIsLoading);   
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    })
  }

}
