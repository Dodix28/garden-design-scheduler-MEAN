import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  private coordinates: { lat: number; lng: number } | null = null;

  setCoordinates(lat: number, lng: number): void {
    this.coordinates = { lat, lng };
  }

  getCoordinates(): { lat: number; lng: number } | null {
    return this.coordinates;
  }

  getLatitude(){
    return this.coordinates?.lat
  }

  getLongitude(){
    return this.coordinates?.lng
  }
}
