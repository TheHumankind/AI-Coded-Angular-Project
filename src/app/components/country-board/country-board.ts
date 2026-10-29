import { Component, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { CountryCard } from '../country-card/country-card';

@Component({
  imports: [CountryCard],
  selector: 'app-country-board',
  styleUrl: './country-board.scss',
  templateUrl: './country-board.html',
})
export class CountryBoard {
  protected readonly store = inject(CountryStore);
}
