import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTypesComponent } from './news-types.component';

describe('NewsTypesComponent', () => {
  let component: NewsTypesComponent;
  let fixture: ComponentFixture<NewsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
