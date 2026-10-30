import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { CountriesResponse, Country } from '../models/country';
import { Region } from '../models/region';

// Запросы идут через dev-прокси (proxy.conf.mjs), он подставляет ключ из .env
const API_URL = '/api/countries/v5';
// Максимум free-тарифа на один запрос
const MAX_LIMIT = 100;

@Service()
export class CountryApi {
  private readonly http = inject(HttpClient);

  /**
   * Все страны региона; без региона — все страны мира (≈254, это несколько запросов
   * подряд, пока в meta приходит more = true).
   */
  getCountries(region: Region | null): Observable<Country[]> {
    return this.getPage(region, 0).pipe(
      expand((response) =>
        response.data.meta.more
          ? this.getPage(region, response.data.meta.offset + response.data.meta.count)
          : EMPTY,
      ),
      reduce((all, response) => [...all, ...response.data.objects], [] as Country[]),
    );
  }

  /**
   * Полная информация об одной стране. Отдельного эндпоинта нет, поэтому фильтр
   * по точному названию (у четырёх стран нет кодов alpha_2/alpha_3, а название есть у всех).
   */
  getByName(name: string): Observable<Country> {
    return this.http
      .get<CountriesResponse>(API_URL, { params: { 'names.common': name, limit: 1 } })
      .pipe(
        map((response) => {
          const country = response.data.objects[0];
          if (!country) {
            throw new Error(`Country not found: ${name}`);
          }
          return country;
        }),
      );
  }

  private getPage(region: Region | null, offset: number): Observable<CountriesResponse> {
    return this.http.get<CountriesResponse>(API_URL, {
      params: {
        ...(region ? { region } : {}),
        limit: MAX_LIMIT,
        offset,
      },
    });
  }
}
