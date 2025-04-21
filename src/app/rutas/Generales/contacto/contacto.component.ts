import { afterRender, Component } from '@angular/core';
import { SolicitudContacto } from '../../../models/general/solicitud-contacto';
import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../effects/loading/loading.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [MatIcon, LoadingComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  solicitudes: SolicitudContacto[] = []
  solicitud: SolicitudContacto
  show: boolean = false //false
  area:string = ""
  loading:boolean = false

  constructor(private accionesService: ApiService, private activatedroute: ActivatedRoute) {
    this.loading = true;
    this.activatedroute.params.subscribe(params => {
      this.area = params['area'];
      this.obtenerSolicitudes()
    })
  }

  ngOnInit() {

  }

  /**
   * @description Obtiene las solicitudes de contacto desde el servicio y las formatea
   * @returns {void}
   */
  private obtenerSolicitudes(): void {
    this.accionesService.obtenerSolicitudesContacto(this.area).subscribe(data => {
      data.forEach(solicitud => {
        const dateInMilliseconds = Date.parse(solicitud.createdAt);
        const formattedDate = new Date(dateInMilliseconds).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        solicitud.createdAt = formattedDate;
      });
      this.solicitudes = data;
      this.loading = false
    },error => {
      this.loading = false
      Swal.fire({
        title: "Error",
        confirmButtonColor: "#B30000",
        timer: 2000,
        text: error.error.mensaje,
        icon: "error"
      }).then(() => {
        this.loading = false
      });
      console.log(error)
    });
  }

  showID(id: number) { //obtengo la soli especifica
    //alert(id)
    this.loading = true
    this.accionesService.obtenerSolicitudContacto(id).subscribe(data => {
      const dates = {
        fechaA: data.createdAt,
        fechaB: data?.fecha
      }

      for (let key in dates) {
        const dateInMilliseconds = Date.parse(dates[key]);
        const formattedDate = new Date(dateInMilliseconds).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        dates[key] = formattedDate;
      }

      data.createdAt = dates.fechaA;
      data.fecha = dates.fechaB;

      this.solicitud = data
      this.show = true
      this.loading = false
    })
  }

  cerrarID(e: Event) {
    document.getElementById('caja').classList.add('outCaja')
    document.getElementById('info').classList.add('outInfo')
    setTimeout(() => {
      this.show = false;
      this.solicitud = null;
    }, 400);
  }

  downloadFile(fileName: string, base64Content: string): void {
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crear un objeto URL a partir del Blob
    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Simular clic en el enlace temporal
    link.dispatchEvent(new MouseEvent('click'));

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  }

  eliminar(e, id) {
    e.stopPropagation()
    this.loading = true
    Swal.fire({
      title: "¿Estas seguro de que quieres eliminar esta registro?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#B30000',
    }).then((result) => {
      if (result.isConfirmed) {
        this.accionesService.eliminarSolicitudContacto(id).subscribe(data => {
          Swal.fire({
            title: "Eliminado",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.obtenerSolicitudes()
          })
        }, err => {
          Swal.fire({
            title: "Error",
            confirmButtonColor: "#B30000",
            timer: 2000,
            text: err.error.mensaje,
            icon: "error"
          }).then(() => {
            this.loading = false
          })
        })
      }
    })
  }


  goBack() {
    window.history.back();
  }

}
