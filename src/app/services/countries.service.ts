import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl = `${environment.baseUrl}/locations/v1/topcities/regions`;

  constructor(private http: HttpClient) { }

  getCountries(regionCode: string): Observable<Country[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<Country[]>(`${this.apiUrl}/${regionCode}`, { headers }).pipe(
      map(countries => countries.map(country => ({
        ID: country.ID,
        LocalizedName: country.LocalizedName,
        EnglishName: country.EnglishName
      })))
    );
  }
}
