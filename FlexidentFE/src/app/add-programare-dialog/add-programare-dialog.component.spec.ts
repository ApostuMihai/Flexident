import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramareDialogComponent } from './add-programare-dialog.component';

describe('AddProgramareDialogComponent', () => {
  let component: AddProgramareDialogComponent;
  let fixture: ComponentFixture<AddProgramareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProgramareDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProgramareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
