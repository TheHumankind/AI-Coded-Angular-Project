import { Component, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';

@Component({
  imports: [],
  selector: 'app-country-board',
  styleUrl: './country-board.scss',
  templateUrl: './country-board.html',
})
export class CountryBoard {
  protected readonly store = inject(CountryStore);
}
