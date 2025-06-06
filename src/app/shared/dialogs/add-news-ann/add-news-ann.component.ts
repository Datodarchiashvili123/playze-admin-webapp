import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { NewsTypesService } from '../../../pages/news-types/news-types.service';
import { KeyValuePairModel } from '../../models/key-value-pair.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlEditorComponent } from '../../components/pl-editor/pl-editor.component';
import { AnnouncementService } from '../../../pages/announcement/announcement.service';
import { AnnouncementTypeModel } from '../../models/announcement-type.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-news-ann',
  standalone: true,
  imports: [CommonModule, FormsModule, PlEditorComponent, ReactiveFormsModule],
  templateUrl: './add-news-ann.component.html',
  styleUrl: './add-news-ann.component.scss',
})
export class AddNewsAnnComponent implements OnInit {
  public newsTypesService = inject(NewsTypesService);
  public announcementService = inject(AnnouncementService);
  private _builder = inject(FormBuilder);
  formHeader = '';
  title: string = '';
  subtitle: string = '';
  category!: AnnouncementTypeModel;

  constructor(
    public _dialog: MatDialogRef<AddNewsAnnComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      title: string;
      subtitle: string;
      category: AnnouncementTypeModel;
      contentHtml?: string;
      relatedGames?: number[];
      imageUrl?: string;
      metaTitle?: string;
      metaDescription?: string;
    }
  ) {}

  newsForm!: FormGroup;

  isLoading: boolean = false;
  filterText: string = '';
  selectedImage: string | null = null;
  imageFile: any;
  isPublic: boolean = false;
  toggle: boolean = false;
  games: KeyValuePairModel[] = [];
  selectedGames: KeyValuePairModel[] = [];
  editorContent: string = '';

  // Error handling properties
  backendError: string = '';
  fieldErrors: { [key: string]: string } = {};
  showValidationErrors: boolean = false;

  ngOnInit() {
    this.initTypes();
    this.initGames();
    this.initForm();
  }

  initForm() {
    this.newsForm = this._builder.group({
      headline: [this.title, [Validators.required, Validators.maxLength(300)]],
      primaryKeyword: [
        this.subtitle,
        [Validators.required, Validators.maxLength(200)],
      ],
      metaTitle: [this.data?.metaTitle || '', [Validators.required]],
      metaDescription: [this.data?.metaDescription || '', [Validators.required]],
      typeId: [this.category ? this.category.id : '', [Validators.required]],
      contentHtml: [this.editorContent, [Validators.required]],
      file: [''],
    });
  }

  submitNews() {
    if (this.isLoading) return;

    // Clear previous errors
    this.clearErrors();

    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.newsForm);
    this.showValidationErrors = true;

    if (this.newsForm.valid) {
      // Additional validation for file upload on create
      if (!this.data && !this.imageFile) {
        this.backendError = 'Please upload an image';
        return;
      }

      this.isLoading = true;

      const formData = new FormData();

      formData.append('typeId', this.newsForm.get('typeId')?.value);
      formData.append('headline', this.newsForm.get('headline')?.value);
      formData.append(
        'primaryKeyword',
        this.newsForm.get('primaryKeyword')?.value
      );
      formData.append('contentHtml', this.newsForm.get('contentHtml')?.value);
      formData.append('metaTitle', this.newsForm.get('metaTitle')?.value || '');
      formData.append(
        'metaDescription',
        this.newsForm.get('metaDescription')?.value || ''
      );
      formData.append('isPublic', String(this.isPublic));
      formData.append('file', this.imageFile);

      // Fix: Ensure selectedGames is always an array and properly handle related games
      const safeSelectedGames = this.selectedGames || [];
      if (safeSelectedGames.length > 0) {
        safeSelectedGames.forEach((game) => {
          formData.append('relatedGames[]', game.id);
        });
      }

      if (this.data) {
        formData.append('id', this.data.id);

        this.announcementService.updateNews(formData).subscribe(
          (result) => {
            this.isLoading = false;
            this._dialog.close(true);
          },
          (error) => {
            this.isLoading = false;
            this.handleBackendError(error);
          }
        );
      } else {
        this.announcementService.uploadNews(formData).subscribe(
          (result) => {
            this.isLoading = false;
            this._dialog.close(true);
          },
          (error) => {
            this.isLoading = false;
            this.handleBackendError(error);
          }
        );
      }
    }
  }

  // Error handling methods
  clearErrors() {
    this.backendError = '';
    this.fieldErrors = {};
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  handleBackendError(error: any) {
    console.error('Backend error:', error);

    if (error.error && error.error.message) {
      this.backendError = error.error.message;
    } else if (error.error && error.error.errors) {
      // Handle field-specific errors from backend
      this.fieldErrors = error.error.errors;
    } else if (error.message) {
      this.backendError = error.message;
    } else {
      this.backendError = 'An unexpected error occurred. Please try again.';
    }
  }

  // Validation error getters for template
  getFieldError(fieldName: string): string {
    const control = this.newsForm.get(fieldName);

    // Check backend field errors first
    if (this.fieldErrors[fieldName]) {
      return this.fieldErrors[fieldName];
    }

    // Check frontend validation errors
    if (control && control.invalid && (control.dirty || control.touched || this.showValidationErrors)) {
      if (control.errors?.['required']) {
        return this.getRequiredErrorMessage(fieldName);
      }
      if (control.errors?.['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters`;
      }
    }

    return '';
  }

  getRequiredErrorMessage(fieldName: string): string {
    const fieldDisplayName = this.getFieldDisplayName(fieldName);
    return `${fieldDisplayName} is required`;
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'headline': 'Title',
      'primaryKeyword': 'Primary keyword',
      'metaTitle': 'Meta title',
      'metaDescription': 'Meta description',
      'typeId': 'News type',
      'contentHtml': 'Content'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.newsForm.get(fieldName);
    return !!(
      (control && control.invalid && (control.dirty || control.touched || this.showValidationErrors)) ||
      this.fieldErrors[fieldName]
    );
  }

  onEditorContentChange(content: string) {
    this.editorContent = content;
    this.newsForm.get('contentHtml')?.setValue(content);
    // Clear content error when user starts typing
    if (content && this.fieldErrors['contentHtml']) {
      delete this.fieldErrors['contentHtml'];
    }
  }

  addGames(game: KeyValuePairModel) {
    // Fix: Ensure selectedGames is always an array
    if (!this.selectedGames) {
      this.selectedGames = [];
    }

    const existingGame = this.selectedGames.find((x) => game.id === x.id);
    if (existingGame) return;
    this.selectedGames.push(game);
  }

  removeGame(game: KeyValuePairModel) {
    // Fix: Ensure selectedGames is always an array
    if (!this.selectedGames) {
      this.selectedGames = [];
      return;
    }
    this.selectedGames = this.selectedGames.filter((x) => game.id != x.id);
  }

  filterGames() {
    this.announcementService.getGames(this.filterText).subscribe((result) => {
      this.games = result.parameters[result.key] as KeyValuePairModel[];
    });
  }

  initTypes() {
    this.newsTypesService.getNewsTypes(this.filterText).subscribe((result) => {
      const types = result.parameters[result.key] as AnnouncementTypeModel[];
      this.newsTypesService.newsTypes.set(types);
    });
  }

  initGames() {
    this.announcementService.getGames('').subscribe((result) => {
      this.games = result.parameters[result.key] as KeyValuePairModel[];

      if (this.data) {
        this.formHeader = 'Edit News';
        this.title = this.data.title;
        this.subtitle = this.data.subtitle;
        this.category = this.data.category;

        // Fix: Ensure selectedGames is always an array, even if filter returns empty
        const relatedGames = this.data.relatedGames || [];
        this.selectedGames = this.games.filter((game) =>
          relatedGames.includes(parseInt(game.id))
        ) || [];

        this.selectedImage = this.data.imageUrl ?? null;
        this.editorContent = this.data.contentHtml ?? '';
      } else {
        this.formHeader = 'Add a new announcement';
        // Fix: Explicitly ensure selectedGames is an empty array for new announcements
        this.selectedGames = [];
      }
      this.initForm();
    });
  }

  togglePrivacy() {
    this.isPublic = !this.isPublic;
  }

  show() {
    this.toggle = !this.toggle;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);

      // Clear backend error if image was the issue
      if (this.backendError.includes('image')) {
        this.backendError = '';
      }
    }
  }

  closeDialog() {
    this._dialog.close();
  }
}
