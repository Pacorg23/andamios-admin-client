import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { ContenService } from '../service/conten.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { ConstantsConten } from '../constantes-conten';
import { Category } from '../models/category';
import { Section } from '../models/seccion';
import { Title } from '@angular/platform-browser';
import { LoadingComponent } from '../../../effects/loading/loading.component';
import { ENV_CONSTANTS } from '../../../services/environment.service';

export class ComponentInfo {
  action: string;
  type: string;
  name: string;
  Categoria_Id: number;
  Seccion_Id: number;
  Subseccion_Id: number;

  constructor() {
    this.action = '';
    this.type = '';
    this.name = '';
    this.Categoria_Id = 0;
    this.Subseccion_Id = 0;
  }
}
function base64ToFile(base64String: string, fileName: string): File {
  // Remove the data URL prefix (e.g., "data:image/png;base64,")
  const base64DataSplitted = base64String.split(',');
  const base64Data = base64DataSplitted.length > 1 ? base64DataSplitted[1] : base64DataSplitted[0];

  // Decode the base64 string to a binary string
  const byteCharacters = atob(base64Data);

  // Convert the binary string into an array of bytes
  const byteArrays = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  // Create a Blob from the byte array
  const blob = new Blob([byteArrays], { type: 'application/octet-stream' });

  // Convert the Blob into a File (you can change the type to match your file type)
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}

export interface FileObject {
  name: string,
  fileId: number,
  url: string,
  file: File
};

@Component({
  selector: 'app-seccion-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, EditorModule, MatIconModule, LoadingComponent],
  templateUrl: './seccion-form.component.html',
  styleUrl: './seccion-form.component.css'
})
export class SeccionFormComponent implements OnInit {

  public componentInfo: ComponentInfo;
  public fileArray: FileObject[] = [];
  public presntationFile: FileObject;
  public sectionFile: FileObject;
  public urlPersonalized: string;
  public sectionForm: FormGroup;
  public comesForm: Category; //Categoria a la que pertenece la seccion
  public seccion: Section;
  public loading: boolean = false
  public apiKey: string;

