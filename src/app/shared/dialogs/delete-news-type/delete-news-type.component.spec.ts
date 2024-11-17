import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNewsTypeComponent } from './delete-news-type.component';

describe('DeleteNewsTypeComponent', () => {
  let component: DeleteNewsTypeComponent;
  let fixture: ComponentFixture<DeleteNewsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNewsTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteNewsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
