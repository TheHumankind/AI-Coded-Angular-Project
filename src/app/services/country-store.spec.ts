import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Continent } from '../models/continent';
import { Country } from '../models/country';
import { Region } from '../models/region';
import { CountryApi } from './country-api';
import { CountryStore } from './country-store';

const EUROPE: Continent = { region: Region.Europe, label: 'Europe' };
const ASIA: Continent = { region: Region.Asia, label: 'Asia' };

// В тестах нужны только поля, которые читает store
function country(name: string): Country {
  return { uuid: name, names: { common: name } } as Country;
}

function countries(count: number): Country[] {
  return Array.from({ length: count }, (_, i) => country(`Country ${i + 1}`));
}

describe('CountryStore', () => {
  const api = { getCountries: vi.fn(), getByName: vi.fn() };
  let store: CountryStore;

  beforeEach(() => {
    api.getCountries.mockReset();
    api.getByName.mockReset();
    TestBed.configureTestingModule({ providers: [{ provide: CountryApi, useValue: api }] });
    store = TestBed.inject(CountryStore);
  });

  describe('loading a region', () => {
    it('shows loading until the response arrives, then the first page', () => {
      const response = new Subject<Country[]>();
      api.getCountries.mockReturnValue(response);

      store.loadByContinent(EUROPE);
      expect(store.loading()).toBe(true);
      expect(store.selectedContinent()).toBe(EUROPE);
      expect(api.getCountries).toHaveBeenCalledWith(Region.Europe);

      response.next(countries(5));
      expect(store.loading()).toBe(false);
      expect(store.countries().length).toBe(5);
    });

    it('requests all countries when the region is null', () => {
      api.getCountries.mockReturnValue(of([]));
      store.loadByContinent({ region: null, label: 'All countries' });
      expect(api.getCountries).toHaveBeenCalledWith(null);
    });

    it('ignores the response of a request that was replaced by a newer one', () => {
      const first = new Subject<Country[]>();
      const second = new Subject<Country[]>();
      api.getCountries.mockReturnValueOnce(first).mockReturnValueOnce(second);

      store.loadByContinent(EUROPE);
      store.loadByContinent(ASIA);
      // Новый ответ пришёл первым, старый — позже: он не должен его перезаписать
      second.next([country('New')]);
      first.next([country('Old')]);

      expect(store.countries().map((c) => c.names.common)).toEqual(['New']);
    });

    it('stores the error and retry() repeats the request for the same region', () => {
      api.getCountries.mockReturnValueOnce(throwError(() => new Error('boom')));
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      store.loadByContinent(EUROPE);
      expect(store.error()).toBe('boom');
      expect(store.loading()).toBe(false);

      api.getCountries.mockReturnValueOnce(of(countries(2)));
      store.retry();
      expect(api.getCountries).toHaveBeenCalledTimes(2);
      expect(api.getCountries).toHaveBeenLastCalledWith(Region.Europe);
      expect(store.error()).toBeNull();
      expect(store.count()).toBe(2);
    });

    it('retry() does nothing when no region was chosen', () => {
      store.retry();
      expect(api.getCountries).not.toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      api.getCountries.mockReturnValue(of(countries(65)));
      store.loadByContinent(EUROPE);
    });

    it('splits the list into pages of 30', () => {
      expect(store.count()).toBe(65);
      expect(store.totalPages()).toBe(3);
      expect(store.countries().length).toBe(30);

      store.setPage(3);
      expect(store.countries().length).toBe(5);
      expect(store.countries()[0].names.common).toBe('Country 61');
    });

    it('keeps the page inside the valid range', () => {
      store.setPage(99);
      expect(store.page()).toBe(3);
      store.setPage(-5);
      expect(store.page()).toBe(1);
    });

    it('goes back to the first page when another region is loaded', () => {
      store.setPage(2);
      store.loadByContinent(ASIA);
      expect(store.page()).toBe(1);
    });

    it('has one page for an empty list', () => {
      api.getCountries.mockReturnValue(of([]));
      store.loadByContinent(ASIA);
      expect(store.totalPages()).toBe(1);
      expect(store.countries()).toEqual([]);
    });
  });

  describe('opened country', () => {
    const france = country('France');
    const franceFull = { ...france, population: 1 } as Country;

    it('opens the card at once and loads the full data', () => {
      const response = new Subject<Country>();
      api.getByName.mockReturnValue(response);

      store.openCountry(france);
      expect(store.openedCountry()).toBe(france);
      expect(store.detailsLoading()).toBe(true);
      expect(store.details()).toBeNull();
      expect(api.getByName).toHaveBeenCalledWith('France');

      response.next(franceFull);
      expect(store.detailsLoading()).toBe(false);
      expect(store.details()).toBe(franceFull);
    });

    it('does not request an already opened country again', () => {
      api.getByName.mockReturnValue(of(franceFull));

      store.openCountry(france);
      store.closeCountry();
      store.openCountry(france);

      expect(api.getByName).toHaveBeenCalledTimes(1);
      expect(store.details()).toBe(franceFull);
    });

    it('closing cancels the pending request and clears the state', () => {
      const response = new Subject<Country>();
      api.getByName.mockReturnValue(response);

      store.openCountry(france);
      store.closeCountry();
      response.next(franceFull);

      expect(store.openedCountry()).toBeNull();
      expect(store.details()).toBeNull();
      expect(store.detailsLoading()).toBe(false);
    });

    it('closes the country when a region is chosen', () => {
      api.getByName.mockReturnValue(of(franceFull));
      api.getCountries.mockReturnValue(of([]));

      store.openCountry(france);
      store.loadByContinent(EUROPE);

      expect(store.openedCountry()).toBeNull();
    });

    it('reports an error and retryDetails() repeats the request', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      api.getByName.mockReturnValueOnce(throwError(() => new Error('boom')));

      store.openCountry(france);
      expect(store.detailsError()).toBe(true);
      expect(store.detailsLoading()).toBe(false);

      api.getByName.mockReturnValueOnce(of(franceFull));
      store.retryDetails();
      expect(store.detailsError()).toBe(false);
      expect(store.details()).toBe(franceFull);
    });
  });
});
