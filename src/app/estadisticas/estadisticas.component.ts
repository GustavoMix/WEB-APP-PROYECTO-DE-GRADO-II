import { Component, OnInit } from '@angular/core';
import { ObjetosService } from '../services/objetos.service';

interface Barra {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  resumen = { total: 0, perdidos: 0, encontrados: 0, recuperados: 0 };
  porCategoriaPerdidos: Barra[] = [];
  porCategoriaEncontrados: Barra[] = [];

  constructor(private objetosService: ObjetosService) { }

  ngOnInit(): void {
    this.resumen = this.objetosService.getResumen();
    this.porCategoriaPerdidos = this.aBarras(this.objetosService.getConteoPorCategoria('perdido'));
    this.porCategoriaEncontrados = this.aBarras(this.objetosService.getConteoPorCategoria('encontrado'));
  }

  private aBarras(conteo: { categoria: string; cantidad: number }[]): Barra[] {
    const max = conteo.length ? conteo[0].cantidad : 1;
    return conteo.map(c => ({
      categoria: c.categoria,
      cantidad: c.cantidad,
      porcentaje: Math.round((c.cantidad / max) * 100)
    }));
  }

  get porcentajeRecuperados(): number {
    return this.resumen.total ? Math.round((this.resumen.recuperados / this.resumen.total) * 100) : 0;
  }
}
