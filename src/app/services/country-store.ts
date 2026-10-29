import { computed, Service, signal } from '@angular/core';
import { Continent } from '../models/continent';
import { Country } from '../models/country';

@Service()
export class CountryStore {
  private readonly _countries = signal<Country[]>([]);
  private readonly _selectedContinent = signal<Continent | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly countries = this._countries.asReadonly();
  readonly selectedContinent = this._selectedContinent.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._countries().length);

  loadByContinent(continent: Continent): void {
    this._selectedContinent.set(continent);
    // TODO: заменить заглушку запросом через CountryApi
  }
}
