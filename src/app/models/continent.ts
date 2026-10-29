import { Region } from './region';

export interface Continent {
  region: Region;
  label: string;
}

export const CONTINENTS: Continent[] = [
  { region: Region.Africa, label: 'Africa' },
  { region: Region.Americas, label: 'Americas' },
  { region: Region.Asia, label: 'Asia' },
  { region: Region.Europe, label: 'Europe' },
  { region: Region.Oceania, label: 'Oceania' },
  { region: Region.Antarctic, label: 'Antarctic' },
];
