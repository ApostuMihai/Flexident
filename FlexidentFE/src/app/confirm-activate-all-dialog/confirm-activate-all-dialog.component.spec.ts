import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmActivateAllDialogComponent } from './confirm-activate-all-dialog.component';

describe('ConfirmActivateAllDialogComponent', () => {
  let component: ConfirmActivateAllDialogComponent;
  let fixture: ComponentFixture<ConfirmActivateAllDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmActivateAllDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmActivateAllDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
