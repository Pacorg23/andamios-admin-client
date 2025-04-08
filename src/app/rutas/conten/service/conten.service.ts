import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category';
import { Seccion } from '../models/seccion';

@Injectable({
  providedIn: 'root',
})
export class ContenService {

  // private URL = 'http://localhost:3032/api/formdata'; //http://localhost:3000/conten/
  private URL = 'http://localhost:3000/conten';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }
  //Categorias
  /**
   * @description Inicia una categoría
   * @param {FormData} categoria - Categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public initCategory(categoria: FormData): Observable<Category> {
    console.log(categoria)
    return this.http.post<Category>(`${this.URL}/initCategory`, categoria); //initCategory
  }
  /**
   * @description Inicia una categoría
   * @param {FormData} categoria - Categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public setCategory(categoria: FormData): Observable<Category> {
    console.log(categoria)
    return this.http.put<Category>(`${this.URL}/setCategory`, categoria); //initCategory
  }
  /**
   * @description Inicia una categoría
   * @param {FormData} categoria - Categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public addImage(categoria: FormData): Observable<Category> {
    console.log(categoria)
    return this.http.put<Category>(`${this.URL}/setCategory`, categoria); //initCategory
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
  public getCategoriesById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.URL}/getCategoriesById/${id}`);
  }

  public deleteCategories(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/deleteCategories/${id}`);
  }
  //Secciones
  /**
   * @description Obtiene una categoría
   * @param {string} name - Nombre de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getSectionsById(id: Number): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.URL}/getSectionsById/${id}`);
  }
  /**
   * @description Inicia una seccion
   * @param {FormData} categoria - Seccion a iniciar
   * @returns {Observable<Section>} - Seccion creada
   */
  public initSection(seccion: FormData): Observable<Seccion> {
    console.log(seccion)
    return this.http.post<Seccion>(`${this.URL}/initSection`, seccion); //initCategory
  }
}
