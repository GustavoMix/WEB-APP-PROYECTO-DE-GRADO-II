import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoObjetosComponent } from './listado-objetos/listado-objetos.component';
import { JoinnowComponent } from './login/joinnow.component';
import { HomeComponent } from './menu/home.component';
import { AboutComponent } from './contactos/about.component';
import { RegistroObjetosComponent } from './registro-objetos/registro-objetos.component';
import { RegistroActividadComponent } from './registro-actividad/registro-actividad.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { BuscarFotoComponent } from './buscar-foto/buscar-foto.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListadoObjetosComponent,
    JoinnowComponent,
    AboutComponent,
    RegistroObjetosComponent,
    RegistroActividadComponent,
    EstadisticasComponent,
    BuscarFotoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
