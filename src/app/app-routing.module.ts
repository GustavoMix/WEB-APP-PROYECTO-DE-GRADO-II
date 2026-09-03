import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './contactos/about.component';
import { HomeComponent } from './menu/home.component';
import { JoinnowComponent } from './login/joinnow.component';
import { ListadoObjetosComponent } from './listado-objetos/listado-objetos.component';
import { RegistroObjetosComponent } from './registro-objetos/registro-objetos.component';
import { RegistroActividadComponent } from './registro-actividad/registro-actividad.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { BuscarFotoComponent } from './buscar-foto/buscar-foto.component';

/**
 * Las listas de extraviados y encontrados usan el mismo componente: solo
 * cambian el tipo de objeto y los textos, que viajan en `data`.
 */
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'course',
    component: ListadoObjetosComponent,
    data: {
      tipo: 'encontrado',
      titulo: 'Objetos Encontrados',
      subtitulo: 'Objetos que alguien encontró. Revisa si alguno es tuyo.',
      etiquetaContacto: 'Encontrado por'
    }
  },
  {
    path: 'perdidos',
    component: ListadoObjetosComponent,
    data: {
      tipo: 'perdido',
      titulo: 'Objetos Extraviados',
      subtitulo: 'Objetos que otras personas están buscando. Si alguno es tuyo, contáctanos.',
      etiquetaContacto: 'Contacto'
    }
  },
  { path: 'registro', component: RegistroObjetosComponent },
  { path: 'buscar', component: BuscarFotoComponent },
  { path: 'joinnow', component: JoinnowComponent },
  { path: 'about', component: AboutComponent },
  { path: 'actividad', component: RegistroActividadComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
