import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CountriesResponse, Country } from '../models/country';
import { Region } from '../models/region';

// Запросы идут через dev-прокси (proxy.conf.mjs), он подставляет ключ из .env
const API_URL = '/api/countries/v5';
// Максимум free-тарифа; в каждом регионе стран меньше (до 60), поэтому грузим регион целиком
const MAX_LIMIT = 100;

@Service()
export class CountryApi {
  private readonly http = inject(HttpClient);

  getByRegion(region: Region): Observable<Country[]> {
    return this.http
      .get<CountriesResponse>(API_URL, {
        params: {
          region,
          limit: MAX_LIMIT,
        },
      })
      .pipe(map((response) => response.data.objects));
  }
}
