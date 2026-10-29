import { computed, inject, Service, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Continent } from '../models/continent';
import { Country } from '../models/country';
import { CountryApi } from './country-api';

@Service()
export class CountryStore {
  private readonly api = inject(CountryApi);
  private request?: Subscription;

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
    this._loading.set(true);
    this._error.set(null);

    // Отменяем предыдущий запрос, чтобы при быстрых кликах старый ответ не перезаписал новый
    this.request?.unsubscribe();

    const { region } = continent;
    console.log(`[CountryStore] request sent: region=${region}`);

    this.request = this.api.getByRegion(region).subscribe({
      next: (countries) => {
        this._countries.set(countries);
        this._loading.set(false);
        console.log(`[CountryStore] response received: region=${region}, ${countries.length} countries`, countries);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Request failed');
        this._loading.set(false);
        console.error(`[CountryStore] request failed: region=${region}`, err);
      },
    });
  }
}
