import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Salle } from '../models/salle';

@Injectable({
  providedIn: 'root',
})
export class SalleService {
  private baseUrl = 'http://localhost:8081/api/salles';

  constructor(private http: HttpClient) {}

  addSalle(salle: any): Observable<Salle> {
    return this.http.post<Salle>(`${this.baseUrl}`, salle);
  }

  getAllSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.baseUrl}`);
  }

  getSalleById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.baseUrl}/${id}`);
  }

  updateSalle(id: number, salle: any): Observable<Salle> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, salle);
  }

  deleteSalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
