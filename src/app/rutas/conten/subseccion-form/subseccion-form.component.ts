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

export interface FileObject {
  name: string,
  fileId: number,
  url: string,
  file: File
};

@Component({
  selector: 'app-subseccion-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, EditorModule, MatIconModule],
  templateUrl: './subseccion-form.component.html',
  styleUrl: './subseccion-form.component.css'
})
export class SubseccionFormComponent implements OnInit {

  public componentInfo: ComponentInfo;
  public fileArray: FileObject[] = [];
  public presntationFile: FileObject;
  public sectionFile: FileObject;
  public urlPersonalized: string;
  public sectionForm: FormGroup;
  public comesForm: Category; //Categoria a la que pertenece la seccion
  public subseccion: Section;

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
  }

  public ngOnInit(): void {
    this.initialiceForm();
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.route.params.subscribe(params => {
      const seccionId = params['seccionId'] || "";
      const subseccionId = params['subseccionId'] || "";
  
      console.log(seccionId);
      console.log(subseccionId);
  
      this.setComponentAction(subseccionId);
      this.loadSectionInfo(seccionId, subseccionId);
    });
  }
  
  private setComponentAction(subseccionId: string): void {
    this.componentInfo.action = subseccionId 
      ? ConstantsConten.EDIT_TITLE 
      : ConstantsConten.CREATE_TITLE;
  }
  
  private loadSectionInfo(seccionId: number, subseccionId: number): void {
    console.log("test 0");
  
    this.contenService.getSectionInfo(seccionId).subscribe(response => {
      console.log("test 1");
      console.log(response);
  
      this.componentInfo.name = response.title;
      this.componentInfo.Seccion_Id = response.id;
  
      if (subseccionId) {
        this.loadSubsectionInfo(subseccionId, seccionId + "");
      } else {
        console.log("test 3");
        // this.componentInfo.name = nombreCategoria;
      }
    });
  }
  
  private loadSubsectionInfo(subseccionId: number, seccionId: string): void {
    this.contenService.getSubsectionsById(subseccionId).subscribe(response => {
      console.log("response");
      console.log(response);
  
      this.subseccion = response;
      this.componentInfo.name = this.subseccion.title;
  
      this.sectionForm.setValue({
        title: this.subseccion.title,
        description: this.subseccion.description,
        idSeccion: seccionId,
        idSubseccion: subseccionId
      });
    });
  }

  /**
   * @description Inicializa el formulario
   * @param {void}
   * @returns {void}
   */
  public initialiceForm(): void {
    this.sectionForm = this.formBuilder.group({
      title: ['', Validators.required],
      // url: ['', Validators.required],
      description: ['', Validators.required],
      // img: [''],
      // file: [''],
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
      this.sectionForm.get('file')?.patchValue(this.sectionFile.url);
    }
  }

  /**
   * @description Elimina el archivo de la seccion
   * @param {void}
   */
  public removeFile(): void {
    this.sectionFile = {
      name: '',
      fileId: 0,
      url: '',
      file: new File([], '')
    };
    this.sectionForm.get('file')?.patchValue('');
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
      const newFile = _.head(event.target.files);
      if (newFile) {
        this.fileArray.push({
          name: newFile.name,
          fileId: newID,
          url: URL.createObjectURL(newFile),
          file: newFile
        });
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
    this.fileArray = this.fileArray.filter((file) => file.fileId !== fileId);
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
    const formData = this.createFormData();
  
    if (this.isEditMode()) {
      this.updateSubsection(formData);
    } else {
      this.initializeSubsection(formData);
    }
  }
  
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.sectionForm.get('title')?.value);
    formData.append('description', this.sectionForm.get('description')?.value);
    formData.append('Secciones_Conten_Id', String(this.componentInfo.Seccion_Id));
    return formData;
  }
  
  private isEditMode(): boolean {
    return this.componentInfo.action === ConstantsConten.EDIT_TITLE;
  }
  
  private updateSubsection(formData: FormData): void {
    formData.append('id', this.sectionForm.get('idSubseccion')?.value);
  
    this.contenService.setSubsection(formData).subscribe(
      (categoriaCreada) => {
        this.handleSuccess('Categoría inicializada correctamente', categoriaCreada.title);
        this.router.navigate(['conten/editor']);
      },
      (error) => this.handleError('Error al iniciar la categoría', error.message)
    );
  }
  
  private initializeSubsection(formData: FormData): void {
    this.contenService.initSubsection(formData).subscribe(
      (categoriaCreada) => {
        this.handleSuccess('Categoría inicializada correctamente', categoriaCreada.title);
        this.router.navigate(['conten/editor']);
      },
      () => this.handleError('Error al iniciar la categoría')
    );
  }
  
  private handleSuccess(message: string, title?: string): void {
    Swal.fire({ icon: 'success', title: 'Correcto', text: message }).then(() => {
      if (title) {
        this.componentInfo.name = title;
      }
    });
  }
  
  private handleError(message: string, errorMessage?: string): void {
    const text = errorMessage ? `${message} ${errorMessage}` : message;
    Swal.fire({ icon: 'error', title: 'Error', text });
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
