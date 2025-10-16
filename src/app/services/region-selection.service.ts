import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionSelectionService {

  private selectedRegionSource = new BehaviorSubject<string>('');
  selectedRegion$ = this.selectedRegionSource.asObservable();

  constructor() { }

  changeRegion(regionCode: string) {
    this.selectedRegionSource.next(regionCode);
  }
}
