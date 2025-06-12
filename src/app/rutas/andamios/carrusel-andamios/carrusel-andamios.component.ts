import { afterRender, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiAndamiosService } from '../service/api-andamios.service';
import { Carrusel } from '../../../models/andamios/carrusel';
import { MatIcon } from '@angular/material/icon';
import { fadeInAnimation } from '../../../effects/fadeIn';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LoadingComponent } from '../../../effects/loading/loading.component';

@Component({
  selector: 'app-carrusel-andamios',
  standalone: true,
  imports: [MatIcon, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './carrusel-andamios.component.html',
  styleUrl: './carrusel-andamios.component.css',
  animations: [fadeInAnimation,
    trigger('animacion', [
      state('void', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('void => visible', animate('500ms ease-in')),
      transition('visible => void', animate('500ms ease-out'))
    ])
  ]
})
export class CarruselAndamiosComponent {

  carrusel: Carrusel[]
  formulario: FormGroup
  estado = 'void';
  editar = false;
  imagen: File;
  imagenResponsive: File;
  idEditado: number;
  datoEditado: string;
  loading:boolean = false

  constructor(private accionesService: ApiAndamiosService
    , private fb: FormBuilder) {
      this.loading = true
    this.formulario = this.fb.group({
      imagen1: new FormControl([''], Validators.required),
      imagen2: new FormControl([''], Validators.required)
    })

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
        this.accionesService.borrarCarrusel(id).subscribe(() => {
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

  private show(): void {
    this.accionesService.obtenerCarrusel().subscribe(res => {
      this.carrusel = res
      this.loading = false
    }, error => {
      Swal.fire({
        title: "Error al cargar los datos",
        confirmButtonColor: "#B30000",
        timer: 2000,
        icon: "error"
      }).then(() => {
        this.loading = false
      });
    });
  }

  onFileChange(event){
    this.imagen = event.target.files[0]
  }

  onResponsiveFileChange(event){
    this.imagenResponsive = event.target.files[0]
  }


  subir() {
    this.loading = true
    if (this.editar) {

      if (this.formulario.valid) {
        const formData = new FormData();
        formData.append('id', this.idEditado.toString());
        //formData.append('imagen1', this.imagen1DataURL ? new File([this.imagen1DataURL], this.generarIdAleatorio()) : null);
        //formData.append('imagen2', this.imagen2DataURL ? new File([this.imagen2DataURL], this.generarIdAleatorio()) : null);
        formData.append(this.imagen.name, this.imagen, this.imagen.name)
        formData.append(this.imagenResponsive.name, this.imagenResponsive, this.imagenResponsive.name)

        this.accionesService.modificarCarrusel(formData).subscribe(r => {
          Swal.fire({
            title: "Modificado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.editar = false;
            this.estado = 'void';
            this.idEditado = null;
            this.show()
            this.loading = false
          })
        },err=>{
          Swal.fire({
            title: "Error",
            confirmButtonColor: "#B30000",
            timer: 2000,
            icon: "error"
          }).then(() => {
            this.loading = false
          })

        });

      }else{
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
        //formData.append('imagen1', this.imagen1DataURL ? new File([this.imagen1DataURL], this.generarIdAleatorio()) : null);
        //formData.append('imagen2', this.imagen2DataURL ? new File([this.imagen2DataURL], this.generarIdAleatorio()) : null);
        formData.append(this.imagen.name, this.imagen, this.imagen.name)
        formData.append(this.imagenResponsive.name, this.imagenResponsive, this.imagenResponsive.name)

        this.accionesService.agregarCarrusel(formData).subscribe(r => {
          Swal.fire({
            title: "Agregado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.show()
            this.close()
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


      } else {
        Swal.fire({
          title: "No se selecciono ninguna imagen",
          confirmButtonColor: "#B30000"
        }).then(() => {
          this.loading = false
        })
      }
    }

  }

  editando(id: number, name:string) {
    this.editar = true;
    this.idEditado = id;
    this.datoEditado = name;
    this.estado =  'visible';
    setTimeout(() => {
      document.getElementById('btn-mod').scrollIntoView({ behavior: 'smooth' });
    }, 20);
  }

  open() {
    if (this.editar) {
      this.editar = false;
    } else {
      this.estado =  'visible';
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

}
