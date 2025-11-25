import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;

  private readonly router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['']);
    }
  }
}
