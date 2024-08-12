import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeLicenceService {
  private apiUrl = 'http://localhost:3000/themeLicences'; // Adaptez l'URL si nécessaire

  constructor(private http: HttpClient) {}

  getThemeLicences(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getFilieres(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/filieres').pipe(
      catchError(this.handleError)
    );
  }

  addThemeLicence(themeLicence: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, themeLicence).pipe(
      catchError(this.handleError)
    );
  }

  updateThemeLicence(themeLicence: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${themeLicence.id}`, themeLicence).pipe(
      catchError(this.handleError)
    );
  }

  deleteThemeLicence(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
