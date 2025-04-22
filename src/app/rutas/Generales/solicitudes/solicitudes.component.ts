import { afterRender, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';
import { Solicitud } from '../../../models/general/solicitud';
import { MatIcon } from '@angular/material/icon';
import { LoadingComponent } from '../../../effects/loading/loading.component';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [MatIcon, LoadingComponent],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent {

  division:string = ""
  solicitudes:Solicitud[]
  controlSort:boolean = true
  icon:string = "north"
  loading:boolean = false

  constructor(private accionesService: ApiService, private activatedroute: ActivatedRoute) {
    this.loading = true;
    this.activatedroute.params.subscribe(params => {
      this.division = params['division'];
      this.obtenerLista()
    });
  }

  /**
   * @description Obtiene las solicitudes de contacto desde el servicio y las formatea
   * @returns {void}
   */
   private obtenerLista(): void{
    this.accionesService.obtenerSolicitudes(this.division).subscribe(res=>{
      this.solicitudes = res;
      this.loading = false;
    },error=>{
      this.loading = false;
      console.log(error)
    })
  }

  ordenarPorFecha(): void {
    if(this.controlSort){ //falso se ordena del mas reciente
      this.solicitudes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.icon = "south"
      this.controlSort = false
    } else{
      this.solicitudes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.icon ="north"
      this.controlSort = true
    }
  }

  ordenarPorNombre(): void {
    this.icon = ""
    this.solicitudes.sort((a,b)=> a.nombre.localeCompare(b.nombre))
  }

  ordenarPorArea(): void {
    this.icon = ""
    this.solicitudes.sort((a,b)=> a.area.localeCompare(b.area))
  }

  downloadFile(fileName: string, base64Content: string): void {
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  borrar(id:number){
    this.loading = true
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      iconColor:"#B30000",
      showCancelButton: true,
      confirmButtonColor:"#B30000",
      cancelButtonColor:"#B30000",
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accionesService.eliminarSolicitud(id).subscribe(()=>{
          Swal.fire({
            title:"Eliminado",
            icon:"success",
            iconColor:"#B30000",
            confirmButtonColor:"#B30000"
          }).then(()=>{
            this.obtenerLista()

          })
        }, (error)=>{
          Swal.fire({
            icon:"error",
            iconColor:"#B30000",
            title:"Error al eliminar",
            confirmButtonColor:"#B30000",
            text: error.error
          }).then(()=>{
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
