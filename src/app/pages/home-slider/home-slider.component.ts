import { Component, OnInit, inject } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddSliderImageComponent } from '../../shared/dialogs/add-slider-image/add-slider-image.component';
import { SliderImage, SliderService } from '../../core/services/slider.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.scss',
})
export class HomeSliderComponent implements OnInit {
  private _dialog = inject(MatDialog);
  private _sliderService = inject(SliderService);
  protected environment = environment;
  ngOnInit(): void {
    this.loadSliderImages();
  }

  loadSliderImages(): void {
    this._sliderService.initSliderImages().subscribe();
  }

  get sliderImages(): SliderImage[] {
    return this._sliderService.pagedList().results;
  }

  get isLoading(): boolean {
    return this._sliderService.isLoading();
  }

  openDialog(): void {
    const dialog = this._dialog.open(AddSliderImageComponent, { data: null });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSliderImages();
      }
    });
  }


  drop(event: CdkDragDrop<SliderImage[]>): void {
    const movedItemId = this.sliderImages[event.previousIndex].id;
    moveItemInArray(this.sliderImages, event.previousIndex, event.currentIndex);
    const apiIndex = event.currentIndex + 1;
  
    this._sliderService
      .updateSliderOrder(movedItemId, apiIndex)
      .subscribe({
        next: () => {
          // Refresh the list to get the new order from the server
          this.loadSliderImages();
        },
        error: (err) => {
          console.error('Failed to update slider order', err);
          // Refresh anyway to reset to server state
          this.loadSliderImages();
        },
      });
  }

  toggleVisibility(id: string, currentVisibility: boolean): void {
    this._sliderService.toggleVisibility(id, !currentVisibility).subscribe({
      next: () => {
        this.loadSliderImages();
      },
      error: (err) => {
        console.error('Failed to toggle visibility', err);
      },
    });
  }

  editImage(image: SliderImage): void {
    const dialog = this._dialog.open(AddSliderImageComponent, {
      data: image.id,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSliderImages();
      }
    });
  }

  deleteImage(id: string): void {
    this._sliderService.deleteSliderImage(id).subscribe({
      next: () => {
        this.loadSliderImages();
      },
      error: (err) => {
        console.error('Failed to delete image', err);
      },
    });
  }
}
