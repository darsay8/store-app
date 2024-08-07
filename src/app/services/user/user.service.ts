import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, switchMap } from 'rxjs';

import { User } from '../../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.tokenFB}`,
    }),
  };

  private dataUrl = `${environment.urlFB}${environment.appName}users.json?alt=media`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<{ data: { users: User[] } }>(this.dataUrl).pipe(
      map((response) => response.data.users),
      catchError(this.handleError)
    );
  }

  getUserById(userId: number): Observable<User | undefined> {
    return this.http.get<any>(this.dataUrl).pipe(
      map((response) => {
        const users = response.data.users;
        const user = users.find((u: User) => u.id === userId);
        return user;
      }),
      catchError((error) => {
        console.error('Error getting user by ID:', error);
        return throwError(error);
      })
    );
  }

  addUser(users: {}): Observable<any> {
    return this.http.post<any>(this.dataUrl, users, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    return this.http.get<any>(this.dataUrl).pipe(
      switchMap((response) => {
        const users = response.data.users;
        const index = users.findIndex((u: User) => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          const usersForSave = { data: { users } };
          return this.http.post<any>(
            this.dataUrl,
            usersForSave,
            this.httpOptions
          );
        } else {
          return throwError(`User with ID ${user.id} not found.`);
        }
      }),
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.get<any>(this.dataUrl).pipe(
      switchMap((response) => {
        const users = response.data.users;
        const index = users.findIndex((u: User) => u.id === userId);
        if (index !== -1) {
          users.splice(index, 1);
          const usersForSave = { data: { users } };
          return this.http.post<any>(
            this.dataUrl,
            usersForSave,
            this.httpOptions
          );
        } else {
          return throwError(`User with ID ${userId} not found.`);
        }
      }),
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(error);
      })
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
