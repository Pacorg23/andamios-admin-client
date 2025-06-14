import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category';
import { Section } from '../models/seccion';
import { Sucursal } from '../../../models/general/sucursal';
import { Carrusel } from '../../../models/andamios/carrusel';
import { FileInput } from '../models/seccion';
import { ENV_CONSTANTS } from '../../../../environment.service';
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
   * @description Inicia una categoría
   * @param {FormData} categoria - Categoría a iniciar
   * @returns {Observable<Category>} - Categoría creada
   */
  public initCategory(categoria: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.URL}/initCategory`, categoria); //initCategory
  }
  /**
   * @description Modifica una categoría
   * @param {FormData} categoria - Categoría a modificada
   * @returns {Observable<Category>} - Categoría modificada
   */
  public setCategory(categoria: FormData): Observable<Category> {
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
  public getSectionsByFatherId(id: Number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.URL}/getSectionsByFatherId/${id}`);
  }
  /**
   * @description Obtiene una categoría
   * @param {string} name - Nombre de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getSectionsById(id: Number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.URL}/getSectionsById/${id}`);
  }
  /**
   * @description Inicia una seccion
   * @param {FormData} categoria - Seccion a iniciar
   * @returns {Observable<Section>} - Seccion creada
   */
  public initSection(seccion: FormData): Observable<Section> {
    return this.http.post<Section>(`${this.URL}/initSection`, seccion); //initCategory
  }
  /**
  * @description Inicia una categoría
  * @param {FormData} categoria - Categoría a iniciar
  * @returns {Observable<Category>} - Categoría creada
  */
  public setSection(categoria: FormData): Observable<Section> {
    return this.http.put<Section>(`${this.URL}/setSection`, categoria); //initCategory
  }
  /**
 * @description Borra una seccion
 * @param {FormData} categoria - Seccion a borrar
 * @returns {Observable<Category>} - Seccion creada
 */
  public deleteSection(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.URL}/deleteSection/${id}`); //initCategory
  }
  /**
  * @description Obtiene una categoría
  * @param {string} name - Nombre de la categoría
  * @returns {Observable<Category>} - Categoría
  */
  public getSectionById(id: Number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSectionById/${id}`);
  }
  /**
  * @description Obtiene una categoría
  * @param {string} name - Nombre de la categoría
  * @returns {Observable<Category>} - Categoría
  */
  public getSectionInfo(id: Number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSectionInfo/${id}`);
  }
  //Subsecciones
  /**
   * @description Obtiene una categoría
   * @param {string} name - Nombre de la categoría
   * @returns {Observable<Category>} - Categoría
   */
  public getSubsectionsByFatherId(id: Number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.URL}/getSubsectionsByFatherId/${id}`);
  }
  /**
   * @description Inicia una seccion
   * @param {FormData} categoria - Seccion a iniciar
   * @returns {Observable<Section>} - Seccion creada
   */
  public initSubsection(seccion: FormData): Observable<Section> {
    return this.http.post<Section>(`${this.URL}/initSubsection`, seccion); //initCategory
  }
  /**
  * @description Borra una seccion
  * @param {FormData} categoria - Seccion a borrar
  * @returns {Observable<Category>} - Seccion creada
  */
  public deleteSubsection(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.URL}/deleteSubsection/${id}`); //initCategory
  }
  /**
  * @description Borra una seccion
  * @param {FormData} categoria - Seccion a borrar
  * @returns {Observable<Category>} - Seccion creada
  */
  public getSubsectionsById(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.URL}/getSubsectionsById/${id}`); //initCategory
  }
  /**
  * @description Borra una seccion
  * @param {FormData} categoria - Seccion a borrar
  * @returns {Observable<Category>} - Seccion creada
  */
  public setSubsection(subseccion: FormData): Observable<Section> {
    return this.http.put<Section>(`${this.URL}/setSubsection`, subseccion); //initCategory
  }


  //Imagenes
  /**
     * @description Inicia una imagen
     * @param {FormData} categoria - Imagen a iniciar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public initImage(seccion: FormData): Observable<FileInput> {
    return this.http.post<FileInput>(`${this.URL}/initImage`, seccion); //initCategory
  }
  /**
     * @description Borra una imagen
     * @param {FormData} categoria - Imagen a borrar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public deleteImage(id: number): Observable<number> {
    return this.http.delete<number>(`${this.URL}/deleteImage/${id}`); //initCategory
  }
  /**
     * @description Borra una imagen
     * @param {FormData} categoria - Imagen a borrar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public getImagesByCategoryId(id: number): Observable<FileInput[]> {
    return this.http.get<FileInput[]>(`${this.URL}/getImagesByCategoryId/${id}`); //initCategory
  }
  /**
     * @description Borra una imagen
     * @param {FormData} categoria - Imagen a borrar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public restartImagesCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesCategory/${id}`); //initCategory
  }
  /**
     * @description Borra una imagen
     * @param {FormData} categoria - Imagen a borrar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public restartImagesSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesSection/${id}`); //initCategory
  }
  /**
     * @description Borra una imagen
     * @param {FormData} categoria - Imagen a borrar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public restartImagesSubsection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/restartImagesSubsection/${id}`); //initCategory
  }

  //Files
  /**
     * @description Inicia una imagen
     * @param {FormData} categoria - Imagen a iniciar
     * @returns {Observable<ImagesInput>} - Imagen creada
     */
  public initFile(seccion: FormData): Observable<FileInput> {
    return this.http.post<FileInput>(`${this.URL}/initFile`, seccion); //initCategory
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
