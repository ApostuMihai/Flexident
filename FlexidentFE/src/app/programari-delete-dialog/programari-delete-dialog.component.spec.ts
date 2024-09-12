import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramariDeleteDialogComponent } from './programari-delete-dialog.component';

describe('ProgramariDeleteDialogComponent', () => {
  let component: ProgramariDeleteDialogComponent;
  let fixture: ComponentFixture<ProgramariDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramariDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramariDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
