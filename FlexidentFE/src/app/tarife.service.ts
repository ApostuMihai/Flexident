import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lucrare } from './tarife/tarife.component';

@Injectable({
  providedIn: 'root'
})
export class TarifeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7264/lucrari';

  getLucrari(): Observable<Lucrare[]> {
    return this.http.get<Lucrare[]>(this.apiUrl);
  }
  getLucrareById(lucrareId: number): Observable<Lucrare> {
    return this.http.get<Lucrare>(`https://localhost:7264/lucrari/${lucrareId}`);
  }
  
}
