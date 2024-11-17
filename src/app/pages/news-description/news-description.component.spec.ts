import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDescriptionComponent } from './news-description.component';

describe('NewsDescriptionComponent', () => {
  let component: NewsDescriptionComponent;
  let fixture: ComponentFixture<NewsDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
