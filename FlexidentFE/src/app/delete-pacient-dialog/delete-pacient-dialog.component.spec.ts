import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePacientDialogComponent } from './delete-pacient-dialog.component';

describe('DeletePacientDialogComponent', () => {
  let component: DeletePacientDialogComponent;
  let fixture: ComponentFixture<DeletePacientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePacientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePacientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
