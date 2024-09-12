import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Programare } from './programari.service';

export interface Pacient {
  pacientId?: number; // Add id field if it's returned from the backend
  name: string;
  phone: string;
  email: string;
  age: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PacientService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7264/pacienti';

  constructor() {}

  getPacienti(page: number, pageSize: number): Observable<PaginatedResponse<Pacient>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<Pacient>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  addPacient(pacient: Pacient): Observable<Pacient> {
    return this.http.post<Pacient>(this.apiUrl, pacient).pipe(
      catchError(this.handleError)
    );
  }

  getProgramariForPacient(pacientId: number): Observable<Programare[]> {
    return this.http.get<Programare[]>(`/api/pacients/${pacientId}/programari`);
  }
  
  updatePacient(pacientId: number, updateData: any): Observable<any> {
    return this.http.patch(`https://localhost:7264/pacienti/${pacientId}`, updateData);
  }

  deletePacient(pacientId: number): Observable<any> {
    return this.http.delete(`https://localhost:7264/pacienti/${pacientId}`);
  }
  
  

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
