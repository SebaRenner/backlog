import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { LoginStore } from '../../store/login.store';
import { SupabaseFunctionsService } from '../../services/supabase-functions.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly form: FormGroup;

  private readonly router = inject(Router);
  private readonly loginStore = inject(LoginStore);
  private readonly functionsService = inject(SupabaseFunctionsService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', Validators.required],
    });
  }

  get passwordControl() {
    return this.form.controls['password'];
  }

  onSubmit() {
    if (this.form.valid) {
      this.functionsService.login(this.form.value.password).subscribe((isValid) => {
        if (isValid) {
          this.loginStore.login();
          this.router.navigate(['']);
        } else {
          this.passwordControl.setErrors({ wrongPassword: true });
        }
      });
    }
  }
}
