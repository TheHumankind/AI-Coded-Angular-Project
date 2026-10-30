import { Component, computed, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { Button } from '../button/button';

@Component({
  imports: [Button],
  selector: 'app-country-pagination',
  styleUrl: './country-pagination.scss',
  templateUrl: './country-pagination.html',
})
export class CountryPagination {
  protected readonly store = inject(CountryStore);

  protected readonly pages = computed(() =>
    Array.from({ length: this.store.totalPages() }, (_, i) => i + 1),
  );
}
