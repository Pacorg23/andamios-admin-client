import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { Comunicado } from '../../models/comunicado';
import { Archivo } from '../../models/archivo';
import { LoadingComponent } from '../../effects/loading/loading.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, LoadingComponent],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {

  accion: any = ""
  file: File
  comunicado:FormGroup
  comunicados:Comunicado[] = []
  pdf:Archivo
  loading:boolean = false

  constructor(private accionesService:ApiService , private fb:FormBuilder) {
    this.loading = true
    this.comunicado = this.fb.group({
      titulo:['',Validators.required],
      comunicado:['',Validators.required],
      link:['']
    })

    this.obtenerComunicados()

  }


  onFileChange(event) {
    this.file = event.target.files[0];
  }

  obtenerComunicados(){
    this.accionesService.obtenerComunicados().subscribe((data)=>{
      data.forEach(comunicado => {
        const dateInMilliseconds = Date.parse(comunicado.createdAt);
        const formattedDate = new Date(dateInMilliseconds).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        comunicado.createdAt = formattedDate;
      });
      this.comunicados = data
      this.obtenerPDF('proveedores')
      this.loading = false
    })
  }

  obtenerPDF(origen){
    this.accionesService.obtenerArchivo(origen).subscribe((data)=>{
      this.pdf = data
    })
  }

  eliminarComunicado(id:number){
    this.loading = true
    this.accionesService.eliminarComunicado(id).subscribe((data)=>{
      Swal.fire({
        title: 'Comunicado eliminado',
        text: 'Los cambios se han realizado con éxito',
        icon: 'success',
        timer:2000
      }).then(()=>{
        this.obtenerComunicados()
      })
    })
  }

  subir() {
    this.loading = true
    if (this.accion == "pdf") { //PDF
      const formData = new FormData();

      formData.append(this.file.name, this.file, this.file.name);
      formData.append('origen', 'proveedores');

      this.accionesService.subirArchivo(formData).subscribe((data) => {
        Swal.fire({
          title: 'PDF subido',
          text: 'Los cambios se han realizado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
          this.file = null
          //this.accion = ""
          this.obtenerPDF('proveedores')
          this.loading = false
        })
      },err=>{
        Swal.fire({
          title: 'No se han realizado cambios',
          text: JSON.stringify(err),
          icon: 'info',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
          this.loading = false
        })
      })

    } else if (this.accion == "com") { //COMUNICADOS

      const form = JSON.stringify(this.comunicado.value)

      if(this.comunicado.valid){
        this.accionesService.crearComunicado(form).subscribe((data) => {
          Swal.fire({
            title: 'Comunicado creado',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(()=>{
            this.comunicado.reset()
            this.accion = ""
            this.obtenerComunicados()
          })
        })
      }else{
        Swal.fire({
          title: 'No se han realizado cambios',
          text: 'Faltan campos por llenar',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
          this.loading = false
        })
      }
    } else {
      //nO HAY OPCION
      Swal.fire({
        title: 'No hay opcones seleccionada',
        text: 'Necesitas seleccionar una opcion',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(()=>{
        this.loading = false
      })
    }
  }


}
