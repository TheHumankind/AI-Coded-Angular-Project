import { Region } from './region';

export interface Continent {
  /** null — все страны без фильтра по региону */
  region: Region | null;
  label: string;
}

export const ALL_COUNTRIES: Continent = { region: null, label: 'All countries' };

export const CONTINENTS: Continent[] = [
  { region: Region.Africa, label: 'Africa' },
  { region: Region.Americas, label: 'Americas' },
  { region: Region.Asia, label: 'Asia' },
  { region: Region.Europe, label: 'Europe' },
  { region: Region.Oceania, label: 'Oceania' },
  { region: Region.Antarctic, label: 'Antarctic' },
];
