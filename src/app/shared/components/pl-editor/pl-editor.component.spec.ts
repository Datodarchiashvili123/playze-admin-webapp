import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlEditorComponent } from './pl-editor.component';

describe('PlEditorComponent', () => {
  let component: PlEditorComponent;
  let fixture: ComponentFixture<PlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
