import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { KeyValuePairModel } from '../../shared/models/key-value-pair.model';
import { AnnouncementTypeModel } from '../../shared/models/announcement-type.model';

@Injectable({
  providedIn: 'root',
})
export class NewsTypesService {
  private _httpService = inject(HttpService);

  newsTypes = signal<AnnouncementTypeModel[]>([]);

  getNewsTypes(name: string) {
    return this._httpService.get(`/announcements/types?name=${name}`);
  }

  createNewsType(name: string, color: string) {
    return this._httpService.post(`/announcements/type`, {
      name: name,
      color: color,
    });
  }

  updateNewsType(body: KeyValuePairModel) {
    return this._httpService.put(`/announcements/type`, body);
  }

  deleteNewsType(id: string) {
    return this._httpService.delete(`/announcements/type/${id}`);
  }
}
