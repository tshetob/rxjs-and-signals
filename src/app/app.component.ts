import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RxjsDemoApp } from './rxjs-mapping-op.component';

@Component({
  standalone: true,
  imports: [ RouterModule, RxjsDemoApp],
  selector: 'rxjs-and-signals-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'rxjs-and-signals-app';
}
