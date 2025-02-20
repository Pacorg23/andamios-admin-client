import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/admin/usuario';
import Swal from 'sweetalert2';
import { SESSION_ERROR } from './api.service';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private URL = "http://localhost:3000/admin/"

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient, private tokenService: JwtService, private router: Router) { }

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

  private handleMiddlewareError(error: HttpErrorResponse): Observable<never> {
    const data = error.error;
    return throwError(() => new Error(data));
  }

}
