import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ALL_COUNTRIES, CONTINENTS } from '../../models/continent';
import { CountryStore } from '../../services/country-store';
import { Header } from './header';

describe('Header', () => {
  const store = { loadByContinent: vi.fn() };

  function render() {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: CountryStore, useValue: store }],
    });
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      burger: root.querySelector<HTMLButtonElement>('.header__burger')!,
      nav: root.querySelector<HTMLElement>('.header__nav')!,
      items: () => Array.from(root.querySelectorAll<HTMLButtonElement>('.header__nav button')),
    };
  }

  beforeEach(() => store.loadByContinent.mockReset());

  it('shows a button for every region plus "All countries"', () => {
    const { items } = render();
    expect(items().map((b) => b.textContent!.trim())).toEqual(
      [...CONTINENTS, ALL_COUNTRIES].map((c) => c.label),
    );
  });

  it('opens and closes the menu with the burger button', () => {
    const { fixture, burger, nav } = render();
    expect(nav.classList).not.toContain('header__nav--open');
    expect(burger.getAttribute('aria-expanded')).toBe('false');

    burger.click();
    fixture.detectChanges();
    expect(nav.classList).toContain('header__nav--open');
    expect(burger.getAttribute('aria-expanded')).toBe('true');

    burger.click();
    fixture.detectChanges();
    expect(nav.classList).not.toContain('header__nav--open');
  });

  it('loads the region and closes the menu after a pick', () => {
    const { fixture, burger, nav, items } = render();
    burger.click();
    fixture.detectChanges();

    items()[3].click();
    fixture.detectChanges();

    expect(store.loadByContinent).toHaveBeenCalledWith(CONTINENTS[3]);
    expect(nav.classList).not.toContain('header__nav--open');
  });

  it('keeps the menu closed after a pick even when it was not opened (desktop)', () => {
    const { fixture, nav, items } = render();
    items()[0].click();
    items()[1].click();
    fixture.detectChanges();
    expect(nav.classList).not.toContain('header__nav--open');
  });
});
