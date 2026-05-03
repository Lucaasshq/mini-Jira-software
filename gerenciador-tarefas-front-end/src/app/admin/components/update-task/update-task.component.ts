import { Component, inject } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../model/User';
import { Router } from '@angular/router';
import { MaterialModule } from "../../../MaterialModule";

@Component({
  selector: 'app-update-task',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.scss'
})
export class UpdateTaskComponent {

  private route = inject(ActivatedRoute)
  // injeta a dependencia sem precisar do construtor
  id: number = this.route.snapshot.params["id"];
  updateTarefaForm!: FormGroup
  listOfFuncionarios: User[] = [];
  listOfPriority: any = ["BAIXA", "MEDIA", "ALTA"]



  constructor(
     private adminService: AdminService,
     private snackBar: MatSnackBar,
     private fb: FormBuilder,
     private router:Router
   ) {
    this.getTaskById();
    this.getUsers();
    this.updateTarefaForm = fb.group({
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


  public getTaskById() {
    this.adminService.getTaskById(this.id).subscribe({
      next: (res: any) => {
        // carregar os dados no formulario para atualizar
        this.updateTarefaForm.patchValue(res)
        console.log(res)
      },
      error: (err: any) => {
        console.error("Erro ao buscar tarefa ", err)
      }
    })
  }

   public updateTask(){
    this.adminService.updatedTask(this.id,this.updateTarefaForm.value).subscribe({
      next: (res: any) => {
        if (res.id != null){
          this.snackBar.open("Tarefa atualizada com sucesso", "Close", {duration:5000})
          this.router.navigateByUrl("/admin/dashboard")
        }
      }, 
      error: (err: any) => {
        console.error("erro ao tentar salvar tarefaaa.", err)
        this.snackBar.open("Erro ao tentar salvar tarefa.", "ERROR", {duration:5000})
      }
    })
  }

}
