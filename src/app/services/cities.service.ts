import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { City } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private baseUrl = environment.baseUrl + '/locations/v1/topcities/150'; // Assuming top 150 cities

  constructor(private http: HttpClient) { }

  getCities(regionCode: string): Observable<City[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<City[]>(this.baseUrl, { headers }).pipe(
      map(cities => cities.filter(city => city.Region.ID === regionCode))
    );
  }
}
