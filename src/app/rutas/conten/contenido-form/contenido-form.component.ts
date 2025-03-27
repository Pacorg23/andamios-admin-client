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

  constructor() {
    this.action = '';
    this.type = '';
    this.name = '';
  }
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
      if (_.isNil(params["name"])) {
        this.componentInfo.action = ConstantsConten.CREATE_TITLE;
      } else {
        this.componentInfo.name = _.lowerCase(params["name"]);
        this.componentInfo.action = ConstantsConten.EDIT_TITLE;
        //TODO get category
      }
    });
  }

  /**
   * @description Inicializa el formulario de categorias
   * @param {void}
   */
  public initialForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      img: ['', Validators.required],
    });
  }

  //TODO send to sections
  /**
   * @description Simula el click a un archivo
   * @param {void}
   * @returns void
   */
  public generateClickToFile(): void {
    document.getElementById('file-input').click();
  }

  //TODO send to sections
  /**
   * @description Agrega un archivo a la lista de archivos
   * @param {Event} event - Evento del input file
   * @param {number} newID - Nuevo ID del archivo
   * @returns void
   */
  public addImageToFileArray(event: any, newID: number): void {
    console.log('addImageToFileArray', event);
    if (!_.isNil(event.target)) {
      const newFile = _.head(event.target.files);
      if (newFile) {
        console.log('Filename', newFile.name);
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
  }

  /**
   * @description Edita la imagen seleccionada
   * @param {void}
   * @returns void
   */
  public editImage(): void {
    this.fileBanner = { name: '', fileId: 0, url: '', file: null };

    setTimeout(() => {
      this.generateClickToFile();
    }, 500);
  }

  // TODO send to sections
  /**
   * @description Elimina un archivo de la lista de archivos
   * @param {number} fileId - ID del archivo a eliminar
   * @returns void
   */
  public removeImageFromFileArray(fileId: number): void {
    this.fileArray = this.fileArray.filter((file) => file.fileId !== fileId);
  }

  // TODO send to sections
  /**
   * @description Cambia un archivo de la lista de archivos
   * @param {Event} event - Evento del input file
   * @param {number} fileId - ID del archivo a cambiar
   * @returns void
   */
  public changeImageFromFileArray(fileId: number): void {
    console.log('changeImageFromFileArray', fileId);
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
  public nextStage() {
    const formData = new FormData();
    formData.append('title', this.categoryForm.get('name').value);
    formData.append('url', this.formattedText);
    formData.append('tipo', this.categoryForm.get('type').value);
    formData.append('description', this.categoryForm.get('description').value);
    formData.append('img', this.fileBanner.file);

    // TODO if para distinguir entre acciones osea editar o crear

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
        text: 'Error al inicial la categoría'
      })
    }
    );
  }

  /**
   * @description Navigate into conten
   * @param {string} direction - Direction to go
   * @returns void
   */
  goTo(direction: string): void {
    this.router.navigate([`conten/${direction}`]);
  }

}
