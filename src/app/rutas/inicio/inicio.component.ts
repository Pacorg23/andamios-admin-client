import { afterRender, Component, ViewChild } from '@angular/core';
import { distinctUntilChanged, interval, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  usuario:any
  @ViewChild('time') time:any
  timeNow:string = ""

  constructor() {
    this.usuario = "Administrador"

    /**/
    afterRender(() => {
      setInterval(() => {
        this.actualizarHora()
        this.time.nativeElement.innerHTML = this.timeNow
      }, 1000)
    })

    /**/
  }

  private actualizarHora(): void {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaActual.getFullYear();
    const hora = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaActual.getSeconds().toString().padStart(2, '0');

    this.timeNow = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
  }

}
