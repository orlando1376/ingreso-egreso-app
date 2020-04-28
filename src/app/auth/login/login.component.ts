import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSusbcription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.uiSusbcription = this.store.select('ui').subscribe( ui => {
                            this.cargando = ui.isLoading;
                          });
  }

  ngOnDestroy() {
    this.uiSusbcription.unsubscribe();
  }

  loginUsuario() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const {email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then( credenciales => {
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        });
      } );
  }
}
