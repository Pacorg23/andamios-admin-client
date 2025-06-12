import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrusel } from '../../../models/andamios/carrusel';
import { Anuncio } from '../../../models/andamios/anuncio';

import { ENV_CONSTANTS } from '../../../../environment.service';

const SERVICE_NAME = 'andamios';

@Injectable({
  providedIn: 'root'
})
export class ApiAndamiosService {

  private URL: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {
    if (!ENV_CONSTANTS.PRODUCTION) {
      this.URL = `${ENV_CONSTANTS.DEV_URL}:${ENV_CONSTANTS.PORT}/${SERVICE_NAME}/`;
    } else {
      this.URL = `${ENV_CONSTANTS.API_URL}/${SERVICE_NAME}/`;
    }
  }

  //CARRUSEL
  obtenerCarrusel(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(`${this.URL}obtenerCarrusel`)
  }

  borrarCarrusel(id: number) {
    return this.http.delete(`${this.URL}eliminarCarrusel/${id}`)
  }

  agregarCarrusel(carrusel: FormData) {
    return this.http.post(`${this.URL}agregarCarrusel`, carrusel)
  }

  modificarCarrusel(carrusel: FormData) {
    return this.http.put(`${this.URL}modificarCarrusel`, carrusel)
  }

  //ANUNCIO
  obtenerAnuncio(): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.URL}obtenerAnuncio`)
  }

  agregarAnuncio(anuncio) {
    return this.http.post(`${this.URL}agregarAnuncio`, anuncio, this.httpOptions)
  }

  modificarAnuncio(anuncio) {
    return this.http.put(`${this.URL}modificarAnuncio`, anuncio, this.httpOptions)
  }


}
