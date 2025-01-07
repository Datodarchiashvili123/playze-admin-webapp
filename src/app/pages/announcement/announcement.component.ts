import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { MatDialog } from '@angular/material/dialog';
import { AddNewsAnnComponent } from '../../shared/dialogs/add-news-ann/add-news-ann.component';
import { AnnouncementService } from './announcement.service';
import { AnnouncementItemModel } from '../../shared/models/announcement-item.model';
import { PagedListModel } from '../../shared/models/paged-list.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [PaginationComponent, NewsCardComponent, CommonModule, FormsModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent implements OnInit {
  pageSize = 5;
  pageNumber = 1;
  totalPages = 0;
  filterText = '';
  pagedList: PagedListModel<AnnouncementItemModel> | null = null;
  news: AnnouncementItemModel[] = [];
  imageDomain = environment.bucket;
  hasNext: boolean = false;
  hasPrev: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private _announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this._announcementService
      .getNews(this.filterText, this.pageNumber, this.pageSize)
      .subscribe((result: any) => {
        this.pagedList = result.parameters[
          result.key
        ] as PagedListModel<AnnouncementItemModel>;

        this.totalPages = this.pagedList.totalPages;
        this.news = this.pagedList.results;

        this.hasNext = this.pagedList.hasNext;
        this.hasPrev = this.pagedList.hasPrevious;
      });
  }

  onNewsEdit(newsId: string) {
    this.loadNews();
  }

  onNewsDeleted(newsId: string) {
    this.loadNews();
  }

  onPageChange(newPage: number) {
    this.pageNumber = newPage;
    this.loadNews();
  }

  addNewsDialog() {
    const dialog = this._dialog.open(AddNewsAnnComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loadNews();
      }
    });
  }
}
