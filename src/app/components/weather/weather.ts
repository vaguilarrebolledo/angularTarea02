import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { WeatherResponse } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrls: ['./weather.css']
})
export class WeatherComponent implements OnInit {
  
  currentWeather: WeatherResponse | null = null;
  loading: boolean = false;
  error: string | null = null;
  locationKey: string = '266268'; // Default: Buenos Aires
  searchQuery: string = '';
  searchResults: any[] = [];
  showDetails: boolean = false;
  imageLoadError: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getCurrentWeather();
  }

  /**
   * Obtiene el clima actual para la ubicación seleccionada
   */
  getCurrentWeather(): void {
    this.loading = true;
    this.error = null;
    this.imageLoadError = false; // Reset image error state

    const weatherObservable = this.showDetails 
      ? this.weatherService.getCurrentConditionsWithDetails(this.locationKey)
      : this.weatherService.getCurrentConditions(this.locationKey);

    weatherObservable.subscribe({
      next: (response: WeatherResponse[]) => {
        if (response && response.length > 0) {
          this.currentWeather = response[0];
        } else {
          this.error = 'No se encontraron datos del clima';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener el clima:', err);
        this.error = 'Error al obtener los datos del clima. Verifique la conexión.';
        this.loading = false;
      }
    });
  }

  /**
   * Busca ubicaciones por nombre
   */
  searchLocations(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.weatherService.searchLocations(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results.slice(0, 5); // Limitar a 5 resultados
      },
      error: (err) => {
        console.error('Error al buscar ubicaciones:', err);
        this.searchResults = [];
      }
    });
  }

  /**
   * Selecciona una ubicación de los resultados de búsqueda
   */
  selectLocation(location: any): void {
    this.locationKey = location.Key;
    this.searchQuery = location.LocalizedName;
    this.searchResults = [];
    this.getCurrentWeather();
  }

  /**
   * Alterna entre vista simple y detallada
   */
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.getCurrentWeather();
  }

  /**
   * Recarga los datos del clima
   */
  refreshWeather(): void {
    this.getCurrentWeather();
  }

  /**
   * Obtiene la URL del ícono del clima
   */
  getWeatherIconUrl(iconNumber: number): string {
    const iconStr = iconNumber.toString().padStart(2, '0');
    return `https://developer.accuweather.com/sites/default/files/${iconStr}-s.png`;
  }

  /**
   * Formatea la fecha y hora
   */
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene la temperatura en la unidad preferida
   */
  getTemperature(temp: any, unit: 'metric' | 'imperial' = 'metric'): string {
    if (!temp) return 'N/A';
    
    if (unit === 'metric') {
      return `${temp.Metric?.Value || 'N/A'}°${temp.Metric?.Unit || 'C'}`;
    } else {
      return `${temp.Imperial?.Value || 'N/A'}°${temp.Imperial?.Unit || 'F'}`;
    }
  }

  /**
   * Obtiene la velocidad del viento
   */
  getWindSpeed(wind: any, unit: 'metric' | 'imperial' = 'metric'): string {
    if (!wind?.Speed) return 'N/A';
    
    if (unit === 'metric') {
      return `${wind.Speed.Metric?.Value || 'N/A'} ${wind.Speed.Metric?.Unit || 'km/h'}`;
    } else {
      return `${wind.Speed.Imperial?.Value || 'N/A'} ${wind.Speed.Imperial?.Unit || 'mph'}`;
    }
  }

  /**
   * Maneja el error de carga de imagen
   */
  onImageError(event: any): void {
    this.imageLoadError = true;
  }

  /**
   * Obtiene un emoji para representar el clima cuando la imagen falla
   */
  getWeatherEmoji(iconNumber: number): string {
    const weatherEmojis: { [key: number]: string } = {
      1: '☀️',   // Sunny
      2: '🌤️',   // Mostly Sunny
      3: '⛅',   // Partly Sunny
      4: '☁️',   // Intermittent Clouds
      5: '🌫️',   // Hazy Sunshine
      6: '⛅',   // Mostly Cloudy
      7: '☁️',   // Cloudy
      8: '☁️',   // Dreary
      11: '🌫️',  // Fog
      12: '🌧️',  // Showers
      13: '🌦️',  // Mostly Cloudy w/ Showers
      14: '🌦️',  // Partly Sunny w/ Showers
      15: '⛈️',   // T-Storms
      16: '⛈️',   // Mostly Cloudy w/ T-Storms
      17: '🌦️',  // Partly Sunny w/ T-Storms
      18: '🌧️',  // Rain
      19: '🌨️',  // Flurries
      20: '🌨️',  // Mostly Cloudy w/ Flurries
      21: '🌨️',  // Partly Sunny w/ Flurries
      22: '❄️',   // Snow
      23: '🌨️',  // Mostly Cloudy w/ Snow
      24: '🧊',   // Ice
      25: '🌨️',  // Sleet
      26: '🌨️',  // Freezing Rain
      29: '🌧️',  // Rain and Snow
      30: '🌡️',   // Hot
      31: '🥶',   // Cold
      32: '💨',   // Windy
      33: '🌙',   // Clear (Night)
      34: '☁️',   // Mostly Clear (Night)
      35: '⛅',   // Partly Cloudy (Night)
      36: '☁️',   // Intermittent Clouds (Night)
      37: '🌫️',   // Hazy Moonlight
      38: '☁️',   // Mostly Cloudy (Night)
      39: '🌦️',  // Partly Cloudy w/ Showers (Night)
      40: '🌦️',  // Mostly Cloudy w/ Showers (Night)
      41: '⛈️',   // Partly Cloudy w/ T-Storms (Night)
      42: '⛈️',   // Mostly Cloudy w/ T-Storms (Night)
      43: '🌨️',  // Mostly Cloudy w/ Flurries (Night)
      44: '🌨️'   // Mostly Cloudy w/ Snow (Night)
    };

    return weatherEmojis[iconNumber] || '🌤️';
  }
}