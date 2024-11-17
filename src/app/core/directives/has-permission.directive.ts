import {
  Directive,
  effect,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true,
})
export class HasPermissionDirective<T = unknown> {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<T>);
  private viewContainer = inject(ViewContainerRef);
  private permission = signal<string>('');
  private hasView = signal<boolean>(false);

  @Input({ required: true }) set ifHasPermission(permission: string) {
    this.permission.set(permission);
  }

  constructor() {
    this.setupEffect();
  }

  private setupEffect() {
    effect(
      () => {
        const permissionValue = this.permission();

        if (!permissionValue) {
          if (this.hasView()) {
            this.viewContainer.clear();
            this.hasView.set(false);
          }
          return;
        }

        const hasPermission = this.authService.hasPermission(permissionValue);

        if (hasPermission && !this.hasView()) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView.set(true);
        } else if (!hasPermission && this.hasView()) {
          this.viewContainer.clear();
          this.hasView.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
