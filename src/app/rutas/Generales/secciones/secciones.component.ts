import { Component } from '@angular/core';
import { Categoria } from '../../../models/general/navbar';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../effects/loading/loading.component';
import { ActivatedRoute } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';

@Component({
  selector: 'app-secciones',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, ScrollingModule,
    MatMenuModule, FormularioComponent, MatExpansionModule, LoadingComponent
  ],
  templateUrl: './secciones.component.html',
  styleUrl: './secciones.component.css'
})
export class SeccionesComponent {

  categorias: Categoria[] = [];
  seleccion: any = {
    id: 0, //id de la categoria, seccion o subseccion
    nombre: "", //nombre de la categoria, seccion o subseccion
    tipo: "",
    accion: "", //agregar, editar
    objetivo: "" //categoria, seccion, subseccion
  }
  //open form
  openForm: boolean = false;
  loading: boolean = false;
  area:string = "";

  constructor(private apiService: ApiService,
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loading = true;
    this.activatedroute.params.subscribe(params => {
      this.area = params['area'];
      this.obtenerCategorias()
    })
  }

  obtenerCategorias() {
    this.apiService.obtenerNavbar(this.area).subscribe(data => {
      this.categorias = data;
      this.loading = false;
    });
  }

  crearFormulario(id, nombre, accion, objetivo, tipo) {
    this.openForm = true;

    this.seleccion = {
      id: id,
      nombre: nombre, //nombre de la categoria, seccion o subseccion
      accion: accion, //agregar, editar
      objetivo: objetivo, //categoria, seccion, subseccion
      tipo: tipo // A B C D
    }

    //alert("nombre: "+ nombre + ", " +accion + " " + objetivo+ ", tipo formulario: "+tipo)
  }

  eliminar(id, objetivo) {


    Swal.fire({
      title: '¿Estas seguro de eliminar?',
      text: 'No podras revertir esta accion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#cf142b',
      cancelButtonColor: '#000000'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        if (objetivo == "categoria") {
          this.apiService.eliminarCategoria(id).subscribe(data => {
            Swal.fire({
              title: 'Categoria eliminada',
              text: 'La categoria ha sido eliminada',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            }).then((result) => {
              if (result.isConfirmed) {
                this.obtenerCategorias();
              }
            })
          }, error => {
            Swal.fire({
              title: 'Ocurrio un error al eliminar la categoria',
              text: error,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            })
          })
        } else if (objetivo == "seccion") {
          this.apiService.eliminarSeccion(id).subscribe(data => {
            Swal.fire({
              title: 'Seccion eliminada',
              text: 'La seccion ha sido eliminada',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            }).then((result) => {
              if (result.isConfirmed) {
                this.obtenerCategorias();
              }
            })
          }, error => {
            Swal.fire({
              title: 'Ocurrio un error al eliminar la seccion',
              text: error,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            })
          })
        } else if (objetivo == "subseccion") {
          this.apiService.eliminarSubseccion(id).subscribe(data => {
            Swal.fire({
              title: 'Subseccion eliminada',
              text: 'La subseccion ha sido eliminada',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            }).then((result) => {
              if (result.isConfirmed) {
                this.obtenerCategorias();
              }
            })
          }, error => {
            Swal.fire({
              title: 'Ocurrio un error al eliminar la subseccion',
              text: error,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            })
          })
        }
      }else{
        this.loading = false;
      }
    })


  }

  actualizarNavbar() {
    this.obtenerCategorias();
  }

  goBack() {
    window.history.back();
  }
}
