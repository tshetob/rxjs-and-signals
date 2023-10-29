import { Route } from '@angular/router';
import { RxjsDemoApp } from './rxjs-mapping-op.component';
import { SomeOrderingSystem } from './some-ordering-system.component';

export const appRoutes: Route[] = [
    {
        path: 'rxjs-mapping-op',
        component: RxjsDemoApp
    },
    {
        path: 'ordering-system',
        component: SomeOrderingSystem
    }
];
