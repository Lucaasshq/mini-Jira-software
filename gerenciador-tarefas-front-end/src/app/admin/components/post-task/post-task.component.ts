import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { User } from '../../../model/User';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { Form, FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "../../../MaterialModule";

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-task',
  imports: [MatButtonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './post-task.component.html',
  styleUrl: './post-task.component.scss'
})
export class PostTaskComponent {


  tarefaForm!: FormGroup
  listOfFuncionarios: User[] = [];
  listOfPriority: any = ["BAIXA", "MEDIA", "ALTA"]

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar:MatSnackBar,
    private router:Router) {
    this.getUsers()


    this.tarefaForm = fb.group({
      funcionarioId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, Validators.required],
      priority: [null, Validators.required]
    })
  }



  public getUsers() {
    this.adminService.getUsers().subscribe({
      next: (res: User[]) => {
        this.listOfFuncionarios = res
      },
      error: (err) => {
        console.error("erro ao tentar buscar usuario", err)
      }
    })
  }

  public postTask(){
    this.adminService.postTask(this.tarefaForm.value).subscribe({
      next: (res: any) => {
        if (res.id != null){
          this.snackBar.open("Tarefa criada com sucesso", "Close", {duration:5000})
          this.router.navigateByUrl("/admin/dashboard")
        }
      }, 
      error: (err: any) => {
        console.error("erro ao tentar salvar tarefa.", err)
        this.snackBar.open("Erro ao tentar salvar tarefa.", "ERROR", {duration:5000})
      }
    })
  }

}
