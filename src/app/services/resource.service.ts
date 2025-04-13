import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = 'http://localhost:8081/api/resources';

  constructor(private http: HttpClient) {}

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  getResourceById(id: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  addResource(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource);
  }

  updateResource(resource: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${resource.id}`, resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
