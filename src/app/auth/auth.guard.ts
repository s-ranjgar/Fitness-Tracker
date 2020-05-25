import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
;
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate,CanLoad{
constructor(private store:Store<fromRoot.State>){

}
    canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
        return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      
      return this.store.select(fromRoot.getIsAuth).pipe(take(1));     
    }

}