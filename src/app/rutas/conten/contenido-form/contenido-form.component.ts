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
  imports: [MatIconModule, EditorModule, FormsModule, ReactiveFormsModule],
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
        this.contenService.getCategoriesById(this.componentInfo.id).subscribe((response) => {
          this.categoria = response;
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
  /**
   * @description Inicializa el formulario de categorias
   * @param {void}
   */
  public initialForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
      img: [''],
    });
  }

  /**
   * @description Simula el click a un archivo
   * @param {void}
   * @returns void
   */
  public generateClickToFile(): void {
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
      this.generateClickToFile();
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

  /**
   * @description Genera el rpimer registro de categoria y pasa al siguiente paso
   * @param {void}
   * @returns void
   */
  public nextStage(): void {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('title', this.categoryForm.get('name').value);
      formData.append('url', this.formattedText);
      formData.append('tipo', this.categoryForm.get('type').value);
      formData.append('description', this.categoryForm.get('description').value);
      formData.append('img', this.fileBanner.file);
      formData.append('has_sections', (this.categoryForm.get('type').value == "B") ? "1": "0");
      formData.append('is_active', this.categoryForm.get('isActive').value);
      

      // TODO if para distinguir entre acciones osea editar o crear
      if (this.componentInfo.action == ConstantsConten.EDIT_TITLE) {
        formData.append('id', this.categoryForm.get('id').value);
        this.contenService.setCategory(formData).subscribe((categoriaCreada) => {
          Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: 'Categoría inicializada correctamente'
          }).then(() => {
            this.componentInfo.name = categoriaCreada.title;
            this.componentInfo.type = categoriaCreada.tipo;
            this.router.navigate([`conten/editor`]);
          });
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al iniciar la categoría ' + error.message
          })
        }
        );

      } else {

        this.contenService.initCategory(formData).subscribe((categoriaCreada) => {
          Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: 'Categoría inicializada correctamente'
          }).then(() => {
            this.componentInfo.name = categoriaCreada.title;
            this.componentInfo.type = categoriaCreada.tipo;
            this.router.navigate([`conten/editor`]);
          });
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al iniciar la categoría'
          })
        }
        );
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'No se ha rellenado el formulario correctamente'
      });
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
