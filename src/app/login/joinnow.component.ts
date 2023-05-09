import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-joinnow',
  templateUrl: './joinnow.component.html',
  styleUrls: ['./joinnow.component.css']
})
export class JoinnowComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

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

  showLoginForm() {
    this.isLoginActive = true;
    this.isRegisterActive = false;

    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
  }

  showRegisterForm() {
    this.isLoginActive = false;
    this.isRegisterActive = true;

    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
  }

  onLogin() {
    // Aquí puedes agregar tu lógica para iniciar sesión
    console.log('Iniciando sesión con correo electrónico:', this.loginEmail);
    console.log('Contraseña:', this.loginPassword);
  }

  onRegister() {
    // Aquí puedes agregar tu lógica para registrar un nuevo usuario
    console.log('Registrando nuevo usuario con correo electrónico:', this.registerEmail);
    console.log('Nombre:', this.registerFirstName);
    console.log('Apellido:', this.registerLastName);
    console.log('Contraseña:', this.registerPassword);
    console.log('Teléfono:', this.registerPhoneNumber);
    console.log('Dirección:', this.registerAddress);
  }


}
