import { Component, NgZone, OnInit } from '@angular/core';
import { MlService } from '../services/ml.service';
import { ObjetosService } from '../services/objetos.service';
import { Coincidencia } from '../models/objeto.model';
import { Deteccion, interpretarPrediccion } from '../models/clasificacion';

@Component({
  selector: 'app-buscar-foto',
  templateUrl: './buscar-foto.component.html',
  styleUrls: ['./buscar-foto.component.css']
})
export class BuscarFotoComponent implements OnInit {

  imagenUrl: string = null;
  analizando = false;
  errorAnalisis = '';
  deteccion: Deteccion = null;
  coincidencias: Coincidencia[] = [];
  totalDisponibles = 0;
  yaBusco = false;

  constructor(
    private mlService: MlService,
    private objetosService: ObjetosService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    // Cuántos objetos en la base ya tienen foto analizada por el modelo,
    // para poder explicar por qué a veces no aparecen coincidencias.
    this.totalDisponibles = this.objetosService.getTodos().filter(o => !!o.featureVector).length;
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.reset();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagenUrl = reader.result as string;
      this.analizar(this.imagenUrl);
    };
  }

  private reset() {
    this.deteccion = null;
    this.coincidencias = [];
    this.errorAnalisis = '';
    this.yaBusco = false;
  }

  private async analizar(dataUrl: string) {
    this.analizando = true;

    try {
      const img = await this.mlService.cargarImagen(dataUrl);
      const resultado = await this.mlService.clasificar(img);
      const vector = await this.mlService.extraerVector(img);

      this.zone.run(() => {
        this.deteccion = interpretarPrediccion(resultado.label, resultado.confidence);
        this.coincidencias = this.objetosService.buscarSimilaresGlobal(vector);
        this.yaBusco = true;
        this.analizando = false;
      });
    } catch (e) {
      this.zone.run(() => {
        this.analizando = false;
        this.yaBusco = true;
        this.errorAnalisis = 'No se pudo analizar la imagen. Revisa tu conexión e inténtalo de nuevo.';
      });
    }
  }

  porcentaje(score: number): number {
    return Math.round(score * 100);
  }
}
