import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  userName: string;
  userSubs: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubs = this.store.select('user')
      .pipe( filter( ({user}) => user != null ) )
      .subscribe( ({user}) => this.userName = user.nombre );
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }

}