  //Configuracion del editor
  public config: EditorComponent['init'] = {
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

  constructor(private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private contenService: ContenService,
    private formBuilder: FormBuilder, private router: Router) {
    this.componentInfo = new ComponentInfo();
    this.presntationFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    };

    this.sectionFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    }
    this.urlPersonalized = '';
    this.apiKey = ENV_CONSTANTS.EDITOR_KEY;
  }

  public ngOnInit(): void {
    this.loading = true
    this.initialiceForm();
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.route.params.subscribe(params => {
      const categoriaId = params['categoriaId'];
      const seccionId = params['seccionId'];

      // Obtener información de la Sección por ID
      this.obtenerInformacionCategoria(categoriaId, seccionId);
    });
  }

  private obtenerInformacionCategoria(categoriaId: number, seccionId?: string): void {
    this.contenService.getCategoriesById(categoriaId).subscribe(response => {
      this.componentInfo.name = response.title;
      this.componentInfo.Categoria_Id = response.id;
      this.componentInfo.type = response.tipo;
      this.sectionForm.clearValidators();
      this.sectionForm.get("title").addValidators([Validators.required]);
      this.sectionForm.get("title").updateValueAndValidity();
      switch (this.componentInfo.type) {
        case "A":
          this.sectionForm.get("description").addValidators([Validators.required])
          this.sectionForm.get("description").updateValueAndValidity();

          break;
        case "B":
          this.sectionForm.get("description").addValidators([Validators.required])
          this.sectionForm.get("description").updateValueAndValidity();
          break;
        case "C":
          break;
        case "D":
          this.sectionForm.get("description").addValidators([Validators.required])
          this.sectionForm.get("description").updateValueAndValidity();
          break;

        default:
          break;
      }
      this.loading = false
      if (seccionId) {
        this.procesarInformacionSeccion(seccionId);
      } else {
        this.componentInfo.action = ConstantsConten.CREATE_TITLE;
      }
    });
  }

  private procesarInformacionSeccion(seccionId: string): void {
    this.loading = true;
    this.componentInfo.action = ConstantsConten.EDIT_TITLE;
    this.componentInfo.Seccion_Id = _.lowerCase(seccionId);

    this.contenService.getSectionById(this.componentInfo.Seccion_Id).subscribe(response => {
      this.seccion = response[0];
      this.actualizarInformacionSeccion();
      this.loading = false;
    });
  }

  private actualizarInformacionSeccion(): void {
    this.componentInfo.name = this.seccion?.title || "";
    this.sectionForm.setValue({
      title: this.seccion.title,
      description: this.seccion.description,
      idSeccion: this.seccion.id,
      idSubseccion: 0,
      file: "",
      img: this.seccion.img || null
    });

    this.procesarImagenPrincipal();
    this.procesarImagenesSecundarias();
    this.procesarArchivo();
  }

  private procesarImagenPrincipal(): void {
    if (this.seccion?.img) {
      const newFile = base64ToFile(this.seccion.img, "editImg");
      this.presntationFile = {
        name: "editImg",
        fileId: 0,
        url: URL.createObjectURL(newFile),
        file: newFile
      };
      this.sectionForm.get('img').patchValue(this.seccion.img.split(',')[1]);
      this.cdRef.detectChanges();
    }
  }

  private procesarImagenesSecundarias(): void {
    if (this.seccion?.imgs.length > 0) {
      this.seccion.imgs.forEach(img => {
        const file = base64ToFile(img.data, img.title);
        this.fileArray.push({
          name: img.title,
          fileId: img.id,
          url: URL.createObjectURL(file),
          file: file
        });
        this.cdRef.detectChanges();
      });
    }
  }

  private procesarArchivo(): void {
    if (this.seccion?.file) {
      const newFile = base64ToFile(this.seccion.file, "file");

      this.sectionFile = {
        name: newFile.name,
        fileId: 0,
        url: URL.createObjectURL(newFile),
        file: newFile
      };
      this.sectionForm.get('file')?.patchValue(this.sectionFile.url);
    }
  }

  /**
   * @description Inicializa el formulario
   * @param {void}
   * @returns {void}
   */
  public initialiceForm(): void {
    this.sectionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      img: [''],
      file: [''],
      idSeccion: [''],
      idSubseccion: ['']
    });
  }

  /**
   * @description Regresa el titulo en minusculas y y espacios reemplazados por guiones(-)
   * @param {void}
   * @returns {string} - Titulo formateado
   */
  get formattedText(): string {
    const formatted = this.urlPersonalized
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/\s+/g, '-');
    return formatted;
  }

  /**
   * @description Inserta imagen de presentacion a una variable
   * @param {void}
   * @returns {void}
   */
  public presentationFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.presntationFile.name = file.name;
      this.presntationFile.fileId = 0;
      this.presntationFile.url = URL.createObjectURL(file);
      this.presntationFile.file = file;
      this.sectionForm.get('img')?.patchValue(this.presntationFile);
    }
  }

  /**
   * @description Elimina la imagen de presentacion
   * @param {void}
   * @returns {void}
   */
  public removePresentationFile(): void {
    this.presntationFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    };
    this.sectionForm.get('img')?.patchValue('');
  }

  /**
   * @description Agrega archivo a variable de files
   * @param {void}
   * @returns {void}
   */
  public sectionFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.sectionFile.name = file.name;
      this.sectionFile.fileId = 0;
      this.sectionFile.url = URL.createObjectURL(file);
      this.sectionFile.file = file;
      // this.sectionForm.get('file')?.patchValue(this.sectionFile.url);
    }
  }

  /**
   * @description Elimina el archivo de la seccion
   * @param {void}
   */
  public removeFile(event: any): void {
    debugger
    this.sectionFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    };
    this.sectionForm.get('file')?.patchValue('');
    return
  }

  /**
   * @description Elimina el archivo de la seccion
   * @param {void}
   * @returns {void}
   */
  public removeSectionFile(): void {
    this.sectionFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    };
    this.sectionForm.get('file')?.patchValue('');
  }

  public generateClickToFile(flag: string): void {
    switch (flag) {
      case 'presentation':
        document.getElementById('file-input-presentation')?.click();
        break;
      case 'document':
        document.getElementById('file-input-document')?.click();
        break;
      case 'array':
        document.getElementById('file-input-array')?.click();
        break;
      default:
        break;
    }
  }

  //ARRAY FUNCTIONS
  /**
   * @description Agrega un archivo a la lista de archivos
   * @param {Event} event - Evento del input file
   * @param {number} newID - Nuevo ID del archivo
   * @returns void
   */
  public addImageToFileArray(event: any, newID: number): void {
    if (!_.isNil(event.target)) {
      for (var i = 0; i < event.target.files.length; i++) {
        const newFile = event.target.files[i];
        if (newFile) {
          this.fileArray.push({
            name: newFile.name,
            fileId: newID + i,
            url: URL.createObjectURL(newFile),
            file: newFile
          });
        }
        this.cdRef.detectChanges();
      }
    } else {
      console.error('Error al agregar imagen al array');
    }
  }

  /**
   * @description Elimina un archivo de la lista de archivos
   * @param {number} fileId - ID del archivo a eliminar
   * @returns void
   */
  public removeImageFromFileArray(fileId: number): void {
    if (this.componentInfo.action == ConstantsConten.EDIT_TITLE) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la imagen de forma permanente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        this.contenService.deleteImage(fileId).subscribe((result) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Imagen eliminada exitosamente',
            showConfirmButton: false,
            timer: 1000, // El toast desaparecerá después de 1 segundo
            timerProgressBar: true // Muestra una barra de progreso
          });
        })
        this.fileArray = this.fileArray.filter((file) => file.fileId !== fileId);
      })
    }
    else {
      this.fileArray = this.fileArray.filter((file) => file.fileId !== fileId);

    }
  }

  /**
   * @description Cambia un archivo de la lista de archivos
   * @param {Event} event - Evento del input file
   * @param {number} fileId - ID del archivo a cambiar
   * @returns void
   */
  public changeImageFromFileArray(fileId: number): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const target = event.target as HTMLInputElement;

      if (target.files && target.files.length > 0) {
        const newFile = _.head(target.files);
        if (newFile) {
          this.removeImageFromFileArray(fileId);
          this.addImageToFileArray(e, fileId);
        }
      }
    });

    input.click();
  }

  /**
   * @description Funcion para enviar el fromdata a el servicio
   * @param {void}
   * @returns {void}
   */
  public submitStage(): void {
    this.loading = true;
    if (this.sectionForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formulario incompleto, por favor inserte los valores obligatorios'
      });
      this.loading = false
      return
    }
    const formData = this.createFormData();

    if (this.isEditMode()) {
      this.updateSection(formData);
    } else {
      this.initializeSection(formData);
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.sectionForm.get('title')?.value);
    formData.append('url', this.formattedText);
    formData.append('description', this.sectionForm.get('description')?.value);
    formData.append('Categorias_Id', String(this.componentInfo.Categoria_Id));
    formData.append('banner', this.presntationFile.file);
    formData.append('archivo', this.sectionFile.file);
    return formData;
  }

  private isEditMode(): boolean {
    return this.componentInfo.action === ConstantsConten.EDIT_TITLE;
  }
  private restartImages(seccionid) {
    this.contenService.restartImagesSection(seccionid).subscribe(() => {
      console.log("Imagenes reiniciadas correctamente")
    })
  }
  private updateSection(formData: FormData): void {
    formData.append('id', this.sectionForm.get('idSeccion').value);

    this.contenService.setSection(formData).subscribe(
      (categoriaCreada) => {
        this.handleSuccess('Sección inicializada correctamente', categoriaCreada.title);
        this.restartImages(this.sectionForm.get('idSeccion').value);
        this.handleAdditionalUploads(this.sectionForm.get('idSeccion').value);
        this.router.navigate(['conten/editor']);
      },
      (error) => this.handleError('Error al iniciar la Sección', error.message)
    );
  }

  private initializeSection(formData: FormData): void {
    this.contenService.initSection(formData).subscribe(
      (seccionCreada) => {
        this.handleSuccess(`Seccion inicializada correctamente con id: ${seccionCreada.id}`);
        this.handleAdditionalUploads(seccionCreada.id);
        this.router.navigate(['conten/editor']);
      },
      (response) => {
        if (response.status == 409) {
          this.handleError('Ya existe una Seccion con ese url')
        } else {

          this.handleError('Error al iniciar la categoría')
        }
        this.loading = false
      }
    );
  }

  private handleSuccess(message: string, title?: string): void {
    Swal.fire({ icon: 'success', title: 'Correcto', text: message }).then(() => {
      if (title) {
        this.loading = false;
        this.componentInfo.name = title;
      }
    });
  }

  private handleError(message: string, errorMessage?: string): void {
    const text = errorMessage ? `${message} ${errorMessage}` : message;
    Swal.fire({ icon: 'error', title: 'Error', text });
  }

  private handleAdditionalUploads(sectionId: number): void {
    // this.uploadFile(this.presntationFile, sectionId + "", this.contenService.initImage.bind(this.contenService));
    this.uploadFile(this.sectionFile, sectionId + "", this.contenService.initFile.bind(this.contenService));
    this.uploadMultipleFiles(this.fileArray, sectionId + "");
  }

  private uploadFile(file: any, sectionId: string, uploadFn: Function): void {
    if (file) {
      const formData = new FormData();
      formData.append('title', file.name);
      formData.append('Secciones_Conten_Id', sectionId);
      formData.append('data', file.file);
      uploadFn(formData).subscribe();
    }
  }

  private uploadMultipleFiles(files: any[], sectionId: string): void {
    if (files.length > 0) {
      files.forEach((file) => this.uploadFile(file, sectionId, this.contenService.initImage.bind(this.contenService)));
    }
  }


  /**
   * @description Navigate into conten
   * @param {string} direction - Direction to go
   * @returns void
   */
  public goTo(direction: string): void {
    this.router.navigate([`conten/${direction}`]);
  }
}
