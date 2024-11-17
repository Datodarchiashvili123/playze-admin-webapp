import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTypesDialogComponent } from './news-types-dialog.component';

describe('NewsTypesDialogComponent', () => {
  let component: NewsTypesDialogComponent;
  let fixture: ComponentFixture<NewsTypesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsTypesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsTypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
