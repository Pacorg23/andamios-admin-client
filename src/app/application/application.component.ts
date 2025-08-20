import { Component } from '@angular/core';
import { NavbarComponent } from '../componentes/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

}
