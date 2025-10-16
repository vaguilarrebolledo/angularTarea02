import { Component, OnInit, OnDestroy } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/location.interface';
import { CommonModule } from '@angular/common';
import { RegionSelectionService } from '../../services/region-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-countries',
  imports: [CommonModule],
  templateUrl: './countries.html',
  styleUrl: './countries.css'
})
export class Countries implements OnInit, OnDestroy {

  countries: Country[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private countriesService: CountriesService,
    private regionSelectionService: RegionSelectionService
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.regionSelectionService.selectedRegion$.subscribe(regionCode => {
      if (regionCode) {
        this.getCountries(regionCode);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCountries(regionCode: string) {
    this.subscription.add(this.countriesService.getCountries(regionCode).subscribe(data => {
      console.log('paises', data);
      this.countries = data;
    }));
  }
}
