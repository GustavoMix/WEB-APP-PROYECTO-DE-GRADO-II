import { Component, OnInit } from '@angular/core';
import { ObjetosService } from '../services/objetos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  resumen = { total: 0, perdidos: 0, encontrados: 0 };

  constructor(private objetosService: ObjetosService) { }

  ngOnInit(): void {
    this.resumen = this.objetosService.getResumen();
  }
}
