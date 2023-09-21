import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json'; 
  private apiKey = 'cb723255551840f9bb4ea4d63078aed9'; 
  constructor(private http: HttpClient) { }
  
  getCityCoordinates(city: string) {
    const location = `${city}, Tunisia`;
    const params = {
      q: location,
      key: this.apiKey
    };

    return this.http.get(this.apiUrl, { params: params });
  }
}
