import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category';
import { Seccion } from '../models/seccion';
import { Sucursal } from '../../../models/general/sucursal';
import { Carrusel } from '../../../models/andamios/carrusel';

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

  /**
   * @description obtene una sucursales
   * @param {void}
   * @returns {Observable<Sucursal[]>}
   */
  public obtenerSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.URL}/obtenerSucursales`);
  }

  /**
   * @description Agregar una sucursal
   * @param {FormData} sucursal - Sucursal a agregar
   * @returns {Observable<Sucursal>} - Sucursal creada
   */
  public agregarSucursal(sucursal: FormData): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.URL}/sucursales`, sucursal);
  }

  /**
   * @description Eliminar una sucursal
   * @param {number} id - ID de la sucursal a eliminar
   * @returns {Observable<void>} - Void
   */
  public eliminarSucursal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/eliminarSucursales/${id}`);
  }

  /**
   * @description Editar una sucursal
   * @param {FormData} sucursal - Sucursal a editar
   * @returns {Observable<Sucursal>} - Sucursal editada
   */
  public editarSucursal(sucursal: FormData): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.URL}/modificarSucursales`, sucursal);
  }

  /**
   * @description Agregar carrusel
   * @param {FormData} carrusel - Carrusel a agregar
   * @returns {Observable<Carrusel>} - Carrusel creado
   */
  public agregarCarrusel(carrusel: FormData): Observable<Carrusel> {
    return this.http.post<Carrusel>(`${this.URL}/carrusel`, carrusel);
  }

  /**
   * @description Obtener carrusel
   * @param {void}
   * @returns {Observable<Carrusel[]>} - Carrusel
   */
  public obtenerCarrusel(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(`${this.URL}/obtenerCarrusel`);
  }

  /**
   * @description Borrar carrusel
   * @param {number} id - ID del carrusel a borrar
   * @returns {Observable<void>} - Void
   */
  public borrarCarrusel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/borrarCarrusel/${id}`);
  }

  /**
   * @description Editar carrusel
   * @param {FormData} carrusel - Carrusel a editar
   * @returns {Observable<Carrusel>} - Carrusel editado
   */
  public editarCarrusel(carrusel: FormData): Observable<Carrusel> {
    return this.http.put<Carrusel>(`${this.URL}/modificarCarrusel`, carrusel);
  }

}
