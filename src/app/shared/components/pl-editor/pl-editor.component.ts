import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { editable } from '../../models/editor-config';
import { ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pl-editor',
  standalone: true,
  imports: [EditorModule, FormsModule],
  templateUrl: './pl-editor.component.html',
  styleUrl: './pl-editor.component.scss',
})
export class PlEditorComponent {
  editorConfig = editable;
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  onContentChange(content: string) {
    this.content = content;
    this.contentChange.emit(this.content);
  }
}
