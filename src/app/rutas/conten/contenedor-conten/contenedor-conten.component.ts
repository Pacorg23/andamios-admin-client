import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Category } from '../models/category';

import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ContenService } from '../service/conten.service';
import Swal from 'sweetalert2';
import { Seccion } from '../../../models/general/navbar';
import { Section } from '../models/seccion';

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
  comesFrom: string;
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
  public subsecciones: Seccion[];
  public typeTitle: string;
  public sectionSelected: ItemInfo;
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
    this.getCategorias();
  }

  public getCategorias(): void {
    this.contenService.getCategories().subscribe((response) => {
      this.categorias = response;
      console.log(this.categorias)
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
  public goTo(type: string, param?: number): void {
    if (!param) {
      this.router.navigate([`conten/${_.lowerCase(type)}`]);
    } else {
      //PARAM es el tipo de categoria para mostarr el formulario de seccion o subseccion
      param = _.lowerCase('Ejemplo');
      this.router.navigate([`conten/${_.lowerCase(type)}/${this.sectionSelected.id}`]);
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
        //TODO get categories
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
   * @description Obtiene las secciones de una categoria
   * @param category categoria seleccionada
   * @returns void
   */
  public getSections(category?: Category): void {
    this.typeList = ListEnum.Section;
    this.typeTitle = _.capitalize(this.typeList);
    this.sectionSelected = {
      title: category.title,
      id: category.id,
      comesFrom: category.title
    }
    // TODO recuerda que las secciones son de la categoria seleccionada y solo las de tipo B pueden tener subsecciones
    this.categoryTypeSelected = category.tipo;
    // TODO obtener secciones de la categoria seleccionada
    this.contenService.getSectionsById(this.sectionSelected.id).subscribe((response) => {
      this.secciones = response;
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
   * @description Obtiene las subsecciones de una seccion
   * @param section seccion seleccionada
   * @returns void
   */
  public getSubsections(section?: any): void {
    this.typeList = ListEnum.Subsection;
    this.typeTitle = _.capitalize(this.typeList);
    this.subsectionSelected = {
      title: section.title,
      id: section.id,
      comesFrom: section.title
    }
    //TODO get subsections
  }

  /**
   * @description Edita una categoria, seccion o subseccion
   * @param title titulo de la categoria, seccion o subseccion
   * @returns void
   */
  public editProcess(id?: number): void {
    this.router.navigate([`conten/${_.lowerCase(this.typeList)}/${id}`]); //Ejem conten/categoria/manufactura
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
        this.contenService.deleteCategories(id).subscribe((response) => {
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener las categorias',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
        //TODO delete process
        Swal.fire({
          title: 'Eliminado',
          text: `Se ha eliminado la ${type} con id ${id}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
          this.getCategorias()
        })

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
