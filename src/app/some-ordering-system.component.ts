import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="font-black text-2xl">Let's learn about Signals</h1>
    <a
      class="text-center text-blue-700 font-normal hover:font-bold"
      target="_blank"
      href="https://angular.io/guide/signals"
    >
      Learn more about Signals </a
    ><br /><br />

    Salutations: {{ message() }} <br />

    <div style="display: flex; gap: 20px;">
      <div style="order: 3">
        <h2 class="font-medium">Breakfast Menu</h2>
        <div *ngFor="let item of itemAndCostDisplay | keyvalue" style="margin: 10px 0px;">
          <button
            (click)="selectItem(item.key)"
          >
            Select {{ item.key }} {{ item.value | currency }}
          </button>
        </div>
      </div>

      <div style="order: 3">
        <h2 class="font-medium">Payment</h2>
        <div
        >
          <div>Subtotal: {{ selectedItemsTotalCost() | currency }}</div>
          <div>Tax ({{ cityTax }}%): {{ selectedTax() | currency }}</div>
          <div>Total: {{ finalCost() | currency }}</div>
        </div>
      </div>
      <div *ngIf="selectedItems().length > 0" style="order: 5">
        <h2 class="font-medium">Order</h2>

        <button
          (click)="resetOrder()"
        >
          Reset Order
        </button>

        <div *ngFor="let selectedItem of selectedItems(); let i = index" style="margin: 10px 0px;">
          {{ selectedItem }}
          <button
            (click)="removeItem(i)"
          >
            X
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SomeOrderingSystem implements OnInit {
  readonly cityTax = 7.5;

  itemAndCostDisplay = itemAndCost;
  selectedItems = signal<BreakfastItem[]>([]);
  message = signal('Welcome!');

  selectedItemsTotalCost = computed<number>(() =>
    this.selectedItems()
      .map((x) => itemAndCost.get(x) ?? 0)
      .reduce((total, current) => current + total, 0)
  );

  selectedTax = computed<number>(
    () => (this.selectedItemsTotalCost() * this.cityTax) / 100
  );

  finalCost = computed<number>(
    () => this.selectedItemsTotalCost() + this.selectedTax()
  );

  constructor() {
    effect(() => {
      this.selectedItems().length > 5
        ? console.warn(
            'LOG: User has selected a bit too much',
            this.selectedItems().join(',')
          )
        : console.info(
            'LOG: User has selected ',
            this.selectedItems().join(',')
          );
    });
  }

  ngOnInit(): void {
    this._setDailyMenu();
  }

  selectItem(item: BreakfastItem): void {
    this.selectedItems.mutate((list) => list.push(item));
  }

  removeItem(i: number): void {
    this.selectedItems.mutate((list) => list.splice(i, 1));
  }

  resetOrder(): void {
    this.selectedItems.update(() => []);
  }

  private _setDailyMenu = (maxPrice = 11, minPrice = 3) =>
    Object.values(BreakfastItem).forEach((item) => {
      const cost = Math.floor(Math.random() * (maxPrice - minPrice) + minPrice);
      itemAndCost.set(item, cost);
    });
}

// Constants / Uitls / Models //
export enum BreakfastItem {
  tea = 'Tea',
  egg = 'Egg',
  coffee = 'Coffee',
  bread = 'Bread',
  jam = 'Jam',
  butter = 'Butter',
  scone = 'Scone',
  clottedCream = 'Clotted Cream',
  croissant = 'Croissant',
}

export const itemAndCost = new Map<BreakfastItem, number>();
