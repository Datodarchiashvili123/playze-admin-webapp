import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SliderService } from '../../../core/services/slider.service';

@Component({
  selector: 'app-add-slider-image',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-slider-image.component.html',
  styleUrl: './add-slider-image.component.scss'
})
export class AddSliderImageComponent implements OnInit{
  private _dialogRef: MatDialogRef<AddSliderImageComponent> = inject(MatDialogRef);
  private readonly data: string = inject(MAT_DIALOG_DATA);
  private fb: FormBuilder = inject(FormBuilder);
  private sliderService: SliderService = inject(SliderService);
  
  isEdited: boolean = false;
  sliderForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    if(this.data) {
      this.isEdited = true;
    }
    this.initForm();
  }

  initForm() {
    this.sliderForm = this.fb.group({
      redirectUrl: ['', Validators.required],
      image: [null]
    });
  }
  
  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length) {
      this.selectedFile = element.files[0];
      this.sliderForm.patchValue({
        image: this.selectedFile
      });
    }
  }
  
  submitImage(): void {
    if (this.sliderForm.invalid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    const formData = new FormData();
    const redirectUrl = this.sliderForm.get('redirectUrl')?.value;
    formData.append('redirectUrl', redirectUrl);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    
    const request = this.isEdited && this.data
      ? this.sliderService.updateRedirectUrl(this.data, redirectUrl)
      : this.sliderService.addSliderImage(formData);
    
    request.subscribe({
      next: () => {
        this._dialogRef.close(true);
      },
      error: (error) => {
        console.error(`Error ${this.isEdited ? 'updating' : 'uploading'} slider image:`, error);
        this.isSubmitting = false;
      }
    });
  }
}