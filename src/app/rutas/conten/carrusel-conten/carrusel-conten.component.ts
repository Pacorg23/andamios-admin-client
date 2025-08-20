import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { fadeInAnimation } from '../../../effects/fadeIn';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Carrusel } from '../../../models/andamios/carrusel';
import { ApiAndamiosService } from '../../andamios/service/api-andamios.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from '../../../effects/loading/loading.component';
import { ContenService } from '../service/conten.service';
import { CommonModule } from '@angular/common';
import _ from 'lodash';

@Component({
  selector: 'app-carrusel-conten',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, LoadingComponent, CommonModule],
  templateUrl: './carrusel-conten.component.html',
  styleUrl: './carrusel-conten.component.css',
  animations: [fadeInAnimation,
    trigger('animacion', [
      state('void', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('void => visible', animate('500ms ease-in')),
      transition('visible => void', animate('500ms ease-out'))
    ])
  ]
})
export class CarruselContenComponent {

  carrusel: Carrusel[]
  formulario: FormGroup
  estado = 'void';
  editar = false;
  imagen: File;
  imagenResponsive: File;
  idEditado: number;
  datoEditado: string;
  loading: boolean = false;
  actionActive: boolean = false;
  isChecked: boolean = false;

  constructor(private contenService: ContenService
    , private fb: FormBuilder) {
    this.loading = true
    this.formulario = this.fb.group({
      imagen1: new FormControl([''], Validators.required),
      imagen2: new FormControl([''], Validators.required),
      needsAction: new FormControl([false]),
      action: new FormControl([''])
    })
    this.formulario.get('needsAction')?.setValue(false);
    this.actionActive = false;
  }

  ngOnInit() {
    this.show()
  }

  delete(id: number) {
    this.loading = true
    Swal.fire({
      title: "¿Estas seguro de que quieres eliminar esta imagen?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#B30000',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contenService.borrarCarrusel(id).subscribe(() => {
          Swal.fire({
            title: "Eliminado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.show()
            this.loading = false
          })
        }, error => {
          Swal.fire({
            title: "Error",
            confirmButtonColor: "#B30000",
            timer: 2000,
            icon: "error"
          }).then(() => {
            this.loading = false
          })
        })
      }
    })
  }

  show() {
    this.contenService.obtenerCarrusel().subscribe(res => {
      this.carrusel = res
      this.loading = false
    })
  }

  onFileChange(event) {
    this.imagen = event.target.files[0]
    console.log("changed", this.imagen);
  }

  onResponsiveFileChange(event) {
    this.imagenResponsive = event.target.files[0]
    console.log("changed r", this.imagenResponsive);
  }


  subir() {
    this.loading = true
    if (this.editar) {

      if (this.formulario.valid) {
        const formData = new FormData();
        formData.append('id', this.idEditado.toString());
        if (this.imagen) {
          formData.append(this.imagen.name, this.imagen, this.imagen.name)
        }

        if (this.imagenResponsive) {
          formData.append(this.imagenResponsive.name, this.imagenResponsive, this.imagenResponsive.name)
        }

        formData.append('needsAction', this.formulario.get('needsAction')?.value);
        formData.append('action', this.formulario.get('action')?.value);

        this.contenService.editarCarrusel(formData).subscribe(r => {
          Swal.fire({
            title: "Modificado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.editar = false;
            this.estado = 'void';
            this.idEditado = null;
            this.formulario.reset();
            this.show();
            this.loading = false;
          })
        }, err => {
          Swal.fire({
            title: "Error",
            confirmButtonColor: "#B30000",
            timer: 2000,
            icon: "error"
          }).then(() => {
            this.loading = false
          })

        });

      } else {
        console.log("no valido edit");
        Swal.fire({
          title: "No se selecciono ninguna imagen",
          confirmButtonColor: "#B30000"
        }).then(() => {
          this.loading = false
        })
      }

    } else {
      if (this.formulario.valid) {

        const formData = new FormData();
        formData.append(this.imagen.name, this.imagen, this.imagen.name)
        formData.append(this.imagenResponsive.name, this.imagenResponsive, this.imagenResponsive.name)
        formData.append('needsAction', this.formulario.get('needsAction')?.value);
        formData.append('action', this.formulario.get('action')?.value);

        this.contenService.agregarCarrusel(formData).subscribe(r => {
          Swal.fire({
            title: "Agregado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.show();
            this.close();
            this.formulario.reset();
            this.loading = false;
          })
        }, error => {
          Swal.fire({
            title: "Error",
            confirmButtonColor: "#B30000",
            timer: 2000,
            icon: "error"
          }).then(() => {
            this.loading = false
          })
        })


      } else {
        console.log("no valido");
        Swal.fire({
          title: "No se selecciono ninguna imagen",
          confirmButtonColor: "#B30000"
        }).then(() => {
          this.loading = false
        })
      }
    }

  }

  editando(id: number, name: string) {
    const foundItrem = this.carrusel.find(item => item.id === id);
    this.editar = true;
    this.idEditado = id;
    this.datoEditado = name;
    this.isChecked =  foundItrem?.needsAction === true;
    this.formulario.get('needsAction')?.setValue(foundItrem?.needsAction);
    this.formulario.get('action')?.setValue(foundItrem?.action);
    this.actionActive = foundItrem?.needsAction;
    this.estado = 'visible';
    setTimeout(() => {
      document.getElementById('btn-mod').scrollIntoView({ behavior: 'smooth' });
    }, 20);
  }

  open() {
    if (this.editar) {
      this.editar = false;
    } else {
      this.estado = 'visible';
      setTimeout(() => {
        document.getElementById('btn-add').scrollIntoView({ behavior: 'smooth' });
      }, 20);
    }
  }

  close() {
    document.getElementById('title').scrollIntoView({ behavior: 'smooth' });
    this.editar = false;
    this.estado = 'void';
    this.idEditado = null;
    this.datoEditado = null;
    this.formulario.reset();

  }

  generarIdAleatorio() {
    // Conjunto de caracteres a utilizar
    const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Longitud de la cadena
    const longitud = 10;

    // Variable para almacenar la cadena aleatoria
    let cadenaAleatoria = "";

    // Bucle para generar la cadena aleatoria
    for (let i = 0; i < longitud; i++) {
      // Generar un índice aleatorio dentro del conjunto de caracteres
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);

      // Obtener el caracter en el índice aleatorio
      const caracter = caracteres[indiceAleatorio];

      // Agregar el caracter a la cadena aleatoria
      cadenaAleatoria += caracter;
    }

    // Devolver la cadena aleatoria
    return cadenaAleatoria;
  }

  goBack() {
    window.history.back();
  }

  public onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.actionActive = true;
      this.isChecked = true;
    } else {
      this.actionActive = false;
      this.isChecked = false;
      this.formulario.get('action')?.setValue(''); // Limpiar el valor del campo 'action' si se desmarca
    }
  }
}
