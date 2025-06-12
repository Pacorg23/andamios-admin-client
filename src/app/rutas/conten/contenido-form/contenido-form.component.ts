import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { ConstantsConten } from '../constantes-conten';
import _ from 'lodash';
import { ContenService } from '../service/conten.service';
import Swal from 'sweetalert2';
import { Category } from '../models/category';
import { LoadingComponent } from '../../../effects/loading/loading.component';
import { ENV_CONSTANTS } from '../../../../environment.service';

export interface FileObject {
  name: string,
  fileId: number,
  url: string,
  file: File
};

export class ComponentInfo {
  action: string;
  type: string;
  name: string;
  id: number;

  constructor() {
    this.action = '';
    this.type = '';
    this.name = '';
    this.id = 0;
  }
}
enum CategoriesTypes {
  "A" = "A",
  "B" = "B",
  "C" = "C",
  "D" = "D",
}
function isValueInEnum(value: string, enumObj: object): boolean {
  return Object.values(enumObj).includes(value);
}
function base64ToFile(base64String: string, fileName: string): File {
  // Remove the data URL prefix (e.g., "data:image/png;base64,")
  const base64Data = base64String.split(',')[1];

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
@Component({
  selector: 'app-contenido-form',
  standalone: true,
  imports: [MatIconModule, EditorModule, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './contenido-form.component.html',
  styleUrl: './contenido-form.component.css'
})


export class ContenidoFormComponent implements OnInit {

  public componentInfo: ComponentInfo;
  public fileArray: FileObject[] = [];
  public fileBanner: FileObject;
  public categoryForm: FormGroup;
  public stage: string;
  public urlPersonalized: string;
  public categoria: Category;
  public loading: boolean = false
  public apiKey: string;
  public isManufactura: boolean = false;


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
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private contenService: ContenService,
    private router: Router
  ) {
    this.componentInfo = new ComponentInfo();
    this.fileBanner = { name: '', fileId: 0, url: '', file: null };
    this.urlPersonalized = '';
    this.categoria
    this.apiKey = ENV_CONSTANTS.EDITOR_KEY;
  }

  /**
   * @description Inicializa el componente
   * @param {void}
   * @returns void
   */
  public ngOnInit(): void {
    this.initialForm();
    this.initialiceEditor();
    // TODO get parameter and send it to getCategory, craer object bla bla
  }

  public getCategory(title: string): void {
    this.contenService.getCategory(title).subscribe((categoria) => {
      //TODO set values to form (patchValue)
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener la categoría'
      });
    }
    );
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
   * @description Determina si se va a editar o crear un contenido y que tipo es
   * @param {void}
   * @returns void
   */
  public initialiceEditor(): void {
    this.route.params.subscribe(params => {
      this.stage = ConstantsConten.INIT_STAGE;
      if (_.isNil(params["id"])) {
        this.componentInfo.action = ConstantsConten.CREATE_TITLE;
      } else {
        this.componentInfo.id = _.lowerCase(params["id"]);
        this.componentInfo.action = ConstantsConten.EDIT_TITLE;
        this.loading = true
        this.contenService.getCategoriesById(this.componentInfo.id).subscribe((response) => {
          this.categoria = response;
          if (response.is_default) {
            this.categoryForm.get("name").disable();
          } else {
            this.categoryForm.get("name").enable();

          }
          this.componentInfo.name = this.categoria.title
          this.categoryForm.setValue({
            id: _.lowerCase(params["id"]),
            name: this.categoria.title,
            type: isValueInEnum(this.categoria.tipo.split('')[0], CategoriesTypes) ? this.categoria.tipo.split('')[0] : "",
            description: this.categoria.description,
            isActive: this.categoria.is_active,
            img: this.categoria.img ? this.categoria.img.split(',')[1] : null
          })
          if (this.categoria.img) {
            const newFile = base64ToFile(this.categoria.img, "editImg");
            this.fileBanner = {
              name: "editImg",
              fileId: 0,
              url: URL.createObjectURL(newFile),
              file: newFile
            };
            this.categoryForm.get('img').patchValue(this.categoria.img.split(',')[1]);
            this.cdRef.detectChanges();
          }
          if (this.categoria.tipo == "A" || this.categoria.tipo == "C") {
            this.contenService.getImagesByCategoryId(this.categoria.id).subscribe((response) => {
              if (response.length > 0) {
                response.forEach(img => {
                  const file = base64ToFile(img.data, img.title);
                  this.fileArray.push({
                    name: img.title,
                    fileId: img.id,
                    url: URL.createObjectURL(file),
                    file: file
                  });
                  this.cdRef.detectChanges();
                  this.loading = false
                });
              }
            })
          }
          this.procesarImagenesSecundarias()
          this.loading = false

        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener las categorias',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
        )
      }
    });
  }
  private procesarImagenesSecundarias(): void {
    if (this.categoria?.imgs?.length > 0) {
      this.categoria.imgs.forEach(img => {
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
  public generateClickToFileImgArr(flag: string): void {
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
  /**
   * @description Inicializa el formulario de categorias
   * @param {void}
   */
  public initialForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      isActive: [true],
      img: [''],
    });
    this.categoryForm.get('type')?.valueChanges.subscribe(value => {
      console.log("Valor actualizado:", this.categoryForm.get('type'));
      this.isManufactura = value == "B" ? true: false;
      console.log("Valor actualizado:", this.isManufactura);
    });
  }

  /**
   * @description Simula el click a un archivo
   * @param {void}
   * @returns void
   */
  public generateClickToFileBanner(): void {
    document.getElementById('file-input').click();
  }


  public saveImage(event: any): void {
    if (!_.isNil(event.target)) {
      const newFile = _.head(event.target.files);
      if (newFile) {
        this.fileBanner = {
          name: newFile.name,
          fileId: 0,
          url: URL.createObjectURL(newFile),
          file: newFile
        };
        this.categoryForm.get('img').patchValue(this.fileBanner.url);
        this.cdRef.detectChanges();
      }
    }
  }

  /**
   * @description Elimina la imagen seleccionada
   * @param {void}
   * @returns void
   */
  public removeImage(): void {
    this.fileBanner = { name: '', fileId: 0, url: '', file: null };
    this.categoryForm.get('img').patchValue('');
  }

  /**
   * @description Edita la imagen seleccionada
   * @param {void}
   * @returns void
   */
  public editImage(): void {
    this.fileBanner = { name: '', fileId: 0, url: '', file: null };
    this.categoryForm.get('img').patchValue('');

    setTimeout(() => {
      this.generateClickToFileBanner();
    }, 500);
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

  private generarFormData(): FormData {

    const formData = new FormData();
    formData.append('title', this.categoryForm.get('name').value);
    formData.append('url', this.formattedText);
    formData.append('tipo', this.categoryForm.get('type').value);
    formData.append('description', (this.categoryForm.get('type').value != "C") ? this.categoryForm.get('description').value : "");
    formData.append('img', this.fileBanner.file);
    formData.append('has_sections',  "1");
    formData.append('is_active', this.categoryForm.get('isActive').value);
    return formData;
  }
  private uploadFile(file: any, categoryId: string, uploadFn: Function): void {
    if (file) {
      const formData = new FormData();
      formData.append('title', file.name);
      formData.append('Categorias_Conten_Id', categoryId);
      formData.append('data', file.file);
      uploadFn(formData).subscribe();
    }
  }
  private uploadMultipleFiles(files: any[], categoryId: string): void {
    if (files.length > 0) {
      console.log(files.length)
      files.forEach((file) => this.uploadFile(file, categoryId, this.contenService.initImage.bind(this.contenService)));
    }
  }
  private isEditMode(): boolean {
    return this.componentInfo.action === ConstantsConten.EDIT_TITLE;
  }
  private restartImages(categoriaId) {
    this.contenService.restartImagesCategory(categoriaId).subscribe(() => {
      console.log("Imagenes reiniciadas correctamente")
    })
  }
  private updateCategory(formData: FormData): void {
    formData.append('id', this.categoryForm.get('id').value);

    this.contenService.setCategory(formData).subscribe(
      (categoriaCreada) => {

        this.handleSuccess('Categoría inicializada correctamente', categoriaCreada.title);
        this.restartImages(this.categoryForm.get('id').value);
        this.handleAdditionalUploads(this.categoryForm.get('id').value);
        this.router.navigate(['conten/editor']);
      },
      (error) => this.handleError('Error al iniciar la categoría', error.message)
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
  private initializeCategory(formData: FormData): void {
    this.contenService.initCategory(formData).subscribe(
      (categoriaCreada) => {
        console.log(categoriaCreada)
        console.log(categoriaCreada)
        this.handleSuccess(`Categoría inicializada correctamente con id: ${categoriaCreada.id}`);
        this.handleAdditionalUploads(categoriaCreada.id);
        this.router.navigate(['conten/editor']);
      },
      (response) => {
        console.log("response")
        console.log(response)
        if (response.status == 409) {
          this.handleError('Ya existe una Categoria con ese url')
        } else{

          this.handleError('Error al iniciar la categoría')
        }
        this.loading = false
      }
    );
  }
  private handleAdditionalUploads(categoriaId: number): void {

    // this.uploadFile(this.fileBanner, categoriaId + "", this.contenService.initFile.bind(this.contenService));
    this.uploadMultipleFiles(this.fileArray, categoriaId + "");
  }
  /**
   * @description Genera el rpimer registro de categoria y pasa al siguiente paso
   * @param {void}
   * @returns void
   */
  public nextStage(): void {
    this.loading  = true
    if (this.categoryForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formulario incompleto, por favor inserte nombre y tipo de categoria'
      });
      this.loading  = false
      return
    }
    const formData = this.generarFormData();

    if (this.isEditMode()) {
      this.updateCategory(formData);
    } else {
      this.initializeCategory(formData);
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
