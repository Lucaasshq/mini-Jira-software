import { Component } from '@angular/core';
import { MaterialModule } from '../../../MaterialModule';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../../model/LoginResponse';
import { StorageService } from '../../services/storage/storage.service';


@Component({
  selector: 'app-login',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarSenha: boolean = true;;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackbar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  alterarVisibilidadePassword(): void {
    this.mostrarSenha = !this.mostrarSenha
  }

  login(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: LoginResponse) => {
        const user = {
          id: res.userId,
          role: res.role
        }
        StorageService.salvarUser(user);
        StorageService.salvarToken(res.jwt)
        if (StorageService.eAdminLogado()) {
          this.router.navigateByUrl("/admin")
        } else if (StorageService.eFuncionarioLogado()) {
          this.router.navigateByUrl("/funcionario/dashboard")
          this.snackbar.open("Login efetuado com sucesso", "Close", { duration: 5000 })
        }


      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.open("Erro ao tentar fazer Login", "Close", { duration: 5000, panelClass: "error-snackbar" })
        console.error("Error ao tentar fazer Login", err)
      }
    })
  }

}
