import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewsAnnComponent } from './add-news-ann.component';

describe('AddNewsAnnComponent', () => {
  let component: AddNewsAnnComponent;
  let fixture: ComponentFixture<AddNewsAnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewsAnnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewsAnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
