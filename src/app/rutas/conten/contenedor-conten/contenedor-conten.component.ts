import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Category } from '../models/category';

import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ContenService } from '../service/conten.service';
import Swal from 'sweetalert2';
import { Section } from '../models/seccion';
import { ConstantsConten } from '../constantes-conten';

export enum ListEnum {
  Category = 'categoria',
  Section = 'seccion',
  Subsection = 'subseccion',
}

export interface ListInfo {
  type: string;
  title: string;
  action: string;
}

export interface ItemInfo {
  id: number;
  title: string;
  type?: string;
}

@Component({
  selector: 'app-contenedor-conten',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './contenedor-conten.component.html',
  styleUrl: './contenedor-conten.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContenedorContenComponent implements OnInit {

  public typeList: string;
  public categorias: Category[];
  public secciones: Section[];
  public subsecciones: Section[];
  public typeTitle: string;
  public sectionSelected: ItemInfo;
  public categorySelected: ItemInfo;
  public subsectionSelected: ItemInfo;
  public categoryTypeSelected: string;
  public numbers = Array.from({ length: 21 }, (_, i) => i);

  constructor(private router: Router, private contenService: ContenService) {
    this.typeList = ListEnum.Category;
    this.typeTitle = _.capitalize(this.typeList);
    this.categorias = [];
    this.secciones = [];
  }

  ngOnInit(): void {
    if (_.isEqual(this.typeList, ListEnum.Category)) {
      this.getCategorias();
    }
  }
  toggleActive(id: number): void {
    this.contenService.toggleActive(id).subscribe((response) => {
      Swal.fire({
        title: 'Exito',
        text: `Se ha cambiado el estado de la categoria con id ${id}`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.categorias.find(cat => cat.id === id).is_active = !this.categorias.find(cat => cat.id === id).is_active;
      });
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: 'Error al cambiar el estado de la categoria',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }
  /**
   * @description Obtiene las categorias
   * @returns void
   */
  public getCategorias(): void {
    this.contenService.getCategories().subscribe((response) => {
      console.log(response);
      this.categorias = response;
      console.log(this.categorias);
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: 'Error al obtener las categorias',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    );
  }

  /**
   * @description Dependiendo el tipo de lista es la accion a realizar, pero siempre es crear
   * @param type tipo de lista
   * @param param parametro para la accion
   * @returns void
   */
  public goTo(type: string): void {
    if (this.typeList == "seccion") {

      if (_.isNil(this.categorySelected?.id)) {
        this.router.navigate([`conten/${_.lowerCase(type)}`]);
      } else {
        this.router.navigate([`conten/${_.lowerCase(type)}/${this.categorySelected.id}`]);
      }
    }
    else if (this.typeList == "subseccion") {
      if (_.isNil(this.sectionSelected?.id)) {
        this.router.navigate([`conten/${_.lowerCase(type)}`]);
      } else {
        this.router.navigate([`conten/${_.lowerCase(type)}/${this.sectionSelected.id}`]);
      }
    } else {
      this.router.navigate([`conten/${_.lowerCase(type)}`]);

    }
  }

  /**
   * @description Regresa a la lista anterior
   * @param void
   * @returns void
   */
  public goBack(): void {
    switch (this.typeList) {
      case ListEnum.Section:
        this.typeList = ListEnum.Category;
        this.typeTitle = _.capitalize(this.typeList);
        this.getCategorias();
        this.cleanCategoryObject();
        break;
      case ListEnum.Subsection:
        this.typeList = ListEnum.Section;
        this.typeTitle = _.capitalize(this.typeList);
        //TODO get sections from sectionSelected
        break;
      default:
        break;
    }
  }

  /**
   * @description Limpia el objeto de categoria seleccionada
   * @param void
   * @returns void
   */
  private cleanCategoryObject(): void {
    this.categorySelected = {
      title: '',
      id: undefined
    }
  }

  /**
   * @description Obtiene las secciones de una categoria
   * @param category categoria seleccionada
   * @returns void
   */
  public getSections(category?: Category): void {

    this.typeList = ListEnum.Section;
    this.typeTitle = _.capitalize(this.typeList);
    if (category) {

      this.categorySelected = {
        title: category.title,
        id: category.id,
        type: category.tipo
      }
      this.categoryTypeSelected = category.tipo;
    }
    this.contenService.getSectionsByFatherId(this.categorySelected.id).subscribe((response) => {
      this.secciones = response;
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: 'Error al obtener las secciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    );
  }

  /**
   * @description Obtiene las subsecciones de una seccion
   * @param section seccion seleccionada
   * @returns void
   */
  public getSubsections(section?: any): void {
    this.typeList = ListEnum.Subsection;
    this.typeTitle = _.capitalize(this.typeList);
    if (section) {

      this.sectionSelected = {
        title: section.title,
        id: section.id
      }
    }

    this.contenService.getSubsectionsByFatherId(this.sectionSelected.id).subscribe((response) => {
      this.subsecciones = response;
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: 'Error al obtener las subsecciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    );
  }

  /**
   * @description Edita una categoria, seccion o subseccion
   * @param title titulo de la categoria, seccion o subseccion
   * @returns void
   */
  public editProcess(id?: number): void {
    if (_.isEqual(this.typeList, ListEnum.Category)) {
      this.router.navigate([`conten/${_.lowerCase(this.typeList)}/${id}`]);
    } else if (_.isEqual(this.typeList, ListEnum.Section)) {
      this.router.navigate([`conten/${_.lowerCase(this.typeList)}/${this.categorySelected.id}/${id}`]);
    } else if (_.isEqual(this.typeList, ListEnum.Subsection)) {
      this.router.navigate([`conten/${_.lowerCase(this.typeList)}/${this.sectionSelected.id}/${id}`]);
    }
  }

  /**
   * @description Elimina una categoria, seccion o subseccion
   * @param id id de la categoria, seccion o subseccion
   * @param type tipo de elemento a eliminar
   * @returns void
   */
  public deleteProcess(id?: number, type?: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la ${type} con id ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        switch (type) {
          case "categoria":
            this.contenService.deleteCategories(id).subscribe((response) => {
              Swal.fire({
                title: 'Eliminado',
                text: `Se ha eliminado la ${type} con id ${id}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                this.getCategorias()
              })
            }, (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Error al borrar la categoria',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
            );
            break;

          case "seccion":
            this.contenService.deleteSection(id).subscribe((response) => {
              Swal.fire({
                title: 'Eliminado',
                text: `Se ha eliminado la ${type} con id ${id}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                this.getSections()
              })
            }, (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Error al borrar la seccion',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
            );
            break;
          case "subseccion":
            this.contenService.deleteSubsection(id).subscribe((response) => {
              Swal.fire({
                title: 'Eliminado',
                text: `Se ha eliminado la ${type} con id ${id}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                this.getSubsections()
              })
            }, (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Error al borrar la subseccion',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
            );
            break;

          default:
            break;
        }
        //TODO delete process


      } else {
        Swal.fire({
          title: 'Cancelado',
          text: `No se ha eliminado la ${type} con id ${id}`,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
