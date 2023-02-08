import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


interface MarcadorColor {
  color?: string;
  marcador?: mapboxgl.Marker;
  centro?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-5.6869450379377575, 40.96418033158332];


  //Array de marcadores
  marcadores: MarcadorColor[] = []


  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocal();
  }

  irMarcador(marcador?: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marcador?.getLngLat()
    })
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    }).setLngLat(this.center).addTo(this.mapa);

    this.marcadores.push({
      color,
      marcador: nuevoMarcador
    });

    this.guardarMarcadoresLocal()
  }


  guardarMarcadoresLocal() {

    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marcador!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))

  }

  leerLocal() {

    if (!localStorage.getItem('marcadores')) {
      return
    }
    const lgnLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!)

    lgnLatArr.forEach(m => {
      const nuevoMarcador = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

        this.marcadores.push({
          marcador : nuevoMarcador,
          color : m.color

        })
    })

  }

}
