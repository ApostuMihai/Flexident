import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateUserDialogComponent } from './activate-user-dialog.component';

describe('ActivateUserDialogComponent', () => {
  let component: ActivateUserDialogComponent;
  let fixture: ComponentFixture<ActivateUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateUserDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
