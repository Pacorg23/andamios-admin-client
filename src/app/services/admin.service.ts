import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/admin/usuario';

import { ENV_CONSTANTS } from '../services/environment.service';

const SERVICE_NAME = 'admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private URL: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient ) {
    this.URL = `${ENV_CONSTANTS.API_URL}:${ENV_CONSTANTS.PORT}/${SERVICE_NAME}/`;
  }

  login(usuario) {
    return this.http.post(`${this.URL}login`, usuario, this.httpOptions)
  }

  verificarToken() {
    return this.http.get(`${this.URL}verificarToken`)
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.URL}obtenerUsuarios`)
  }

  crearUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.URL}crearUsuario`, usuario, this.httpOptions)
  }

  verificarPassword(usuario: any) {
    return this.http.post(`${this.URL}verificarPassword`, usuario, this.httpOptions)
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.URL}eliminarUsuario/${id}`)
  }

  modificarUsuario(usuario: any) {
    return this.http.put(`${this.URL}modificarUsuario`, usuario, this.httpOptions)
  }

  /**
   *
   */
  cerrarSesion(adminId: number, sessionId: string) {
    const user = {
      id: adminId
    }
    return this.http.post(`${this.URL}cerrarSesion/${sessionId}`, user, this.httpOptions)
  }

  checkSession() {
    return this.http.get(`${this.URL}/session`)
      .pipe(catchError(this.handleMiddlewareError));
  }

  /**
   * @description  This method is used to end the session of a user.
   * @param userId The id of the user whose session is to be ended.
   * @returns An observable of any type.
   */
  public endUsersSession(userId: number): Observable<any> {
    return this.http.post(`${this.URL}endSessions/${userId}`, {}, this.httpOptions);
  }

  private handleMiddlewareError(error: HttpErrorResponse): Observable<never> {
    const data = error.error;
    return throwError(() => new Error(data));
  }

}
