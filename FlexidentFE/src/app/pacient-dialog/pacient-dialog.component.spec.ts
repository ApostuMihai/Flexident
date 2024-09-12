import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientDialogComponent } from './pacient-dialog.component';

describe('PacientDialogComponent', () => {
  let component: PacientDialogComponent;
  let fixture: ComponentFixture<PacientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
