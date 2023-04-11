import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Esp32AuthServiceService {

  constructor(private httpClient: HttpClient) { }

  fingerLogin(): Observable<any>{
    return this.httpClient.post<any>('http://192.168.43.134/login', {})
  }
}
