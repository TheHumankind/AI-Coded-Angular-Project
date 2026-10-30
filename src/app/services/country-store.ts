import { computed, inject, Service, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Continent } from '../models/continent';
import { Country } from '../models/country';
import { CountryApi } from './country-api';

// Сколько карточек показываем на одной странице
const PAGE_SIZE = 30;

@Service()
export class CountryStore {
  private readonly api = inject(CountryApi);
  private request?: Subscription;

  // Весь регион целиком; страница из него вырезается на клиенте
  private readonly _allCountries = signal<Country[]>([]);
  private readonly _page = signal(1);
  private readonly _selectedContinent = signal<Continent | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly page = this._page.asReadonly();
  readonly pageSize = PAGE_SIZE;
  readonly count = computed(() => this._allCountries().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.count() / PAGE_SIZE)));
  /** Страны текущей страницы */
  readonly countries = computed(() => {
    const start = (this._page() - 1) * PAGE_SIZE;
    return this._allCountries().slice(start, start + PAGE_SIZE);
  });
  readonly selectedContinent = this._selectedContinent.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadByContinent(continent: Continent): void {
    this._selectedContinent.set(continent);
    this._loading.set(true);
    this._error.set(null);
    this._page.set(1);

    // Отменяем предыдущий запрос, чтобы при быстрых кликах старый ответ не перезаписал новый
    this.request?.unsubscribe();

    const { region } = continent;
    console.log(`[CountryStore] request sent: region=${region}`);

    this.request = this.api.getByRegion(region).subscribe({
      next: (countries) => {
        this._allCountries.set(countries);
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

  setPage(page: number): void {
    this._page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  /** Повторить запрос для текущего выбранного континента */
  retry(): void {
    const continent = this._selectedContinent();
    if (continent) {
      this.loadByContinent(continent);
    }
  }
}
