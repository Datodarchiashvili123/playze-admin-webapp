import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgOptimizedImage, NgForOf, NgIf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalPages: number = 10;
  @Input() currentPage: number = 1;
  @Input() hasNext: boolean = false;
  @Input() hasPrevious: boolean = false;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>(); // Ensure this is properly initialized

  prevPage: number = 1;
  nextPage: number = 1;
  pages: number[] = [];
  showDots: boolean = false;

  ngOnInit() {
    this.updatePages();
    this.generatePages();
  }
  ngOnChanges() {
    this.updatePages();
    this.generatePages();
  }

  updatePages() {
    this.prevPage = this.currentPage - 1;
    this.nextPage = this.currentPage + 1;
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.generatePages();

      this.pageChange.emit(this.currentPage);
    }
  }

  prev() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.generatePages();
      this.pageChange.emit(this.currentPage);
    }
  }

  generatePages() {
    // Generate pages based on currentPage and totalPages
    this.pages = [];

    if (this.totalPages <= 7) {
      // Show all pages if total pages are less than or equal to 7
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      // Show limited pages with dots if total pages exceed 7
      if (this.currentPage <= 4) {
        this.pages = [1, 2, 3, 4, 5, this.totalPages];
        this.showDots = true;
      } else if (this.currentPage >= this.totalPages - 3) {
        this.pages = [
          1,
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
        this.showDots = true;
      } else {
        this.pages = [
          1,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.totalPages,
        ];
        this.showDots = true;
      }
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      this.generatePages();
    }
  }
}
