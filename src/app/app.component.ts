import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RxjsDemoApp } from './rxjs-mapping-op.component';
import { SomeOrderingSystem } from './some-ordering-system.component';

@Component({
  standalone: true,
  imports: [ RouterModule, RxjsDemoApp, SomeOrderingSystem],
  selector: 'rxjs-and-signals-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'rxjs-and-signals-app';
}
