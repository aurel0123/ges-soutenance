import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Student {
  id: string;
  matricule : string;
  nom: string;
  prenom: string;
  dateNaissance : string ;
  lieuNaissance : string;
  filiere : string ;
}
@Injectable({
  providedIn: 'root',
})
export class PlanningLicenceService {
  baseUrl = 'http://localhost:3000/planningLicences';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, JSON.stringify(data));
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id.toString()}`);
  }

  getThemes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/themeLicences');
  }

  getPresidents(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/presidents');
  }

  getSuggestions(nom: string, prenom: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/licences?nom=${nom}&prenom=${prenom}`);
  }
  getLicences(): Observable<{ name: string }[]> {
    return this.http.get<{ id: string, matricule: string, nom: string, prenom: string, dateNaissance: string, lieuNaissance: string, filiere: string }[]>(`http://localhost:3000/licences`).pipe(
      map(licences => licences.map(licence => ({
        name: `${licence.nom} ${licence.prenom}`
      })))
    );
  }
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`http://localhost:3000/licences`);
  }

  addPlanning(planning: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, planning);
  }

  updatePlanning(planning: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${planning.id}`, planning);
  }
}
