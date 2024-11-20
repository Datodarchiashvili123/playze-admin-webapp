import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../pages/user/user.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent implements OnInit {
  private _builder = inject(FormBuilder);
  private _userService = inject(UserService);
  userForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    public _dialog: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      fullName: string;
      email: string;
      roles?: string;
    }
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = this._builder.group({
      firstName: [
        this.data ? this.data.fullName.split(' ')[0] : '',
        [Validators.required],
      ],
      lastName: [
        this.data ? this.data.fullName.split(' ')[1] : '',
        [Validators.required],
      ],
      role: [this.data ? this.data.roles : 0, [Validators.required]],
      email: [this.data ? this.data.email : '', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.isLoading) return;
    if (!this.userForm.valid) return;

    const user = this.userForm.value;

    if (user.password !== user.confirmPassword) return;

    this.isLoading = true;

    const model = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: [parseInt(user.role)],
      password: user.password,
    };

    this._userService.addUser(model).subscribe(
      (result) => {
        this._dialog.close(true);
      },
      (error) => (this.isLoading = false)
    );
  }
}
