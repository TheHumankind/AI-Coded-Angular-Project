import { Component, computed, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { flattenObject } from '../../utils/flatten-object';
import { Button } from '../button/button';
import { RequestStatus } from '../request-status/request-status';

@Component({
  imports: [Button, RequestStatus],
  selector: 'app-country-overview',
  styleUrl: './country-overview.scss',
  templateUrl: './country-overview.html',
})
export class CountryOverview {
  protected readonly store = inject(CountryStore);

  protected readonly rows = computed(() => flattenObject(this.store.details()));
}
