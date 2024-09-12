import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  userRole: number;
  phone: string;
  contActiv: boolean;
}

export interface PaginatedUsersResponse {
  totalCount: number;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private baseUrl = 'https://localhost:7264/users';

  constructor(private http: HttpClient) {}

  // Fetch users with pagination
  getUsers(pageNumber: number, pageSize: number): Observable<PaginatedUsersResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedUsersResponse>(this.baseUrl, { params });
  }

  activateUser(userId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${userId}`, { contActiv: true });
  }
  updateUser(userId: number, updateData: any): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${userId}`, updateData);
  }  
  // This should be the backend URL, not the frontend
updateCurrentUser(updatedUserData: any) {
  return this.http.patch('https://localhost:7264/users/me', updatedUserData);
}

  
  resetPassword(userId: number, newPassword: string): Observable<any> {
    const body = { newPassword }; // Ensure newPassword is sent as an object, matching ResetPasswordDto
    return this.http.patch<any>(`${this.baseUrl}/${userId}/reset-password`, body);
  }
  resetPasswordUser(userId: number, resetPasswordDto: { currentPassword: string, newPassword: string }) {
    return this.http.patch(`https://localhost:7264/users/${userId}/reset-password`, resetPasswordDto);
  }
   // Method to get the current user's profile
   getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

deleteUser(userId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${userId}`);
}

  getDoctorById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
}
