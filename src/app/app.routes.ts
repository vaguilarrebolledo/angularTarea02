import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/weather',
    pathMatch: 'full'
  },
  {
    path: 'weather',
    loadComponent: () => import('./components/weather/weather').then(m => m.WeatherComponent)
  },
  {
    path: 'regions',
    loadComponent: () => import('./components/regions/regions').then(m => m.Regions)
  },
  {
    path: 'countries',
    loadComponent: () => import('./components/countries/countries').then(m => m.Countries)
  },
  {
    path: 'cities',
    loadComponent: () => import('./components/cities/cities').then(m => m.Cities)
  },
  {
    path: '**',
    redirectTo: '/weather'
  }
];
