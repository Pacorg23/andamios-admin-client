import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Sucursal } from '../../../models/general/sucursal';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ContenService } from '../service/conten.service';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent {

  sucursales: Sucursal[] = [];
  displayedColumns: string[];
  isFormVisible: boolean;
  imagen: File | null = null;
  fileName: string;
  form: FormGroup;
  isEditing: boolean;
  folioEditing: number | null = null;

  constructor(private fb: FormBuilder, private router: Router, private contenService: ContenService) {
    this.sucursales = [];
    this.displayedColumns = ['id', 'nombre', 'direccion', 'descripcion', 'imagen', 'acciones'];
    this.isFormVisible = false;
    this.isEditing = false;
    this.fileName = '';
    this.initForm();
    this.initComponent();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
    });
  }

  private initComponent(): void {
    this.contenService.obtenerSucursales().subscribe((sucursales: Sucursal[]) => {
      this.sucursales = sucursales;
    },
      (error) => {
        console.error('Error al obtener las sucursales:', error);

      });
  }

  public goBack(): void {
    this.router.navigate(['/conten']);
  }

  public showForm(sucursal: Sucursal): void {
    this.isFormVisible = true;
    this.isEditing = true;
    this.folioEditing = sucursal.id;
    this.form.patchValue({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      descripcion: sucursal.descripcion
    });
  }

  public deleteSucursal(sucursal: Sucursal): void {
    this.contenService.eliminarSucursal(sucursal.id).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Sucursal eliminada correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.initComponent();
      });
    }, (error) => {
      console.error('Error al eliminar la sucursal:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la sucursal. Inténtalo de nuevo más tarde.',
        confirmButtonText: 'Aceptar'
      });
    }
    );
  }

  public agregarSucursal(): void {
    this.isFormVisible = true;
  }

  public onSubmit(): void {
    const formData = new FormData();
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('direccion', this.form.get('direccion')?.value);
    formData.append('descripcion', this.form.get('descripcion')?.value);
    if (this.imagen) {
      formData.append('imagen', this.imagen, this.imagen.name);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona una imagen para la sucursal.',
        confirmButtonText: 'Aceptar'
      });
    }

    if (!this.isEditing) {

      if (this.form.valid && this.imagen) {
        this.contenService.agregarSucursal(formData).subscribe((sucursal: Sucursal) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Sucursal agregada correctamente.',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.initComponent();
            this.isFormVisible = false;
            this.isEditing = false;
            this.form.reset();
            this.removeFile();
          });
        }, (error) => {
          console.error('Error al agregar la sucursal:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar la sucursal. Inténtalo de nuevo más tarde.',
            confirmButtonText: 'Aceptar'
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos requeridos.',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      if (this.form.valid) {
        formData.append('id', this.folioEditing?.toString() || '');
        this.contenService.editarSucursal(formData).subscribe((sucursal: Sucursal) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Sucursal editada correctamente.',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.initComponent();
            this.isFormVisible = false;
            this.isEditing = false;
            this.form.reset();
            this.removeFile();
          });
        }, (error) => {
          console.error('Error al editar la sucursal:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo editar la sucursal. Inténtalo de nuevo más tarde.',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    }
  }

  public closeForm(): void {
    this.isFormVisible = false;
  }

  public addFile(): void {
    document.getElementById('fileInput')?.click();
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
    }
  }

  public removeFile(): void {
    this.imagen = null;
    this.fileName = '';
  }
}
