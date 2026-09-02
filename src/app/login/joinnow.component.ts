import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-joinnow',
  templateUrl: './joinnow.component.html',
  styleUrls: ['./joinnow.component.css']
})
export class JoinnowComponent implements OnInit {

  isLoginActive = true;
  isRegisterActive = false;

  isLoginFormVisible = true;
  isRegisterFormVisible = false;

  loginEmail = '';
  loginPassword = '';

  registerFirstName = '';
  registerLastName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerPhoneNumber = '';
  registerAddress = '';

  error = '';
  usuario: Usuario = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;
  }

  showLoginForm() {
    this.isLoginActive = true;
    this.isRegisterActive = false;

    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
    this.error = '';
  }

  showRegisterForm() {
    this.isLoginActive = false;
    this.isRegisterActive = true;

    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
    this.error = '';
  }

  onLogin() {
    const resultado = this.authService.login(this.loginEmail, this.loginPassword);

    if (!resultado.ok) {
      this.error = resultado.error;
      return;
    }

    this.error = '';
    this.usuario = this.authService.usuarioActual;
    this.router.navigate(['/registro']);
  }

  onRegister() {
    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const resultado = this.authService.registrar({
      nombre: this.registerFirstName,
      apellido: this.registerLastName,
      email: this.registerEmail,
      telefono: this.registerPhoneNumber,
      direccion: this.registerAddress
    }, this.registerPassword);

    if (!resultado.ok) {
      this.error = resultado.error;
      return;
    }

    this.error = '';
    this.usuario = this.authService.usuarioActual;
    this.router.navigate(['/registro']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.usuario = null;
  }
}
