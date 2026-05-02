import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/User';
import { StorageService } from '../../auth/services/storage/storage.service';

const BASE_URL = "http://localhost:8080"

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}/admin/users`, { headers: this.createAuthorizationHeader() })
  }

  public postTask(taskDTO: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/admin/task`, taskDTO, { headers: this.createAuthorizationHeader() })
  }

  private createAuthorizationHeader(): HttpHeaders {
    var r = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return r
  }
}
