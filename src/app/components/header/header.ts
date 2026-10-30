import { Component, inject, signal } from '@angular/core';
import { ALL_COUNTRIES, Continent, CONTINENTS } from '../../models/continent';
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
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  protected loadContinent(continent: Continent): void {
    this.store.loadByContinent(continent);
    this.menuOpen.set(false);
  }
}
