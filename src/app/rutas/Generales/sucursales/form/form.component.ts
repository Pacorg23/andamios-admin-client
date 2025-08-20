import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sucursal } from '../../../../models/general/sucursal';
import { fadeInAnimation } from '../../../../effects/fadeIn';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../../../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule, MatIcon],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  animations:[fadeInAnimation]
})
export class FormComponent {

  @Input() sucursal:Sucursal;
  @Output() cerrar = new EventEmitter<void>();
  form:FormGroup

  constructor(private fb:FormBuilder, private apiService:ApiService){
    this.form = this.fb.group({
      nombre:[''],
      direccion:[''],
      telefono:[''],
      maps:[''],
    })
  }

  ngOnChanges(){
    this.form.patchValue({
      nombre: this.sucursal.nombre,
      direccion: this.sucursal.direccion,
      telefono: this.sucursal.telefono,
      maps: this.sucursal.maps
    })
  }

  close(){
    document.getElementById('contenedor').classList.add('fadeOut')
    setTimeout(() => {
      this.form.reset()
      this.cerrar.emit();
    },500)
  }

  subir(){
    if(this.sucursal.id){
      let sucursalNueva = {
        id: this.sucursal.id,
        ...this.form.value
      }
      this.apiService.modificarSucursal(JSON.stringify(sucursalNueva)).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucursal modificada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.close()
        })
      },error=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al modificar',
          showConfirmButton: false,
          timer: 1500
        })
      })
    }else{
      let sucursalNueva = {
          division: this.sucursal.division,
        ...this.form.value
      }

      this.apiService.agregarSucursal(JSON.stringify(sucursalNueva)).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucursal agregada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.close()
        })
      },error=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar',
          showConfirmButton: false,
          timer: 1500
        })
      })
    }
  }

}
