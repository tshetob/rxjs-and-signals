import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  concatMap,
  delay,
  EMPTY,
  exhaustMap,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'my-rxjs-demo-app',
  standalone: true,
  styles: ['.triggerBlock {>button{margin: 5px 0px; white-space: pre-line;}}'],
  imports: [CommonModule],
  template: `
  <h1>Combination Operators</h1>
  <h2>
    Learn more about <a target="_blank" href="https://rxjs.dev/guide/overview">RxJs</a>
  </h2>
  

    <button (click)="onClickReset()">Reset</button><br />
  
    <h3>No. of clicks: <span [ngStyle]="{color: 'green'}">{{counter()}}</span></h3>

  <div class="triggerBlock">
    <span [ngStyle]="{weight: 5}">Click to trigger requests</span><br/>
    <button (click)="onClick('concatMap')">concatMap</button><br />
    <button (click)="onClick('mergeMap')">mergeMap</button><br />
    <button (click)="onClick('switchMap')">switchMap</button><br />
    <button (click)="onClick('exhaustMap')">exhaustMap</button><br />
  </div>
  
  <hr />
  <div *ngIf="mergedObservableStreams$ | async as emission">
    <h3>Latest emitted value: <span [ngStyle]="{color: 'green'}">{{emission}}</span></h3>
  
    <h3>Stack:</h3>
    <div [ngStyle]="{color: z.status === 'inprogress' ? 'grey' : 'blue'}" *ngFor="let z of displayStack()">{{z.request +
      (z.status === 'inprogress' ? '...' : ' complete')}}</div>
  </div> 
  `,
})
export class RxjsDemoApp {
  private readonly _intervalTime = 1000; // In ms

  private _observableExhaustStack$ = new BehaviorSubject<string>('');
  private _observableSwitchStack$ = new BehaviorSubject<string>('');
  private _observableConcatStack$ = new BehaviorSubject<string>('');
  private _observableMergeStack$ = new BehaviorSubject<string>('');
  private _resetObservable$ = new Subject();

  private _exhaustMapStack$ = this._observableExhaustStack$
    .asObservable()
    .pipe(exhaustMap((x) => this._trigger$(x) ?? EMPTY));

  private _switchMapStack$ = this._observableSwitchStack$
    .asObservable()
    .pipe(switchMap((x) => this._trigger$(x) ?? EMPTY));

  private _concatMapStack$ = this._observableConcatStack$
    .asObservable()
    .pipe(concatMap((x) => this._trigger$(x) ?? EMPTY));

  private _mergeMapStack$ = this._observableMergeStack$
    .asObservable()
    .pipe(mergeMap((x) => this._trigger$(x) ?? EMPTY));

  private _resetObservableStream$ = this._resetObservable$
    .asObservable()
    .pipe(map(() => ' '));

  mergedObservableStreams$ = merge(
    this._exhaustMapStack$,
    this._concatMapStack$,
    this._switchMapStack$,
    this._mergeMapStack$,
    this._resetObservableStream$
  );

  counter = signal<number>(0);
  displayStack = signal<StackType[]>([]);

  onClick(mappingStrategy: MappingStrategyStatus): void {
    this.counter.update((y) => ++y);
    const emission = `request-${this.counter()}`;

    switch (mappingStrategy) {
      case 'exhaustMap':
        this._observableExhaustStack$.next(emission);
        break;
      case 'switchMap':
        this._observableSwitchStack$.next(emission);
        break;
      case 'concatMap':
        this._observableConcatStack$.next(emission);
        break;
      case 'mergeMap':
        this._observableMergeStack$.next(emission);
        break;
    }
  }

  onClickReset(): void {
    this.counter.set(0);
    this.displayStack.set([]);
    this._resetObservable$.next(true);
  }

  private _trigger$ = (request: string): Observable<string> | undefined => {
    if (!request) {
      return;
    }

    return of(true).pipe(
      tap(() => console.log(`Request${request} is in progress.`)),
      tap(() =>
        this.displayStack.mutate((z) =>
          z.unshift({
            request,
            status: 'inprogress',
          })
        )
      ),
      delay(this._intervalTime),
      tap(() => console.log(`Request${request} is complete.`)),
      tap(() =>
        this.displayStack.mutate((z) =>
          z.unshift({
            request,
            status: 'complete',
          })
        )
      ),
      map(() => request)
    );
  };
}

export type MappingStrategyStatus =
  | 'exhaustMap'
  | 'switchMap'
  | 'concatMap'
  | 'mergeMap';
export type RequestStatus = 'inprogress' | 'complete';
export interface StackType {
  request: string;
  status: RequestStatus;
}