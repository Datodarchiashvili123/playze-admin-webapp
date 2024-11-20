import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagedListModel } from '../../shared/models/paged-list.model';
import { UserItemModel } from '../../shared/models/user-item.model';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { DeleteNewsTypeComponent } from '../../shared/dialogs/delete-news-type/delete-news-type.component';
import { UserDialogComponent } from '../../shared/dialogs/user-dialog/user-dialog.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  public userService = inject(UserService);
  private _dialog = inject(MatDialog);
  filterText: string = '';
  pageSize = 5;
  pageNumber = 1;
  totalPages = 0;
  hasNext: boolean = false;
  hasPrev: boolean = false;

  ngOnInit() {
    this.initUsers();
  }

  onSearchChange(event: Event) {
    this.initUsers();
  }

  initUsers() {
    this.userService
      .getUsers(this.filterText, this.pageNumber, this.pageSize)
      .subscribe((result: any) => {
        const list = result.parameters[
          result.key
        ] as PagedListModel<UserItemModel>;

        this.totalPages = list.totalPages;
        this.userService.users.set(list.results);

        this.hasNext = list.hasNext;
        this.hasPrev = list.hasPrevious;
      });
  }

  openEditDialog(user: UserItemModel | null) {
    const dialog = this._dialog.open(UserDialogComponent, { data: user });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.initUsers();
      }
    });
  }

  openDeleteTypeDialog(user: UserItemModel) {
    const dialog = this._dialog.open(DeleteNewsTypeComponent, {
      data: user.fullName,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.initUsers();
        });
      }
    });
  }

  onPageChange(newPage: number) {
    this.pageNumber = newPage;
    this.initUsers();
  }
}
