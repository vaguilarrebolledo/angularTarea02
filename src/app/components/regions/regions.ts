import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegionsService } from '../../services/regions.service';
import { CommonModule } from '@angular/common';
import { Region } from '../../interfaces/location.interface';
import { RegionSelectionService } from '../../services/region-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-regions',
  imports: [CommonModule],
  templateUrl: './regions.html',
  styleUrl: './regions.css'
})
export class Regions implements OnInit, OnDestroy {

  regions: Region[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private regionsService: RegionsService,
    private regionSelectionService: RegionSelectionService
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.regionsService.getRegions().subscribe(data => {
      console.log(data);
      this.regions = data;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegionChange(event: any) {
    const regionCode = event.target.value;
    this.regionSelectionService.changeRegion(regionCode);
  }

}
