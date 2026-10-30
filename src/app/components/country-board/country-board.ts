import { Component, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { CountryCard } from '../country-card/country-card';
import { CountryPagination } from '../country-pagination/country-pagination';

@Component({
  imports: [CountryCard, CountryPagination],
  selector: 'app-country-board',
  styleUrl: './country-board.scss',
  templateUrl: './country-board.html',
})
export class CountryBoard {
  protected readonly store = inject(CountryStore);
}
