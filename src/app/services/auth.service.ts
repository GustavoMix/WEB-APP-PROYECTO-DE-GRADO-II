import { Injectable } from '@angular/core';

export interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
}

interface UsuarioAlmacenado extends Usuario {
  passwordHash: string;
}

const USUARIOS_KEY = 'usuarios_v1';
const SESION_KEY = 'sesion_v1';

/**
 * Autenticación local, sin servidor.
 *
 * IMPORTANTE: esto NO es seguridad real. Los usuarios viven en el
 * localStorage del navegador, así que cada dispositivo tiene su propia
 * lista y cualquiera con acceso al navegador puede leerlos o modificarlos.
 * El "hash" de la contraseña solo evita guardarla en texto plano a simple
 * vista; no resiste un atacante. Para un sistema real hace falta un backend
 * (por ejemplo Supabase) que valide credenciales del lado del servidor.
 *
 * Sirve para la demo: permite identificar quién reporta cada objeto y
 * mostrar un contacto a quien lo busca.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarios: UsuarioAlmacenado[];
  private sesion: Usuario = null;

  constructor() {
    const usuariosGuardados = localStorage.getItem(USUARIOS_KEY);
    this.usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const sesionGuardada = localStorage.getItem(SESION_KEY);
    this.sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;
  }

  get usuarioActual(): Usuario {
    return this.sesion;
  }

  get estaAutenticado(): boolean {
    return !!this.sesion;
  }

  registrar(datos: Usuario, password: string): { ok: boolean; error?: string } {
    const email = datos.email.trim().toLowerCase();

    if (this.usuarios.some(u => u.email === email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const usuario: UsuarioAlmacenado = {
      ...datos,
      email,
      passwordHash: this.hash(password)
    };

    this.usuarios.push(usuario);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(this.usuarios));
    this.abrirSesion(usuario);

    return { ok: true };
  }

  login(email: string, password: string): { ok: boolean; error?: string } {
    const normalizado = email.trim().toLowerCase();
    const usuario = this.usuarios.find(u => u.email === normalizado);

    if (!usuario || usuario.passwordHash !== this.hash(password)) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    this.abrirSesion(usuario);
    return { ok: true };
  }

  logout(): void {
    this.sesion = null;
    localStorage.removeItem(SESION_KEY);
  }

  private abrirSesion(usuario: UsuarioAlmacenado): void {
    const { passwordHash, ...datosPublicos } = usuario;
    this.sesion = datosPublicos;
    localStorage.setItem(SESION_KEY, JSON.stringify(this.sesion));
  }

  /**
   * Hash simple (djb2). Solo evita el texto plano a simple vista;
   * no es criptográficamente seguro.
   */
  private hash(texto: string): string {
    let h = 5381;
    for (let i = 0; i < texto.length; i++) {
      h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
    }
    return String(h);
  }
}
