import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './personal.service';

export interface PaginatedUsersResponse {
  totalCount: number;
  users: User[];
}

export interface Programare {
  programareId: number;
  pacientPacientId: number;
  oraProgramare: string;
  descriereProgramare: string;
  programareEfectuata: boolean;
  userUserId: number;
  user: {
    userId: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    userRole: number;
    specializare: number;
    description: string;
    contActiv: boolean;
    lastLogin: string;
    phone: string;
    password: string | null;
  };
  pacient: {
    pacientId: number;
    name: string;
    phone: string;
    email: string;
    age: number;
  };
  lucrareLucrareId: number;
  lucrare: {
    lucrareId: number;
    numeLucrare: string;
    pretLucrare: number;
    descriereLucrare: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProgramariService {
  private apiUrl = 'https://localhost:7264';

  constructor(private http: HttpClient) {}

  getProgramari(pageNumber: number = 1, pageSize: number = 10, date: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('date', date);
  
    return this.http.get<any>(`${this.apiUrl}/programari`, { params });
  }
  createProgramare(newProgramare: any) {
    return this.http.post(`${this.apiUrl}/programari/`, newProgramare);  // Adjust your API endpoint as needed
  }
  
  getProgramariByPacientId(pacientId: number): Observable<Programare[]> {
    return this.http.get<Programare[]>(`https://localhost:7264/pacienti/${pacientId}/programari`);
  }
  
  
  updateProgramareEfectuata(id: number, programareEfectuata: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/programari/${id}`, { programareEfectuata });
  }
  
  updateProgramare(id: number, updatedProgramare: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/programari/${id}`, updatedProgramare);
  }
  
  deleteProgramare(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/programari/${id}`);
  }

  getPacienti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacienti`);
  }
  
  getUsers(): Observable<PaginatedUsersResponse> {
    return this.http.get<PaginatedUsersResponse>(`${this.apiUrl}/users`);
  }
  
  getLucrari(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lucrari`);
  }
}
