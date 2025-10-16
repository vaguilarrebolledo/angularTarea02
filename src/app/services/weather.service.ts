import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherResponse } from '../interfaces/weather.interface';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  /**
   * Obtiene las condiciones actuales del clima para una ubicación específica
   * @param locationKey - Clave de ubicación de AccuWeather
   * @returns Observable con los datos del clima actual
   */
  getCurrentConditions(locationKey: string): Observable<WeatherResponse[]> {
    const url = `${this.baseUrl}/currentconditions/v1/${locationKey}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<WeatherResponse[]>(url, { headers });
  }

  /**
   * Obtiene las condiciones actuales del clima con detalles adicionales
   * @param locationKey - Clave de ubicación de AccuWeather
   * @returns Observable con los datos detallados del clima actual
   */
  getCurrentConditionsWithDetails(locationKey: string): Observable<WeatherResponse[]> {
    const url = `${this.baseUrl}/currentconditions/v1/${locationKey}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    const params = {
      details: 'true'
    };

    return this.http.get<WeatherResponse[]>(url, { headers, params });
  }

  /**
   * Obtiene el pronóstico de 1 día
   * @param locationKey - Clave de ubicación de AccuWeather
   * @returns Observable con el pronóstico de 1 día
   */
  getOneDayForecast(locationKey: string): Observable<any> {
    const url = `${this.baseUrl}/forecasts/v1/daily/1day/${locationKey}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<any>(url, { headers });
  }

  /**
   * Obtiene el pronóstico de 5 días
   * @param locationKey - Clave de ubicación de AccuWeather
   * @returns Observable con el pronóstico de 5 días
   */
  getFiveDayForecast(locationKey: string): Observable<any> {
    const url = `${this.baseUrl}/forecasts/v1/daily/5day/${locationKey}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    return this.http.get<any>(url, { headers });
  }

  /**
   * Busca ubicaciones por texto
   * @param query - Texto de búsqueda
   * @returns Observable con las ubicaciones encontradas
   */
  searchLocations(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/locations/v1/cities/search`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.apiKey}`
    });

    const params = {
      q: query,
      language: 'es-cl'
    };

    return this.http.get<any[]>(url, { headers, params });
  }
}