import { Component, OnInit, OnDestroy } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { City } from '../../interfaces/location.interface';
import { CommonModule } from '@angular/common';
import { RegionSelectionService } from '../../services/region-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cities',
  imports: [CommonModule],
  templateUrl: './cities.html',
  styleUrl: './cities.css'
})
export class Cities implements OnInit, OnDestroy {

  cities: City[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private citiesService: CitiesService,
    private regionSelectionService: RegionSelectionService
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.regionSelectionService.selectedRegion$.subscribe(regionCode => {
      if (regionCode) {
        this.getCities(regionCode);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCities(regionCode: string) {
    this.subscription.add(this.citiesService.getCities(regionCode).subscribe(data => {
      this.cities = data;
    }));
  }
}
