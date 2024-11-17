import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-news-type',
  standalone: true,
  imports: [],
  templateUrl: './delete-news-type.component.html',
  styleUrl: './delete-news-type.component.scss',
})
export class DeleteNewsTypeComponent {
  constructor(
    public _dialog: MatDialogRef<DeleteNewsTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
