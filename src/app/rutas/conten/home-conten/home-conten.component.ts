import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-conten',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-conten.component.html',
  styleUrl: './home-conten.component.css'
})
export class HomeContenComponent {
  claims:any
  filtro:string=''
  utilities:boolean = false

  //agrega las utilidades para la pagina principal
  utilidades = [
    {icon:'contacto.svg', title:'Contacto', description:'Buzon de solicitudes de contacto', url:'contacto/conten'},
    {icon: "cv.svg", title: "Solicitudes", description:"Muestra las solicitudes de empleo", url:"solicitudes/conten"},
    {icon:'negocio.svg', title:'Sucursales', description:'Edita las sucursales ', url:'sucursales'},
    {icon: 'page.svg', title: 'Página', description: 'Modifica tu pagina', url: 'editor'},
    {icon: "carrusel.svg", title: "Carrusel", description: "Modifica imágenes del carrusel", url:"carrusel"}
  ]

  constructor() { }

  filtrarUtilidades() {

    this.utilities = false

    if (this.filtro.trim() === '') {
      return this.utilidades; // Si no hay filtro, mostrar todas las utilidades
    }

    const filtro = this.filtro.toLowerCase().trim();
    const utilidadesFiltradas = this.utilidades.filter(utilidad =>
      utilidad.icon.toLowerCase().includes(filtro) ||
      utilidad.description.toLowerCase().includes(filtro)
    );

    if (utilidadesFiltradas.length === 0) {
      this.utilities = true
    }

    return utilidadesFiltradas;
  }
}
