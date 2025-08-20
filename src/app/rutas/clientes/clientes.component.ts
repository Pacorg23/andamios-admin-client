import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { Archivo } from '../../models/archivo';
import { LoadingComponent } from '../../effects/loading/loading.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  file:File
  archivo:Archivo
  loading:boolean = false

  constructor(private accionesService:ApiService){
    this.obtenerArchivo()
  }

  onFileChange(event) {
    this.file = event.target.files[0];
  }

  obtenerArchivo(){
    this.accionesService.obtenerArchivo('clientes').subscribe((data:Archivo) => {
      this.archivo = data
      this.loading = false
    })
  }

  subir() {
    this.loading = true
    if (this.file) {
      const formData = new FormData();

      formData.append(this.file.name, this.file, this.file.name);
      formData.append('origen', 'clientes');

      this.accionesService.subirArchivo(formData).subscribe((data) => {
        Swal.fire({
          title: 'PDF subido',
          text: 'Los cambios se han realizado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.file = null
          window.location.reload()
          this.loading = false
        })
      }, err => {
        Swal.fire({
          title: 'No se han realizado cambios',
          text: err,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.loading = false
        })
      })

    } else {
      Swal.fire({
        title: 'No hay un archivo seleccionado',
        text: 'Necesitas seleccionar una opcion',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.loading = false
      })
    }
  }
}
