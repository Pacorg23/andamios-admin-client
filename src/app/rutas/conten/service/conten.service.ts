import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category';
import { Section } from '../models/seccion';
import { Sucursal } from '../../../models/general/sucursal';
import { Carrusel } from '../../../models/andamios/carrusel';
import { FileInput } from '../models/seccion';
import { ENV_CONSTANTS } from '../../../services/environment.service';
const SERVICE_NAME = 'conten';

@Injectable({
  providedIn: 'root',
})
export class ContenService {

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
      this.URL = `${ENV_CONSTANTS.API_URL}/${SERVICE_NAME}`;
    }
  }

  //Categorias
  /**
   * @description Activa o desactiva una categoria segun su Id
   * @param {FormData} Id - Datos de la categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public toggleActive(Id: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.URL}/toggleActive/${Id}`, this.httpOptions);
  }
  /**
   * @description Inicia una categoría
   * @param {FormData} categoria - Datos de la categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public initCategory(categoria: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.URL}/initCategory`, categoria);
  }

  /**
   * @description Modifica una categoría
   * @param {FormData} categoria - Datos de la categoría a modificada
   * @returns {Observable<Category>} - Categoría modificada
   */
  public setCategory(categoria: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.URL}/setCategory`, categoria);
  }

  /**
   * @description Obtiene las categorías sin imagenes para mostrar en la lista de admin
   * @param {void}
   * @returns {Observable<Category[]>} - Categorías
   */
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.URL}/getCategories`);
  }

  /**
   * @description Obtiene una categoría según su URL
   * @param {string} name - Nombre de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getCategory(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.URL}/getCategory/${name}`);
  }

  /**
   * @description Obtiene una categoría según su Id
   * @param {number} id - Id de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getCategoriesById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.URL}/getCategoriesById/${id}`);
  }
  /**
   * @description Borra una categoría según su Id
   * @param {number} id - Nombre de la categoría
   * @returns {Observable<void>}
   */
  public deleteCategories(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/deleteCategories/${id}`);
  }
  //Secciones
  /**
   * @description Obtiene un arreglo de secciones segun el Id de su Categoria padre
   * @param {Number} id - URL de la Sección
   * @returns {Observable<Section[]>} - Arreglo de secciones
   */
  public getSectionsByFatherId(id: Number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.URL}/getSectionsByFatherId/${id}`);
  }

  /**
   * @description Inicia una seccion
   * @param {FormData} seccion - Sección a iniciar
   * @returns {Observable<Section>} - Sección iniciada
   */
  public initSection(seccion: FormData): Observable<Section> {
    return this.http.post<Section>(`${this.URL}/initSection`, seccion);
  }

  /**
  * @description Modifica una Sección
  * @param {FormData} categoria - Sección a modificar
  * @returns {Observable<Section>} - Sección modificada
  */
  public setSection(categoria: FormData): Observable<Section> {
    return this.http.put<Section>(`${this.URL}/setSection`, categoria);
  }

  /**
 * @description Borra una Sección
 * @param {number} id - Id de la secció a borrar
 * @returns {Observable<boolean>} - Borrado exitoso/fallido
 */
  public deleteSection(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.URL}/deleteSection/${id}`);
  }

  /**
  * @description Obtiene una Sección por su Id
  * @param {Number} id - Nombre de la Sección
  * @returns {Observable<Section>} - Sección
  */
  public getSectionById(id: Number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSectionById/${id}`);
  }

  /**
  * @description Obtiene la información de una sección según su id
  * @param {Number} id - Id de la sección
  * @returns {Observable<Section>} - Sección
  */
  public getSectionInfo(id: Number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSectionInfo/${id}`);
  }

  //Subsecciones
  /**
   * @description Obtiene una subsección según el id de su sección padre.
   * @param {Number} id - Nombre de la sección padre
   * @returns {Observable<Category>} - Subsección
   */
  public getSubsectionsByFatherId(id: Number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.URL}/getSubsectionsByFatherId/${id}`);
  }

  /**
   * @description Inicia una subsección
   * @param {FormData} subseccion - Subsección a iniciar
   * @returns {Observable<Section>} - Subsección creada
   */
  public initSubsection(subseccion: FormData): Observable<Section> {
    return this.http.post<Section>(`${this.URL}/initSubsection`, subseccion);
  }

  /**
  * @description Borra una subsección
  * @param {number} id - Id de la subsección a borrar
  * @returns {Observable<boolean>} - Borrado exitoso/fallido
  */
  public deleteSubsection(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.URL}/deleteSubsection/${id}`);
  }

  /**
  * @description Obtiene una subsección según su id
  * @param {Section} id - Id de la Subsección a obtener
  * @returns {Observable<Section>} - Subsección requerida
  */
  public getSubsectionsById(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSubsectionsById/${id}`);
  }

  /**
  * @description Modifica una subsección
  * @param {FormData} subseccion - Subsección a modificar
  * @returns {Observable<Section>} - Subsección modificada
  */
  public setSubsection(subseccion: FormData): Observable<Section> {
    return this.http.put<Section>(`${this.URL}/setSubsection`, subseccion);
  }

  //Imagenes
  /**
     * @description Inicia una imagen
     * @param {FormData} categoria - Imagen a iniciar
     * @returns {Observable<FileInput>} - Imagen creada
     */
  public initImage(imagen: FormData): Observable<FileInput> {
    return this.http.post<FileInput>(`${this.URL}/initImage`, imagen);
  }

  /**
     * @description Borra una imagen
     * @param {number} id - Imagen a borrar
     * @returns {Observable<number>} - Id imagen borrada
     */
  public deleteImage(id: number): Observable<number> {
    return this.http.delete<number>(`${this.URL}/deleteImage/${id}`);
  }

  /**
     * @description Obtiene un arreglo de imagenes segun el id de la Categoria correspondiente
     * @param {number} id - Id de la categoria relacionada con las imagenes
     * @returns {Observable<ImagesInput>} - Arreglo de imagenes
     */
  public getImagesByCategoryId(id: number): Observable<FileInput[]> {
    return this.http.get<FileInput[]>(`${this.URL}/getImagesByCategoryId/${id}`);
  }

  /**
     * @description Reinicia las imagenes relacionadas a una categoria
     * @param {number} id - Id de la categoria cuyas imagenes van a ser reiniciadas
     * @returns {Observable<void>}
     */
  public restartImagesCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesCategory/${id}`);
  }

  /**
     * @description Reinicia las imagenes relacionadas a una sección
     * @param {number} id - Id de la sección cuyas imagenes van a ser reiniciadas
     * @returns {Observable<void>}
     */
  public restartImagesSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesSection/${id}`);
  }

  /**
     * @description Reinicia las imagenes relacionadas a una subsección
     * @param {number} id - Id de la subsección cuyas imagenes van a ser reiniciadas
     * @returns {Observable<void>}
     */
  public restartImagesSubsection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesSubsection/${id}`);
  }

  //Files
  /**
     * @description Inicia un archivo
     * @param {FormData} file - Archivo a iniciar
     * @returns {Observable<FileInput>} - Archivo creado
     */
  public initFile(file: FormData): Observable<FileInput> {
    return this.http.post<FileInput>(`${this.URL}/initFile`, file);
  }

  // CARRUSEL
  public borrarCarrusel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/borrarCarrusel/${id}`);
  }

  public obtenerCarrusel(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(`${this.URL}/obtenerCarrusel`);
  }

  public agregarCarrusel(carrusel: FormData): Observable<Carrusel> {
    return this.http.post<Carrusel>(`${this.URL}/carrusel`, carrusel);
  }

  public editarCarrusel(carrusel: FormData): Observable<Carrusel> {
    return this.http.put<Carrusel>(`${this.URL}/modificarCarrusel`, carrusel);
  }

  // Sucursales

  public obtenerSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.URL}/obtenerSucursales`);
  }

  public agregarSucursal(sucursal: FormData): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.URL}/sucursales`, sucursal);
  }

  public editarSucursal(sucursal: FormData): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.URL}/modificarSucursales`, sucursal);
  }

  public eliminarSucursal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/eliminarSucursales/${id}`);
  }


}
