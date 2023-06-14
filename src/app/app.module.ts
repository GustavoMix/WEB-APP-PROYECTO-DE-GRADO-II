import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './objetos-encontrados/course.component';
import { JoinnowComponent } from './login/joinnow.component';
import { HomeComponent } from './menu/home.component';
import { AboutComponent } from './contactos/about.component';
import { FormsModule } from '@angular/forms';
import { RegistroObjetosComponent } from './registro-objetos/registro-objetos.component';
import { ObjetosExtraviadosComponent } from './objetos-extraviados/objetos-extraviados.component';
import { RegistroActividadComponent } from './registro-actividad/registro-actividad.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseComponent,
    JoinnowComponent,
    AboutComponent,
    RegistroObjetosComponent,
    ObjetosExtraviadosComponent,
    RegistroActividadComponent,
    EstadisticasComponent,
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
