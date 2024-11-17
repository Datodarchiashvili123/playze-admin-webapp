import { Injectable, signal, computed, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface NavigationModel {
  icon: string;
  name: string;
  navigate: string;
  selected: boolean;
  hasSelectedChild?: boolean;
  children: NavigationModel[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation = signal<NavigationModel[]>([
    {
      icon: 'dashboard-icon',
      name: 'Dashboard',
      navigate: '/dashboard/user',
      selected: true,
      children: [],
    },
    {
      icon: 'news-icon',
      name: 'News',
      navigate: '',
      selected: false,
      children: [
        {
          icon: '',
          name: 'Announcements',
          navigate: '/dashboard/announcement',
          selected: false,
          children: [],
        },
        {
          icon: '',
          name: 'Types',
          navigate: '/dashboard/news-types',
          selected: false,
          children: [],
        },
      ],
    },
  ]);

  public readonly navigation = this._navigation.asReadonly();

  private _selectedItem = signal<NavigationModel | null>(this._navigation()[0]);

  public selectedItem: Signal<NavigationModel | null> = computed(() =>
    this._selectedItem()
  );

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSelectionBasedOnRoute();
      });

    this.updateSelectionBasedOnRoute();
  }

  private updateSelectionBasedOnRoute() {
    const currentRoute = this.router.url;

    this._navigation().forEach((navItem) => {
      navItem.selected = false;
      navItem.hasSelectedChild = false;
      this.resetSelection(navItem.children);
    });

    this._navigation().forEach((navItem) => {
      if (navItem.navigate === currentRoute) {
        navItem.selected = true;
        this._selectedItem.set(navItem);
      } else if (navItem.children.length > 0) {
        const selectedChild = navItem.children.find(
          (child) => child.navigate === currentRoute
        );
        if (selectedChild) {
          navItem.selected = true;
          navItem.hasSelectedChild = true;
          selectedChild.selected = true;
          this._selectedItem.set(selectedChild);
        }
      }
    });
    this._navigation.set(this._navigation());
  }

  selectItem(item: NavigationModel) {
    if (item.children.length === 0) {
      const parent = this.findParent(this._navigation(), item);
      this._navigation().forEach((navItem) => {
        if (navItem !== parent) {
          navItem.selected = false;
          navItem.hasSelectedChild = false;
          this.resetSelection(navItem.children);
        }
      });
      if (parent) {
        this.resetSelection(parent.children);
        parent.hasSelectedChild = true;
      }
      item.selected = true;
      this._selectedItem.set(item);
    } else {
      this._navigation().forEach((navItem) => {
        if (navItem !== item) {
          navItem.selected = false;
          navItem.hasSelectedChild = false;
          this.resetSelection(navItem.children);
        }
      });
      item.selected = !item.selected;
    }
    this._navigation.set(this._navigation());
    if (item.navigate) {
      this.router.navigate([item.navigate]);
    }
  }

  private findParent(
    items: NavigationModel[],
    target: NavigationModel
  ): NavigationModel | null {
    for (const item of items) {
      if (item.children.includes(target)) {
        return item;
      } else if (item.children.length > 0) {
        const parent = this.findParent(item.children, target);
        if (parent) return parent;
      }
    }
    return null;
  }

  private resetSelection(items: NavigationModel[]) {
    for (const item of items) {
      item.selected = false;
      item.hasSelectedChild = false;
      if (item.children.length > 0) {
        this.resetSelection(item.children);
      }
    }
  }
}
