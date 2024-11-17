import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsTypesService } from '../../../pages/news-types/news-types.service';
import { AnnouncementTypeModel } from '../../models/announcement-type.model';

@Component({
  selector: 'app-news-types-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-types-dialog.component.html',
  styleUrl: './news-types-dialog.component.scss',
})
export class NewsTypesDialogComponent {
  type: string = '';
  isEdited: boolean = false;
  color: string = '';

  constructor(
    public _dialog: MatDialogRef<NewsTypesDialogComponent>,
    private newsTypeService: NewsTypesService,
    @Inject(MAT_DIALOG_DATA) public data: AnnouncementTypeModel | null
  ) {
    if (data) {
      this.type = data.name;
      this.color = data.color;
      this.isEdited = true;
    }
  }

  submitType() {
    if (this.isEdited) {
      this.data!.name = this.type;
      this.data!.color = this.color;
      this.newsTypeService.updateNewsType(this.data!).subscribe((result) => {
        this._dialog.close(true);
      });
    } else {
      this.newsTypeService
        .createNewsType(this.type, this.color)
        .subscribe((result) => {
          this._dialog.close(true);
        });
    }
  }
}
