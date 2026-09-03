import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eeducation';

  constructor(private authService: AuthService) { }

  get usuario() {
    return this.authService.usuarioActual;
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
