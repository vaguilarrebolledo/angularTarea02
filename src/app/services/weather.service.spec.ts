import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { WeatherResponse } from '../interfaces/weather.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get current conditions', () => {
    const mockResponse: WeatherResponse[] = [{
      LocalObservationDateTime: '2025-10-15T10:00:00-05:00',
      EpochTime: 1634304000,
      WeatherText: 'Sunny',
      WeatherIcon: 1,
      HasPrecipitation: false,
      IsDayTime: true,
      Temperature: {
        Metric: {
          Value: 25,
          Unit: 'C',
          UnitType: 17
        },
        Imperial: {
          Value: 77,
          Unit: 'F',
          UnitType: 18
        }
      }
    }];

    const locationKey = '266268';

    
  });

  it('should get current conditions with details', () => {
    const mockResponse: WeatherResponse[] = [{
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
      UVIndex: 5,
      UVIndexText: 'Moderate'
    }];

    const locationKey = '266268';

    service.getCurrentConditionsWithDetails(locationKey).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response[0].RelativeHumidity).toBe(65);
    });

    const req = httpMock.expectOne(req => 
      req.url === `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}` &&
      req.params.get('details') === 'true'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search locations', () => {
    const mockResponse = [
      {
        Version: 1,
        Key: '266268',
        Type: 'City',
        Rank: 10,
        LocalizedName: 'Buenos Aires',
        EnglishName: 'Buenos Aires',
        PrimaryPostalCode: '',
        Region: { ID: 'SAM', LocalizedName: 'South America', EnglishName: 'South America' },
        Country: { ID: 'AR', LocalizedName: 'Argentina', EnglishName: 'Argentina' }
      }
    ];

    const query = 'Buenos Aires';

    service.searchLocations(query).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response[0].LocalizedName).toBe('Buenos Aires');
    });

    const req = httpMock.expectOne(req => 
      req.url === 'https://dataservice.accuweather.com/locations/v1/cities/search' &&
      req.params.get('q') === query
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});