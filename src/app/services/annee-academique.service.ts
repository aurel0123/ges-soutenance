import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AnneeAcademiqueService {

  baseUrl = 'http://localhost:3000/anneeAcademiques';

  constructor(
    private http: HttpClient
  ) {

   }

   getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, JSON.stringify(data));
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id.toString()}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  findByTitle(title: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?title=${title}`);
  }

}
