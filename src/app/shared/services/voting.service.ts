import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  baseUrl: string = 'http://127.0.0.1:8000/biometric_voting/api';

  constructor(private http: HttpClient) { }

  getAllContestants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/contestants`)
  }

  getAllContestantRoles(): Observable<any>{
    return this.http.get(`${this.baseUrl}/titles`)
  }
}
