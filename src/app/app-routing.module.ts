import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './contactos/about.component';
import { HomeComponent } from './menu/home.component';
import { JoinnowComponent } from './login/joinnow.component';
import { CourseComponent } from './objetos-encontrados/course.component';
import { RegistroObjetosComponent } from './registro-objetos/registro-objetos.component';
import { ObjetosExtraviadosComponent } from './objetos-extraviados/objetos-extraviados.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'course',component:CourseComponent},
  {path:'perdidos',component:ObjetosExtraviadosComponent},
  {path:'registro',component:RegistroObjetosComponent},
  {path:'joinnow',component:JoinnowComponent},
  {path:'about',component:AboutComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
