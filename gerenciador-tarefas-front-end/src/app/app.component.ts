import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from './MaterialModule';
import { StorageService } from './auth/services/storage/storage.service';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {


  isFuncionarioLogado: boolean = StorageService.eFuncionarioLogado();
  isAdminLogado: boolean = StorageService.eAdminLogado();

  constructor(private router: Router) { }


  ngOnInit(): void {
    this.router.events.subscribe(event => {
      this.isFuncionarioLogado = StorageService.eFuncionarioLogado();
      this.isAdminLogado = StorageService.eAdminLogado();
    })
  }

  logout() {
    StorageService.logout()
    this.router.navigateByUrl("/login")
  }



}
