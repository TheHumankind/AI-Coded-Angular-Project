import { Component, signal } from '@angular/core';
import { Content } from './components/content/content';
import { Header } from './components/header/header';

@Component({
  imports: [Header, Content],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('app');
}

