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
  private detailsRequest?: Subscription;
  // Полные данные уже открывавшихся стран (ключ — names.common), чтобы не запрашивать повторно
  private readonly detailsCache = new Map<string, Country>();

  // Весь регион целиком; страница из него вырезается на клиенте
  private readonly _allCountries = signal<Country[]>([]);
  private readonly _page = signal(1);
  private readonly _selectedContinent = signal<Continent | null>(null);
  private readonly _openedCountry = signal<Country | null>(null);
  private readonly _details = signal<Country | null>(null);
  private readonly _detailsLoading = signal(false);
  private readonly _detailsError = signal(false);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly page = this._page.asReadonly();
  readonly count = computed(() => this._allCountries().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.count() / PAGE_SIZE)));
  /** Страны текущей страницы */
  readonly countries = computed(() => {
    const start = (this._page() - 1) * PAGE_SIZE;
    return this._allCountries().slice(start, start + PAGE_SIZE);
  });
  readonly selectedContinent = this._selectedContinent.asReadonly();
  /** Страна, открытая в country-overview; null — показываем список */
  readonly openedCountry = this._openedCountry.asReadonly();
  /** Полные данные открытой страны (приходят отдельным запросом) */
  readonly details = this._details.asReadonly();
  readonly detailsLoading = this._detailsLoading.asReadonly();
  readonly detailsError = this._detailsError.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadByContinent(continent: Continent): void {
    this.closeCountry();
    this._selectedContinent.set(continent);
    this._loading.set(true);
    this._error.set(null);
    this._page.set(1);

    // Отменяем предыдущий запрос, чтобы при быстрых кликах старый ответ не перезаписал новый
    this.request?.unsubscribe();

    this.request = this.api.getCountries(continent.region).subscribe({
      next: (countries) => {
        this._allCountries.set(countries);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Request failed');
        this._loading.set(false);
        console.error(`[CountryStore] request failed: ${continent.label}`, err);
      },
    });
  }

  /** Открывает страну: сразу показывает карточку, полные данные догружает отдельным запросом */
  openCountry(country: Country): void {
    this._openedCountry.set(country);
    this.loadDetails(country.names.common);
  }

  closeCountry(): void {
    // Отменяем незавершённый запрос, чтобы он не записался в закрытую страну
    this.detailsRequest?.unsubscribe();
    this._openedCountry.set(null);
    this._details.set(null);
    this._detailsLoading.set(false);
    this._detailsError.set(false);
  }

  /** Повторить запрос полных данных открытой страны */
  retryDetails(): void {
    const country = this._openedCountry();
    if (country) {
      this.loadDetails(country.names.common);
    }
  }

  private loadDetails(name: string): void {
    this.detailsRequest?.unsubscribe();
    this._detailsError.set(false);

    const cached = this.detailsCache.get(name);
    if (cached) {
      this._details.set(cached);
      this._detailsLoading.set(false);
      return;
    }

    this._details.set(null);
    this._detailsLoading.set(true);
    this.detailsRequest = this.api.getByName(name).subscribe({
      next: (country) => {
        this.detailsCache.set(name, country);
        this._details.set(country);
        this._detailsLoading.set(false);
      },
      error: (err) => {
        console.error(`[CountryStore] country request failed: ${name}`, err);
        this._detailsError.set(true);
        this._detailsLoading.set(false);
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
