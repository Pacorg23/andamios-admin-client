import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class ContenService {

  private URL = 'http://localhost:3032/api/formdata'; //http://localhost:3000/conten/

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  /**
   * @description Inicia una categoría
   * @param {FormData} categoria - Categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public initCategory(categoria: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.URL}/initCategory`, categoria); //initCategory
  }

  /**
   * @description Obtiene las categorías
   * @param {void}
   * @returns {Observable<Category[]>} - Categorías
   */
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.URL}/getCategories`);
  }

  /**
   * @description Obtiene una categoría
   * @param {string} name - Nombre de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getCategory(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.URL}/getCategory/${name}`);
  }
}
