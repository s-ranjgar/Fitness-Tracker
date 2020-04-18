import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit,OnDestroy {

  @Output() closeSidenave = new EventEmitter<void>();
  isAuth: boolean;
  authSubscription:Subscription;

  constructor(private authService: AuthService) { }

  ngOnDestroy(): void {
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus=>{
      this.isAuth = authStatus;
    });
  }

  onClose() {
    this.closeSidenave.emit();
  }

  onLogout(){
    this.onClose();
    this.authService.logout();
  }
}
