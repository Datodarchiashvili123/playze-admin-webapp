import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  NavigationModel,
  NavigationService,
} from '../../../core/services/navigation.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sidebarState', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-150%)',
        })
      ),
      transition('open <=> closed', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class SidebarComponent {
  public navigation$ = this.navigationService.navigation;
  public selectedItem$ = this.navigationService.selectedItem;
  @Input() isOpen = true;

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  onSelectItem(item: NavigationModel, event: Event) {
    event.stopPropagation();
    this.navigationService.selectItem(item);

    if (item.navigate) {
      this.router.navigate([item.navigate]);
    }
  }
}
