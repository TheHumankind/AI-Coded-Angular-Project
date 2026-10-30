import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { App } from './app';
import { Country } from './models/country';
import { CountryApi } from './services/country-api';

// Страна с теми полями, которые читают карточка и страница страны
function fakeCountry(name: string): Country {
  return {
    uuid: name,
    names: { common: name },
    codes: { alpha_2: 'XX', alpha_3: 'XXX' },
    flag: { url_svg: '' },
    descriptions: { short: `${name} short`, long: `${name} long description` },
    capitals: [{ name: `${name} City` }],
    languages: [{ name: 'English' }],
    calling_codes: ['1'],
    area: { kilometers: 1000 },
    population: 5000,
    links: { google_maps: '', official: '', open_street_maps: '', wikipedia: '' },
    timezones: ['UTC+01:00'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    continents: ['Europe'],
    subregion: 'Western Europe',
    economy: { gini_coefficient: {} },
    memberships: { un: true, eu: false },
  } as unknown as Country;
}

describe('App', () => {
  const api = {
    getCountries: vi.fn(() => of([fakeCountry('Alpha'), fakeCountry('Beta')])),
    getByName: vi.fn((name: string) => of(fakeCountry(name))),
  };

  function render() {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: CountryApi, useValue: api }],
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      root,
      click: (selector: string, text?: string) => {
        const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
        const target = text ? elements.find((e) => e.textContent!.includes(text)) : elements[0];
        target!.click();
        fixture.detectChanges();
      },
    };
  }

  it('asks to select a region at the start', () => {
    const { root } = render();
    expect(root.querySelector('.content__placeholder')?.textContent).toContain('Select a region');
    expect(root.querySelectorAll('app-country-card').length).toBe(0);
  });

  it('shows cards and pagination after a region is chosen', () => {
    const { root, click } = render();
    click('.header__nav button', 'Europe');

    expect(root.querySelector('.content__placeholder')).toBeNull();
    expect(root.querySelectorAll('app-country-card').length).toBe(2);
    // регион из двух стран — одна страница, кнопок страниц нет
    expect(root.querySelectorAll('app-country-pagination .button').length).toBe(0);
  });

  it('opens a country from its card and returns with the Back button', () => {
    const { root, click } = render();
    click('.header__nav button', 'Europe');

    click('app-country-card article');
    expect(root.querySelector('app-country-overview')).not.toBeNull();
    expect(root.querySelector('app-country-board')).toBeNull();
    expect(root.querySelector('.country-overview__title')?.textContent).toContain('Alpha');
    expect(root.querySelector('.country-overview__text')?.textContent).toContain(
      'Alpha long description',
    );

    click('app-country-overview .button', 'Back');
    expect(root.querySelector('app-country-overview')).toBeNull();
    expect(root.querySelectorAll('app-country-card').length).toBe(2);
  });
});
