import {
  Directive,
  effect,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[ifHasOnePermission]',
  standalone: true,
})
export class HasOnePermissionDirective<T = unknown> {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<T>);
  private viewContainer = inject(ViewContainerRef);
  private permissions = signal<string[]>([]);
  private hasView = signal<boolean>(false);

  @Input({ required: true }) set ifHasOnePermission(permissions: string[]) {
    this.permissions.set(permissions);
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    this.setupEffect();
  }

  private setupEffect() {
    effect(
      () => {
        const permissions = this.permissions();

        if (!permissions) {
          if (this.hasView()) {
            this.viewContainer.clear();
            this.hasView.set(false);
          }
        } else {
          let hasOnePermission = false;

          for (let index = 0; index < permissions.length; index++) {
            const hasPermission = this.authService.hasPermission(
              permissions[index]
            );
            if (hasPermission) {
              hasOnePermission = true;
              break;
            }
          }

          if (hasOnePermission && !this.hasView()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView.set(true);
          } else if (!hasOnePermission && this.hasView()) {
            this.viewContainer.clear();
            this.hasView.set(false);
          }
        }

        this.changeDetector.detectChanges();
      },
      { allowSignalWrites: true }
    );
  }
}
