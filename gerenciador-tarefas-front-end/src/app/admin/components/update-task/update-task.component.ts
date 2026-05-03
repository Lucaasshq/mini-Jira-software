import { Component, inject } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-task',
  imports: [],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.scss'
})
export class UpdateTaskComponent {

  private route = inject(ActivatedRoute)
  // injeta a dependencia sem precisar do construtor
  id:number = this.route.snapshot.params["id"];
  

  constructor(private adminService:AdminService, private snackBar:MatSnackBar){
    this.getTaskById();
  }
  

  public getTaskById(){
    this.adminService.getTaskById(this.id).subscribe({
      next: (res: any) => {
        this.snackBar.open("")
        console.log(res)
      },
      error: (err:any) => {
        console.error("Erro ao buscar tarefa ", err)
      }
    })
  }

}
