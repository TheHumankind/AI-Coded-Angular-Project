import { Component, inject } from '@angular/core';
import { ALL_COUNTRIES, CONTINENTS } from '../../models/continent';
import { CountryStore } from '../../services/country-store';
import { HeaderButton } from '../header-button/header-button';

@Component({
  imports: [HeaderButton],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly store = inject(CountryStore);
  protected readonly continents = [...CONTINENTS, ALL_COUNTRIES];
}
