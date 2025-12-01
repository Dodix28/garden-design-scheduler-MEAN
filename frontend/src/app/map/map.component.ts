import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{

  constructor(private mapService: MapService){}
ngOnInit(): void {

}
  ngAfterViewInit(): void {
    console.log('ngOnInit called');
    this.initMap();
  }

  map: L.Map | undefined;
  marker: L.Marker | undefined;

  initMap(): void {
    console.log('initMap called');
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Element sa ID-jem "map" nije pronađen');
      return;
    }

  console.log('Map element dimensions:', mapElement.clientWidth, mapElement.clientHeight);

    this.map = L.map(mapElement).setView([45.2671, 19.8335], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      minZoom: 5,
      zoomOffset: 0,
       attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);


    this.map.on('tileerror', (event: L.TileErrorEvent) => {
      console.log('Tile load error:', event);
    });

    this.map.on('tileload', (event: L.TileEvent) => {
      console.log('Tile loaded:', event.tile.src);
    });

  this.map.on('load', () => {
    console.log('Map loaded');
  });

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const latlng = event.latlng;
      this.addMarker(latlng.lat, latlng.lng);
      this.sendLocationToServer(latlng.lat, latlng.lng);
      this.mapService.setCoordinates(latlng.lat, latlng.lng);
    });
  }

  addMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else if(this.map){
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  sendLocationToServer(lat: number, lng: number): void {
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  }
}
