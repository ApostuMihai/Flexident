import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPacientDialogComponent } from './edit-pacient-dialog.component';

describe('EditPacientDialogComponent', () => {
  let component: EditPacientDialogComponent;
  let fixture: ComponentFixture<EditPacientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPacientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPacientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
