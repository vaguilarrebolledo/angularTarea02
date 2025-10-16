import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { WeatherComponent } from './weather';
import { WeatherService } from '../../services/weather.service';
import { WeatherResponse } from '../../interfaces/weather.interface';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;

  const mockWeatherData: WeatherResponse = {
    LocalObservationDateTime: '2025-10-15T10:00:00-05:00',
    EpochTime: 1634304000,
    WeatherText: 'Sunny',
    WeatherIcon: 1,
    HasPrecipitation: false,
    IsDayTime: true,
    Temperature: {
      Metric: { Value: 25, Unit: 'C', UnitType: 17 },
      Imperial: { Value: 77, Unit: 'F', UnitType: 18 }
    },
    RelativeHumidity: 65,
    Wind: {
      Direction: { Degrees: 180, Localized: 'Sur', English: 'South' },
      Speed: {
        Metric: { Value: 15, Unit: 'km/h', UnitType: 7 },
        Imperial: { Value: 9, Unit: 'mph', UnitType: 9 }
      }
    },
    UVIndex: 5,
    UVIndexText: 'Moderate'
  };

  beforeEach(async () => {
    const weatherServiceSpy = jasmine.createSpyObj('WeatherService', [
      'getCurrentConditions',
      'getCurrentConditionsWithDetails',
      'searchLocations'
    ]);

    await TestBed.configureTestingModule({
      imports: [WeatherComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: WeatherService, useValue: weatherServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
  });

  beforeEach(() => {
    weatherService.getCurrentConditions.and.returnValue(of([mockWeatherData]));
    weatherService.getCurrentConditionsWithDetails.and.returnValue(of([mockWeatherData]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load weather data on init', () => {
    component.ngOnInit();
    
    expect(weatherService.getCurrentConditions).toHaveBeenCalledWith('266268');
    expect(component.currentWeather).toEqual(mockWeatherData);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading weather data', () => {
    weatherService.getCurrentConditions.and.returnValue(throwError(() => new Error('API Error')));
    
    component.getCurrentWeather();
    
    expect(component.error).toBe('Error al obtener los datos del clima. Verifique la conexión.');
    expect(component.loading).toBeFalse();
  });

  it('should search locations', () => {
    const mockSearchResults = [
      {
        Key: '123456',
        LocalizedName: 'Madrid',
        Country: { LocalizedName: 'España' },
        Region: { LocalizedName: 'Europa' }
      }
    ];
    
    weatherService.searchLocations.and.returnValue(of(mockSearchResults));
    component.searchQuery = 'Madrid';
    
    component.searchLocations();
    
    expect(weatherService.searchLocations).toHaveBeenCalledWith('Madrid');
    expect(component.searchResults).toEqual(mockSearchResults);
  });

  it('should select location and update weather', () => {
    const location = {
      Key: '123456',
      LocalizedName: 'Madrid'
    };
    
    component.selectLocation(location);
    
    expect(component.locationKey).toBe('123456');
    expect(component.searchQuery).toBe('Madrid');
    expect(component.searchResults).toEqual([]);
    expect(weatherService.getCurrentConditions).toHaveBeenCalledWith('123456');
  });

  it('should toggle details view', () => {
    expect(component.showDetails).toBeFalse();
    
    component.toggleDetails();
    
    expect(component.showDetails).toBeTrue();
    expect(weatherService.getCurrentConditionsWithDetails).toHaveBeenCalledWith('266268');
  });

  it('should format temperature correctly', () => {
    const temperature = {
      Metric: { Value: 25, Unit: 'C' },
      Imperial: { Value: 77, Unit: 'F' }
    };
    
    expect(component.getTemperature(temperature, 'metric')).toBe('25°C');
    expect(component.getTemperature(temperature, 'imperial')).toBe('77°F');
  });

  it('should format wind speed correctly', () => {
    const wind = {
      Speed: {
        Metric: { Value: 15, Unit: 'km/h' },
        Imperial: { Value: 9, Unit: 'mph' }
      }
    };
    
    expect(component.getWindSpeed(wind, 'metric')).toBe('15 km/h');
    expect(component.getWindSpeed(wind, 'imperial')).toBe('9 mph');
  });

  it('should generate correct weather icon URL', () => {
    const iconUrl = component.getWeatherIconUrl(1);
    expect(iconUrl).toBe('https://developer.accuweather.com/sites/default/files/01-s.png');
    
    const iconUrl2 = component.getWeatherIconUrl(15);
    expect(iconUrl2).toBe('https://developer.accuweather.com/sites/default/files/15-s.png');
  });

  it('should format date time correctly', () => {
    const dateTime = '2025-10-15T10:00:00-05:00';
    const formatted = component.formatDateTime(dateTime);
    
    expect(formatted).toContain('2025');
    expect(typeof formatted).toBe('string');
  });

  it('should refresh weather data', () => {
    spyOn(component, 'getCurrentWeather');
    
    component.refreshWeather();
    
    expect(component.getCurrentWeather).toHaveBeenCalled();
  });

  it('should clear search results when query is empty', () => {
    component.searchResults = [{ Key: '123', LocalizedName: 'Test' }];
    component.searchQuery = '';
    
    component.searchLocations();
    
    expect(component.searchResults).toEqual([]);
  });
});