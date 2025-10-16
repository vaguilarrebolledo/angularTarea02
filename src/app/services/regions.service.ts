import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Region } from '../interfaces/region.interface';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  private apiUrl = `${environment.baseUrl}/locations/v1/regions`;

  constructor(private http: HttpClient) { }

  getRegions(): Observable<Region[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<Region[]>(this.apiUrl, { headers }).pipe(
      map(regions => regions.map(region => ({
        ID: region.ID,
        LocalizedName: region.LocalizedName,
        EnglishName: region.EnglishName
      })))
    );
  }
}
