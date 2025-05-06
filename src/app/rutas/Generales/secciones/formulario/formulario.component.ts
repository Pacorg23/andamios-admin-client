import { Component, Input, Output, EventEmitter, afterRender, SimpleChanges, afterNextRender } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { fadeInAnimation } from '../../../../effects/fadeIn';
import { ApiService } from '../../../../services/api.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../../effects/loading/loading.component';
import { ImageService } from '../../../../services/image.service';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { ENV_CONSTANTS } from '../../../../services/environment.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [EditorModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatIconModule,
    LoadingComponent
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  animations: [fadeInAnimation]
})
export class FormularioComponent {

  //configuracion del editor
  config: EditorComponent['init'] = {
    plugins: 'anchor autolink charmap codesample image link lists media searchreplace table',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | removeformat',
    file_picker_types: 'image',
    file_picker_callback: function (callback, value, meta) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = function () {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
          var b64 = e.target.result as string;
          callback(b64, { title: file.name });
        };

        reader.readAsDataURL(file);
      }

      input.click();
    },
    formats: {
      div: { block: 'div' },
    }
  }

  formulario: FormGroup;
  formularioCategoria: FormGroup;

  boton_archivo: boolean = false;

  @Input() elemento: any;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() reload: EventEmitter<void> = new EventEmitter<void>();
  files: File[] = [];
  fileUrl: any[] = [];
  pdfAlreadyExists: boolean = false;
  pdf: File;
  pdfUrl: string;
  inicio_img: File;
  inicio_imgUrl: string;
  nombre_corto: string;

  banner: boolean = false;
  bannerImage: File;
  bannerImageURL: string;

  division: string;

  loading: boolean = false;

  public apiKey: string;
  constructor(private fb: FormBuilder, 
    private apiService: ApiService, 
    private imgService: ImageService, 
    private activatedroute: ActivatedRoute) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      url: [''],
      descripcion: [''],
      mostrar_inicio: [false], //A
      imagen_inicio: [''], //A B
      btn_pdf: [false], //A D
      btn_contacto: [false], //A
      isTitle: [false]
    });

    this.formularioCategoria = this.fb.group({
      nombre: ['', Validators.required],
      url: ['', Validators.required],
      tipo: ['', Validators.required],
      area: "",
      mostrar_inicio: 0,
      banner: ['']
    })

    this.apiKey = ENV_CONSTANTS.EDITOR_KEY;
    afterRender(() => {
      window.scrollTo(0, 0);
      this.activatedroute.params.subscribe(params => {
        this.division = params['area'];
      })
    })
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }


  controladorEditar() {
    if (this.elemento.accion === 'editar') {
      this.obtenerElemento(this.elemento.id, this.elemento.objetivo, this.elemento.tipo);
    }
  }

  /**
   * @description REgresa el titulo en minusculas y y espacios reemplazados por guiones(-)
   */
  get formattedText() {
    const formatted = this.nombre_corto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/\s+/g, '-')
    if (this.elemento.objetivo == 'categoria') {
      this.formularioCategoria.patchValue({ url: formatted });
    } else {
      this.formulario.patchValue({ url: formatted });
    }
    return formatted;
  }

  /**
   * @description Obtiene el elemento a editar y rellena el formulario dependiendo del objetivo
   * @param id id del elemento a editar
   * @param objetivo objetivo del elemento a editar
   * @param tipo tipo del elemento a editar
   * @returns void
   */
  obtenerElemento(id, objetivo, tipo) { //se rellena el form

    this.loading = true;

    if (objetivo == 'categoria') {
      //obtener categoria
      this.apiService.obtenerCategoria(id).subscribe((categoria) => {
        this.formularioCategoria.patchValue({
          nombre: categoria.nombre,
          tipo: categoria.tipo,
          url: categoria.url,
          mostrar_inicio: categoria.mostrar_inicio
        })

        this.bannerImageURL = categoria.banner;
        this.banner = categoria.mostrar_inicio;

        this.loading = false;
      })
    } else if (objetivo == 'seccion') {
      //obtener seccion
      this.apiService.obtenerSeccion(id).subscribe((seccion) => {

        switch (tipo) {
          case 'A':
            this.formulario.patchValue({
              nombre: seccion.nombre,
              url: seccion.url,
              descripcion: seccion.descripcion,
              mostrar_inicio: seccion.mostrar_inicio,
              btn_pdf: seccion.btn_pdf,
              btn_contacto: seccion.btn_contacto,
              isTitle: seccion.isTitle
            })

            this.pdfUrl = seccion.pdf?.nombre;
            if (this.pdfUrl) {
              this.pdfAlreadyExists = true;
              this.boton_archivo = true;
            }

            this.inicio_imgUrl = seccion.imagen_inicio;

            seccion.imagenes.forEach((imagen: any) => {
              this.fileUrl.push({
                id: imagen.id,
                origen: this.elemento.id,
                id_array: null,
                url: imagen.file
              });
            })

            break;
          case 'B':

            this.formulario.patchValue({
              nombre: seccion.nombre,
              url: seccion.url,
              descripcion: seccion.descripcion,
              isTitle: seccion.isTitle
            })

            this.inicio_imgUrl = seccion.imagen_inicio;

            break;
          case 'C':

            this.formulario.patchValue({
              nombre: seccion.nombre,
              url: seccion.url,
              descripcion: seccion.descripcion,
              btn_contacto: seccion.btn_contacto,
              isTitle: seccion.isTitle
            })

            seccion.imagenes.forEach((imagen: any) => {
              this.fileUrl.push({
                id: imagen.id,
                origen: this.elemento.id,
                id_array: null,
                url: imagen.file
              });
            })

            break;
          case 'D':
            this.formulario.patchValue({
              nombre: seccion.nombre,
              url: seccion.url,
              descripcion: seccion.descripcion,
              btn_pdf: seccion.btn_pdf,
              isTitle: seccion.isTitle
            })

            this.pdfUrl = seccion.pdf?.nombre;
            if (this.pdfUrl) {
              this.pdfAlreadyExists = true;
              this.boton_archivo = true;
            }


            this.inicio_imgUrl = seccion.imagen_inicio;

            break;
        }

      })

      this.loading = false;
    } else if (objetivo == 'subseccion') {
      //obtener subseccion
      this.apiService.obtenerSubseccion(id).subscribe((subseccion) => {

        this.formulario.patchValue({
          nombre: subseccion.nombre,
          url: subseccion.url,
          descripcion: subseccion.descripcion,
          btn_pdf: subseccion.btn_pdf,
          btn_contacto: subseccion.btn_contacto
        })

        this.pdfUrl = subseccion.pdf?.nombre;
        if (this.pdfUrl) {
          this.pdfAlreadyExists = true;
          this.boton_archivo = true;
        }

        subseccion.imagenes.forEach((imagen: any) => {
          this.fileUrl.push({
            id: imagen.id,
            origen: this.elemento.id,
            id_array: null,
            url: imagen.file
          });
        })

      })

      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Verifica si el input 'elemento' ha cambiado
    if (changes['elemento']) {
      // Ejecuta la acción que deseas realizar
      this.resetOnChange();
      this.controladorEditar();
    }
  }

  onFileChange(event, id) { //agregar try catch
    if (event.target.files) {
      this.files.push(event.target.files[0]);

      this.fileUrl.push({
        id: null,
        id_array: this.files.length, //indice del array
        origen: id, //elemento al que pertenece
        url: URL.createObjectURL(event.target.files[0])
      })

      //this.fileUrl.push(URL.createObjectURL(event.target.files[0]));

    }
  }

  onPDFChange(event) {
    this.pdf = event.target.files[0];
    this.pdfUrl = this.pdf.name;
  }

  onInicioImgChange(event) {
    this.inicio_img = event.target.files[0];
    this.inicio_imgUrl = URL.createObjectURL(event.target.files[0]);
  }

  openBannerInput() {
    this.banner = !this.banner;
  }

  onBannerChange(event) {
    this.bannerImage = event.target.files[0];
    this.bannerImageURL = URL.createObjectURL(event.target.files[0]);
  }

  getFile() {
    document.getElementById('file-input').click();
  }

  quitarImagen(index) {
    this.files.splice(index, 1);
    this.fileUrl.splice(index, 1);
  }

  resetOnChange() {
    this.formulario.reset();
    this.formularioCategoria.reset();
    this.files = [];
    this.fileUrl = [];
    this.pdf = null;
    this.pdfUrl = null;
    this.inicio_img = null;
    this.inicio_imgUrl = null;
    this.pdfAlreadyExists = false;
    this.boton_archivo = false;
    this.bannerImage = null;
  }

  closeForm() {
    this.close.emit();
    this.formulario.reset();
    this.formularioCategoria.reset();
    this.files = [];
    this.fileUrl = [];
    this.pdf = null;
    this.pdfUrl = null;
    this.inicio_img = null;
    this.inicio_imgUrl = null;
    this.pdfAlreadyExists = false;
    this.boton_archivo = false;
    this.bannerImage = null;
  }

  //small reset
  smallReset() {
    this.formulario.reset();
    this.formularioCategoria.reset();
    this.files = [];
    this.fileUrl = [];
    this.pdf = null;
    this.pdfUrl = null;
    this.inicio_img = null;
    this.inicio_imgUrl = null;
    this.pdfAlreadyExists = false;
    this.boton_archivo = false;
    this.bannerImage = null;
  }

  get invalidFields(): string[] {
    return Object.keys(this.formularioCategoria.controls).filter(
      (field) => this.formularioCategoria.controls[field].invalid
    );
  }

  /**
   * @description Envia el formulario dependiendo del objetivo y la accion
   * @returns void
   */
  sendForm() {

    this.loading = true;

    if (this.elemento.objetivo == "categoria") {
      if (this.formularioCategoria.valid) {
        if (this.elemento.accion === "crear") {

          const formData = new FormData();
          formData.append('nombre', this.formularioCategoria.get('nombre').value);
          formData.append('url', this.formularioCategoria.get('url').value);
          formData.append('tipo', this.formularioCategoria.get('tipo').value);
          formData.append('area', this.division);
          formData.append('mostrar_inicio', this.formularioCategoria.get('mostrar_inicio').value);
          if (this.bannerImage) {
            formData.append('banner', this.bannerImage, this.bannerImage?.name);
          }

          this.apiService.agregarCategoria(formData).subscribe(data => {
            Swal.fire({
              title: 'Categoria agregada',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            }).then(() => {
              this.closeForm();
              this.loading = false;
              window.location.reload();
            })
          }, error => {
            Swal.fire({
              title: 'Ocurrio un error al agregar la categoria',
              text: error,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#cf142b'
            }).then(() => {
              this.loading = false;
            })
          })

        } else if (this.elemento.accion === "editar") {

          Swal.fire({
            title: '¿Estas seguro de modificar la categoria?',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, modificar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#cf142b',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {

              const formData = new FormData();
              formData.append('id', this.elemento.id);
              formData.append('nombre', this.formularioCategoria.get('nombre').value);
              formData.append('url', this.formularioCategoria.get('url').value);
              formData.append('tipo', this.formularioCategoria.get('tipo').value);
              formData.append('area', this.division);
              formData.append('mostrar_inicio', this.formularioCategoria.get('mostrar_inicio').value);
              if (this.bannerImage) {
                formData.append('banner', this.bannerImage, this.bannerImage?.name);
              }

              this.apiService.modificarCategoria(formData).subscribe(() => {
                Swal.fire({
                  title: 'Categoria modificada',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#cf142b'
                }).then(() => {
                  this.closeForm();
                  this.loading = false;
                  window.location.reload();
                })
              }, error => {
                Swal.fire({
                  title: 'Ocurrio un error al modificar la categoria',
                  text: error,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#cf142b'
                }).then(() => {
                  this.loading = false;
                })
              })
            } else {
              this.loading = false;
            }
          })


        } else {
          Swal.fire({
            title: 'No hay accion disponible para la solicitud',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cf142b'
          }).then(() => {
            this.loading = false;
          })
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Por favor llena todos los campos',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      }

    } else if (this.elemento.objetivo == "seccion") {

      if (this.formulario.valid) {

        const formData = new FormData();

        if (this.elemento.accion == 'editar') {
          formData.append('id', this.elemento.id); //id de la seccion a editar
        } else if (this.elemento.accion == 'agregar') {
          formData.append('categoria', this.elemento.id); //id de la categoria a la que pertenece
          formData.append('tipo', this.elemento.tipo); //tipo de seccion
        }
        formData.append('isTitle', this.formulario.get('isTitle').value);

        if ((_.isNil(this.formulario.get('imagen_inicio').value) || _.isEmpty(this.formulario.get('imagen_inicio').value)) && _.isEmpty(this.inicio_imgUrl)) {
          Swal.fire({
            title: 'Error',
            text: 'Se necesita tener una imagen de inicio',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cf142b'
          }).then(() => {
            this.loading = false;
          })
          return;
        }

        switch (this.elemento.tipo) {
          case 'A':

            formData.append('nombre', this.formulario.get('nombre').value);
            formData.append('url', this.formulario.get('url').value);
            formData.append('descripcion', this.formulario.get('descripcion').value);
            formData.append('mostrar_inicio', this.formulario.get('mostrar_inicio').value);
            if (this.inicio_img) {
              formData.append('imagen_inicio', this.inicio_img, this.inicio_img?.name);
            }
            formData.append('btn_pdf', this.formulario.get('btn_pdf').value);
            formData.append('btn_contacto', this.formulario.get('btn_contacto').value);

            if (this.elemento.accion == 'agregar') {
              this.agregarSeccion(formData);
            } else if (this.elemento.accion == 'editar') {

              Swal.fire({
                title: '¿Estas seguro de modificar la seccion?',
                text: 'Esta accion no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, modificar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#cf142b',
                cancelButtonColor: '#6c757d'
              }).then((result) => {
                if (result.isConfirmed) {
                  if (this.formulario.get('btn_pdf').value !== true) { //modificacion de eliminar
                    //elimina archivo
                    this.eliminarArchivoSeccion(this.elemento.id);
                  }

                  if (this.pdfAlreadyExists && this.formulario.get('btn_pdf').value === true) { //modificacion si existe el pdf
                    this.modificarArchivoSeccion(this.elemento.id);
                  }

                  if (!this.pdfAlreadyExists) { //agregar pdf a una creada
                    this.agregarArchivoSeccion(this.elemento.id);
                  }

                  this.modificarSeccion(formData);
                } else {
                  this.loading = false;
                }
              })

            }
            break;
          case 'B':
            formData.append('nombre', this.formulario.get('nombre').value);
            formData.append('url', this.formulario.get('url').value);
            formData.append('descripcion', this.formulario.get('descripcion').value);
            if (this.inicio_img) {
              formData.append('imagen_inicio', this.inicio_img, this.inicio_img?.name);
            }

            if (this.elemento.accion == 'agregar') {
              this.agregarSeccion(formData);
            } else if (this.elemento.accion == 'editar') {

              Swal.fire({
                title: '¿Estas seguro de modificar la seccion?',
                text: 'Esta accion no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, modificar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#cf142b',
                cancelButtonColor: '#6c757d'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.modificarSeccion(formData);
                } else {
                  this.loading = false;
                }
              })
            }
            break;
          case 'C':
            formData.append('nombre', this.formulario.get('nombre').value);
            formData.append('url', this.formulario.get('url').value);
            formData.append('descripcion', this.formulario.get('descripcion').value);
            formData.append('btn_contacto', this.formulario.get('btn_contacto').value);

            if (this.elemento.accion == 'agregar') {
              this.agregarSeccion(formData);
            } else if (this.elemento.accion == 'editar') {

              Swal.fire({
                title: '¿Estas seguro de modificar la seccion?',
                text: 'Esta accion no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, modificar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#cf142b',
                cancelButtonColor: '#6c757d'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.modificarSeccion(formData);
                } else {
                  this.loading = false;
                }
              })

            }
            break;
          case 'D':
            formData.append('nombre', this.formulario.get('nombre').value);
            formData.append('url', this.formulario.get('url').value);
            formData.append('descripcion', this.formulario.get('descripcion').value);
            formData.append('btn_pdf', this.formulario.get('btn_pdf').value);
            if (this.inicio_img) {
              formData.append('imagen_inicio', this.inicio_img, this.inicio_img?.name);
            }

            if (this.elemento.accion == 'agregar') {
              this.agregarSeccion(formData);
            } else if (this.elemento.accion == 'editar') {

              Swal.fire({
                title: '¿Estas seguro de modificar la seccion?',
                text: 'Esta accion no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, modificar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#cf142b',
                cancelButtonColor: '#6c757d'
              }).then((result) => {
                if (result.isConfirmed) {
                  if (this.formulario.get('btn_pdf').value !== true) { //modificacion de eliminar
                    //elimina archivo
                    this.eliminarArchivoSeccion(this.elemento.id);
                  }

                  if (this.pdfAlreadyExists && this.formulario.get('btn_pdf').value === true) { //modificacion si existe el pdf
                    this.modificarArchivoSeccion(this.elemento.id);
                  }

                  if (!this.pdfAlreadyExists) { //agregar pdf a una creada
                    this.agregarArchivoSeccion(this.elemento.id);
                  }

                  this.modificarSeccion(formData);
                } else {
                  this.loading = false;
                }
              })
            }
            break;
        }

      } else {
        Swal.fire({
          title: 'Error',
          text: 'Por favor llena todos los campos',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      }

    } else if (this.elemento.objetivo == "subseccion") {
      if (this.formulario.valid) {
        //agregar o editar subseccion plantilla A
        if (this.elemento.accion == 'agregar') {
          this.agregarSubseccion(this.elemento.id);
        } else if (this.elemento.accion == 'editar') {

          Swal.fire({
            title: '¿Estas seguro de modificar la subseccion?',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, modificar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#cf142b',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              //editar subseccion
              //al dar click primero verifica el pdf
              if (this.formulario.get('btn_pdf').value !== true) {
                //elimina archivo si el click esta desativado, independientemente si existe o no
                this.eliminarArchivoSubseccion(this.elemento.id)
              }

              if (this.pdfAlreadyExists && this.formulario.get('btn_pdf').value === true) {
                //modifica archivo existente
                this.modificarArchivoSubseccion(this.elemento.id)
              }

              if (!this.pdfAlreadyExists) {
                //agrega un archivo a la seccion si no tiene uno
                this.agregarArchivoSubseccion(this.elemento.id)
              }

              this.modificarSubseccion(this.elemento.id);
            } else {
              this.loading = false;
            }
          })
        }
      }

    }
  }

  //SECCION
  agregarSeccion(formData) {
    //paso uno crear la seccion

    let controlador = {
      error: false,
      mensaje: ''
    };

    const imagenes = new FormData();
    const archivo = new FormData();

    this.apiService.agregarSeccion(formData).subscribe(data => {

      imagenes.append('id_seccion', data['id_seccion']);
      this.files.forEach(file => {
        imagenes.append('imagenes', file, file.name);
      });

      this.apiService.agregarImagenesASeccion(imagenes).subscribe(data => {
      }, error => {
        controlador = {
          error: true,
          mensaje: controlador.mensaje + ', ' + error
        }
      })

      if (this.formulario.get('btn_pdf').value) {
        archivo.append('id_seccion', data['id_seccion']);
        archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

        this.apiService.agregarArchivoASeccion(archivo).subscribe(data => {
        }, error => {
          controlador = {
            error: true,
            mensaje: controlador.mensaje + ', ' + error
          }
        })
      }

      if (controlador.error) {
        Swal.fire({
          title: 'Ocurrio un error al agregar la seccion',
          text: controlador.mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      } else {
        Swal.fire({
          title: 'Seccion agregada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
          this.closeForm();
          //window.location.reload();
          this.reload.emit();
        })
      }

    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al agregar la seccion',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })

  }

  modificarSeccion(formData) {
    this.apiService.modificarSeccion(formData).subscribe(data => {
      if (this.files.length > 0) {
        this.agregarImagenesSeccion(this.elemento.id);
      } else {
        Swal.fire({
          title: 'Seccion modificada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          /*window.location.reload();
          this.closeForm()*/
          this.smallReset()
          this.obtenerElemento(this.elemento.id, this.elemento.objetivo, this.elemento.tipo);
          this.reload.emit();
        })
      }
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al modificar la seccion',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  eliminarArchivoSeccion(id_seccion) {
    this.apiService.eliminarArchivoSeccion(id_seccion).subscribe(data => {
      this.pdfAlreadyExists = false;
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al eliminar el archivo',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  modificarArchivoSeccion(id_seccion) {

    if (this.pdf) {
      const archivo = new FormData();
      archivo.append('id', id_seccion);
      archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

      this.apiService.modificarArchivoSeccion(archivo).subscribe(data => {
        this.pdfAlreadyExists = false;
      }, error => {
        Swal.fire({
          title: 'Ocurrio un error al modificar el archivo',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      })
    }
  }

  agregarArchivoSeccion(id_seccion) {
    const archivo = new FormData();
    archivo.append('id_seccion', id_seccion);
    if (!_.isNil(this.pdf)) {
      archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

      this.apiService.agregarArchivoASeccion(archivo).subscribe(data => {
        this.pdfAlreadyExists = false;
      }, error => {
        Swal.fire({
          title: 'Ocurrio un error al agregar el archivo',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      })
    }
  }

  //IMAGENES
  modificarImagen(file, index) {
    if (this.elemento.objetivo === 'seccion') {
      if (file.id !== null) { //en la base de datos, es decir id != null
        //petición put

        const formData = new FormData();
        formData.append('id', file.id);

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = () => {
          const fileChange = input.files[0];
          formData.append(fileChange.name, fileChange, fileChange.name);

          this.apiService.modificarImagenSeccion(formData).subscribe(data => {
            this.fileUrl[index] = {
              id: file.id,
              id_array: index,
              origen: file.origen,
              url: URL.createObjectURL(fileChange)
            }
          }, error => {
            console.log(error)
          })
        }

        input.click();

      } else { //en el array, es decir id == null
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = () => {
          const fileChange = input.files[0];
          this.files[file.id_array - 1] = fileChange;

          this.fileUrl[file.id_array] = {
            id: null,
            id_array: file.id_array,
            origen: file.origen,
            url: URL.createObjectURL(fileChange)
          }

        }
        input.click();

      }
    } else if (this.elemento.objetivo === 'subseccion') {
      if (file.id !== null) { //en la base de datos, es decir id != null
        //petición put

        const formData = new FormData();
        formData.append('id', file.id);

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = () => {
          const fileChange = input.files[0];
          formData.append(fileChange.name, fileChange, fileChange.name);

          this.apiService.modificarImagenSubseccion(formData).subscribe(data => {
            this.fileUrl[index] = {
              id: file.id,
              id_array: index,
              origen: file.origen,
              url: URL.createObjectURL(fileChange)
            }

          }, error => {
            console.log(error)
          })
        }

        input.click();

      } else { //en el array, es decir id == null
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = () => {
          const fileChange = input.files[0];
          this.files[file.id_array - 1] = fileChange;

          this.fileUrl[file.id_array] = {
            id: null,
            id_array: file.id_array,
            origen: file.origen,
            url: URL.createObjectURL(fileChange)
          }

        }
        input.click();

      }
    }
  }

  eliminarImagen(file, index) {
    if (this.elemento.objetivo === 'seccion') {
      if (file.id !== null) {
        this.apiService.eliminarImagenSeccion(file.id).subscribe(data => {
          this.fileUrl.splice(index, 1);
        }, error => {
          Swal.fire({
            title: 'Ocurrio un error al eliminar la imagen',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cf142b'
          }).then(() => {
            this.loading = false;
          })
        })
      } else {
        this.files[file.id_array - 1] = null;
        this.fileUrl.splice(index, 1);
      }
    } else if (this.elemento.objetivo === 'subseccion') {
      if (file.id !== null) {
        this.apiService.eliminarImagenSubseccion(file.id).subscribe(data => {
          this.fileUrl.splice(index, 1);
        }, error => {
          Swal.fire({
            title: 'Ocurrio un error al eliminar la imagen',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cf142b'
          }).then(() => {
            this.loading = false;
          })
        })
      } else {
        this.files[file.id_array - 1] = null;
        this.fileUrl.splice(index, 1);
      }
    }
  }

  agregarImagenesSeccion(id_seccion) {

    const imagenes = new FormData();
    imagenes.append('id_seccion', id_seccion);
    this.files.forEach(file => {
      if (file !== null)
        imagenes.append('imagenes', file, file?.name);
    });

    this.apiService.agregarImagenesASeccion(imagenes).subscribe(data => {
      Swal.fire({
        title: 'Seccion modificada',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        /*window.location.reload();
        this.closeForm()*/
        this.smallReset()
        this.obtenerElemento(this.elemento.id, this.elemento.objetivo, this.elemento.tipo);
      })
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al agregar las imagenes, intentalo de nuevo.',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  // SUBSECCION
  agregarSubseccion(id_seccion) {
    let controlador = {
      error: false,
      mensaje: ''
    };

    const formData = new FormData();
    const imagenes = new FormData();
    const archivo = new FormData();

    formData.append('nombre', this.formulario.get('nombre').value);
    formData.append('url', this.formulario.get('url').value);
    formData.append('descripcion', this.formulario.get('descripcion').value);
    formData.append('btn_pdf', this.formulario.get('btn_pdf').value);
    formData.append('btn_contacto', this.formulario.get('btn_contacto').value);
    formData.append('categoria', this.elemento.id);
    formData.append('tipo', this.elemento.tipo);
    formData.append('seccion', id_seccion);

    this.apiService.agregarSubseccion(formData).subscribe(data => {

      imagenes.append('id_subseccion', data['id_subseccion']);
      this.files.forEach(file => {
        imagenes.append(file?.name, file, file?.name);
      });

      this.apiService.agregarImagenesASubseccion(imagenes).subscribe(data => {
      }, error => {
        controlador = {
          error: true,
          mensaje: controlador.mensaje + ', ' + error
        }
      })

      if (this.formulario.get('btn_pdf').value) {
        archivo.append('id_subseccion', data['id_subseccion']);
        archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

        this.apiService.agregarArchivoASubseccion(archivo).subscribe(data => {
        }, error => {
          controlador = {
            error: true,
            mensaje: controlador.mensaje + ', ' + error
          }
        })
      }

      if (controlador.error) {
        Swal.fire({
          title: 'Ocurrio un error al agregar la subseccion',
          text: controlador.mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      } else {
        Swal.fire({
          title: 'Subseccion agregada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
          this.closeForm();
          //window.location.reload();
          this.reload.emit();
        })
      }

    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al agregar la subseccion',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  modificarSubseccion(id_seccion) {
    const formData = new FormData();
    formData.append('id', id_seccion)
    formData.append('nombre', this.formulario.get('nombre').value)
    formData.append('url', this.formulario.get('url').value)
    formData.append('descripcion', this.formulario.get('descripcion').value)
    formData.append('btn_pdf', this.formulario.get('btn_pdf').value)
    formData.append('btn_contacto', this.formulario.get('btn_contacto').value)

    this.apiService.modificarSubseccion(formData).subscribe(() => {
      if (this.files.length > 0) {
        const imagenes = new FormData();
        imagenes.append('id_subseccion', id_seccion);
        this.files.forEach(file => {
          if (file !== null)
            imagenes.append(file?.name, file, file?.name);
        });
        this.apiService.agregarImagenesASubseccion(imagenes).subscribe(data => {
          Swal.fire({
            title: 'Subseccion modificada',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cf142b'
          }).then(() => {

            this.smallReset()
            this.obtenerElemento(this.elemento.id, this.elemento.objetivo, this.elemento.tipo);
          })
        })
      } else {
        Swal.fire({
          title: 'Subseccion modificada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.smallReset()
          this.obtenerElemento(this.elemento.id, this.elemento.objetivo, this.elemento.tipo);
        })
      }
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al agregar la subseccion',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  eliminarArchivoSubseccion(id) {
    this.apiService.eliminarArchivoAsubseccion(id).subscribe(() => {
      this.pdfAlreadyExists = false;
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al eliminar la subseccion',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }

  modificarArchivoSubseccion(id) {
    if (this.pdf) {
      const archivo = new FormData();
      archivo.append('id', id);
      archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

      this.apiService.modificarArchivoSubseccion(archivo).subscribe(data => {
        this.pdfAlreadyExists = false;
      }, error => {
        Swal.fire({
          title: 'Ocurrio un error al modificar el archivo',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#cf142b'
        }).then(() => {
          this.loading = false;
        })
      })
    }
  }

  agregarArchivoSubseccion(id) {
    const archivo = new FormData();
    archivo.append('id_subseccion', id);
    archivo.append(this.pdf?.name, this.pdf, this.pdf?.name);

    this.apiService.agregarArchivoASubseccion(archivo).subscribe(data => {
      this.pdfAlreadyExists = false;
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al agregar el archivo',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#cf142b'
      }).then(() => {
        this.loading = false;
      })
    })
  }




}
