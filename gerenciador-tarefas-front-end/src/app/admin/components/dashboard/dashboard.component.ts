import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatCard } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { taskDTO } from '../../../model/taskDTO';
import { MatDivider } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MaterialModule } from "../../../MaterialModule";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [MatCard, CommonModule, MatDivider, MatButtonModule, RouterLink, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  listOftasks:taskDTO[] = []

  constructor(private adminService: AdminService, private snackBar:MatSnackBar) {
    this.getTask();
   }
  public getTask() {
    this.adminService.getAllTask()
      .subscribe({
        next: (res: any) => {
          this.listOftasks = res
          console.log(res)
        },
        error: (err: any) => {
          console.error("Erro ao buscar tarefas.", err)
        }
      })
  }

  public deleteTask(id:number){
    this.adminService.deleteTask(id).subscribe({
      next: (res:any) =>{
        this.snackBar.open("Tarefa excluida com sucesso!", "Close", {duration: 5000})
        this.getTask()
      },
      error: (res: any)=> {
        this.snackBar.open("Erro ao excluir tarefa " + res, "Close", {duration:5000} )
      }
    })
  }
}
