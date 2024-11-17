import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthModel } from '../../core/models/auth.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private _authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private _builder: FormBuilder, private _router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this._builder.group({
      email: this._builder.control(``, Validators.required),
      password: this._builder.control(``, Validators.required),
    });
  }

  proceedLogin() {
    this.isLoading = !this.isLoading;
    const model: AuthModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this._authService.authorize(model).subscribe(
      (response) => {
        this._router.navigate(['/dashboard']);
        this.isLoading = !this.isLoading;
      },
      (error) => {
        this.isLoading = !this.isLoading;
        this.cdr.markForCheck();
        this.loginForm.reset();
      }
    );
  }
}
