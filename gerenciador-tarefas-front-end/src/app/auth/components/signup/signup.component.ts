import { AuthService } from './../../services/auth/auth.service';

import { Component } from '@angular/core';
import { MaterialModule } from "../../../MaterialModule";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm!: FormGroup;
  mostrarSenha = true;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router) {

    this.signupForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmarPassword: [null, [Validators.required]]
    })
  }

  alternarVisibilidadePassword() {
    this.mostrarSenha = !this.mostrarSenha
  }

  signup() {
    const password = this.signupForm.get("password")?.value;
    const confirmarPassword = this.signupForm.get("confirmarPassword")?.value;

    if (password !== confirmarPassword) {
      this.snackbar.open("Senhas não são iguais", "Close", { duration: 5000, panelClass: "error-snackbar" });
      return
    }

    this.authService.signup(this.signupForm.value).subscribe({
      next: (res) => {
        this.snackbar.open("Registro feito com sucesso", "Close", { duration: 5000 })
        this.router.navigate(["/login"])
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.open("Registro falhou. Tente novamente", "Close", { duration: 5000, panelClass: "error-snackbar" })
        console.log("Erro ao tentar criar conta", err)
      }
    })
  }


}
