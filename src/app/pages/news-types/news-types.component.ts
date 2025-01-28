import { Component, inject, OnInit } from '@angular/core';
import { NewsTypesService } from './news-types.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { KeyValuePairModel } from '../../shared/models/key-value-pair.model';
import { NewsTypesDialogComponent } from '../../shared/dialogs/news-types-dialog/news-types-dialog.component';
import { DeleteNewsTypeComponent } from '../../shared/dialogs/delete-news-type/delete-news-type.component';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AnnouncementTypeModel } from '../../shared/models/announcement-type.model';

@Component({
  selector: 'app-news-types',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './news-types.component.html',
  styleUrl: './news-types.component.scss',
})
export class NewsTypesComponent implements OnInit {
  public newsTypesService = inject(NewsTypesService);
  private _dialog = inject(MatDialog);
  filterText: string = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.initTypes();
  }

  onSearchChange(event: Event) {
    this.initTypes();
  }

  initTypes() {
    this.newsTypesService.getNewsTypes(this.filterText).subscribe((result) => {
      const types = result.parameters[result.key] as AnnouncementTypeModel[];
      this.newsTypesService.newsTypes.set(types);
    });
  }

  openEditDialog(type: AnnouncementTypeModel | null) {
    const dialog = this._dialog.open(NewsTypesDialogComponent, { disableClose: true, data: type });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.initTypes();
      }
    });
  }

  openDeleteTypeDialog(type: KeyValuePairModel) {
    const dialog = this._dialog.open(DeleteNewsTypeComponent, {
      data: type.name,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.newsTypesService.deleteNewsType(type.id).subscribe(() => {
          this.initTypes();
        });
      }
    });
  }
}
