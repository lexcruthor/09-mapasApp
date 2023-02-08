import { Component,ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy{

  // siempre que haya un listener, hay que limpiarlo cuando el componente se destruya
  ngOnDestroy(): void {
   this.mapa.off('zoom', () => {});
   this.mapa.off('zoomed', () => {});
   this.mapa.off('move', () => {});
  }

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number,number] = [-5.6869450379377575, 40.96418033158332];

  ngAfterViewInit(): void {

    this.mapa= new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center ,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom',(ev) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend',(ev) => {
      if (this.mapa.getZoom() > 19) {
       this.mapa.zoomTo(19);
      }
    });

    this.mapa.on('move',(event) => {
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng,lat];

    });

  }

  zoomIn(){
    this.mapa.zoomIn();
  
  }
  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomCambio(valor: string){
    this.mapa.zoomTo(Number(valor));
  }
}
