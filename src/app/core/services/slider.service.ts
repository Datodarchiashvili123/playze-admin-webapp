import { Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, tap } from 'rxjs';

export interface SliderImage {
  id: string;
  url: string;
  visible?: boolean;
  redirectUrl?: string;
}

export interface PagedList {
  results: SliderImage[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  public pageSize = signal<number>(10);
  public pageNumber = signal<number>(1);
  public pagedList = signal<PagedList>({
    results: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    hasPrevious: false,
    hasNext: false
  });
  public isLoading = signal<boolean>(false);
  
  constructor(private http: HttpService) {}

  initSliderImages() {
    this.isLoading.set(true);
    return this.http
      .get(
        `/boards?Page=${this.pageNumber()}&PageSize=${this.pageSize()}`
      )
      .pipe(
        tap((response) => {
          this.pagedList.set(response.parameters.pagedList);
          this.isLoading.set(false);
        })
      );
  }

  addSliderImage(formData: FormData): Observable<any> {
    return this.http.post('/boards', formData);
  }

  updateSliderOrder(id: string, order: number): Observable<any> {
    return this.http.post('/boards/reorder', {id, order});
  }

  toggleVisibility(id: string, status: boolean): Observable<any> {
    return this.http.post(`/boards/visibility`, { id, status });
  }

  deleteSliderImage(id: string): Observable<any> {
    return this.http.delete(`/boards/${id}`);
  }

  updateRedirectUrl(id: string, redirectUrl: string): Observable<any> {
    return this.http.post('/boards/redirect', {id, redirectUrl});
  }
}
