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
import { AnnouncementItemModel } from '../../models/announcement-item.model';

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

  title: string = '';
  subtitle: string = '';
  category!: AnnouncementTypeModel;

  constructor(
    public _dialog: MatDialogRef<AddNewsAnnComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      subtitle: string;
      category: AnnouncementTypeModel;
      contentHtml?: string;
      relatedGames?: KeyValuePairModel[];
      imageUrl?: string;
    }
  ) {
    if (data) {
      this.title = data.title;
      this.subtitle = data.subtitle;
      this.category = data.category;
      this.selectedGames = data.relatedGames ?? [];
      this.selectedImage = data.imageUrl ?? null;
      this.editorContent = data.contentHtml ?? '';
    }
  }

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

  ngOnInit() {
    this.initTypes();
    this.initForm();
    this.initGames();
  }

  initForm() {
    this.newsForm = this._builder.group({
      headline: [this.title, [Validators.required, Validators.maxLength(300)]],
      primaryKeyword: [
        this.subtitle,
        [Validators.required, Validators.maxLength(200)],
      ],
      typeId: [this.category ? this.category.id : '', [Validators.required]],
      contentHtml: [this.editorContent, [Validators.required]],
      file: ['', [Validators.required]],
    });
  }

  submitNews() {
    if (this.isLoading) return;
    if (this.newsForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      formData.append('typeId', this.newsForm.get('typeId')?.value);
      formData.append('headline', this.newsForm.get('headline')?.value);
      formData.append(
        'primaryKeyword',
        this.newsForm.get('primaryKeyword')?.value
      );
      formData.append('contentHtml', this.newsForm.get('contentHtml')?.value);
      formData.append('isPublic', String(this.isPublic));
      formData.append('file', this.imageFile);

      this.selectedGames.forEach((gameId) => {
        formData.append('relatedGames[]', gameId.id);
      });

      this.announcementService.uploadNews(formData).subscribe(
        (result) => {
          this.isLoading = false;

          this._dialog.close(true);
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }

  onEditorContentChange(content: string) {
    this.editorContent = content;
    this.newsForm.get('contentHtml')?.setValue(content);
  }

  addGames(game: KeyValuePairModel) {
    var existingGames = this.selectedGames.find((x) => game.id === x.id);
    if (existingGames) return;
    this.selectedGames.push(game);
  }

  removeGame(game: KeyValuePairModel) {
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
    }
  }
}
