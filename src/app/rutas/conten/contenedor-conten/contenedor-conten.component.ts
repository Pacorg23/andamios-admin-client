import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Category } from '../models/category';

import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ContenService } from '../service/conten.service';
import Swal from 'sweetalert2';

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

  typeList: string;
  categorias: Category[];
  secciones: any[];
  subsecciones: any[];
  typeTitle: string;
  sectionSelected: ItemInfo;
  subsectionSelected: ItemInfo;
  numbers = Array.from({ length: 21 }, (_, i) => i);

  constructor(private router: Router, private contenService: ContenService) {
    this.typeList = ListEnum.Category;
    this.typeTitle = _.capitalize(this.typeList);
    this.categorias = [];
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  public getCategorias(): void {
    this.contenService.getCategories().subscribe((response) => {
      this.categorias = response;
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
   * @description Dependiendo el tipo de lista es la accion a realizar
   * @param type tipo de lista
   * @param param parametro para la accion
   * @returns void
   */
  public goTo(type: string, param?: string): void {
    if (_.isNil(param)) {
      this.router.navigate([`conten/${_.lowerCase(type)}`]);
    } else {
      this.router.navigate([`conten/${_.lowerCase(type)}/${param}`]);
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
    if(category.has_sections) {
      //TODO get sections
    }
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
  public editProcess(title?: string): void {
    title = 'example';
    this.router.navigate([`conten/${_.lowerCase(this.typeList)}/${_.lowerCase(title)}`]); //Ejem conten/categoria/manufactura
  }

  /**
   * @description Elimina una categoria, seccion o subseccion
   * @param id id de la categoria, seccion o subseccion
   * @param type tipo de elemento a eliminar
   * @returns void
   */
  public deleteProcess(id: number, type: string): void {
    //TODO delete process
  }
}
