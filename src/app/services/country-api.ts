import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class CountryApi {
  private readonly http = inject(HttpClient);
}
