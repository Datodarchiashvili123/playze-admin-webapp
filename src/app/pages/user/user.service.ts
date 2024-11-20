import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { UserItemModel } from '../../shared/models/user-item.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _httpService = inject(HttpService);

  users = signal<UserItemModel[]>([]);

  getUsers(filter: string, pageNumber: number, pageSize: number) {
    return this._httpService.get(
      `/users?PageNumber=${pageNumber}&PageSize=${pageSize}&Filter=${filter}`
    );
  }

  deleteUser(id: string) {
    return this._httpService.delete(`/users/${id}`);
  }

  addUser(model: any) {
    return this._httpService.post('/users', model);
  }
}
