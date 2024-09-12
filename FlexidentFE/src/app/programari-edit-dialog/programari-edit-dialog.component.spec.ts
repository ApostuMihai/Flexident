import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramariEditDialogComponent } from './programari-edit-dialog.component';

describe('ProgramariEditDialogComponent', () => {
  let component: ProgramariEditDialogComponent;
  let fixture: ComponentFixture<ProgramariEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramariEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramariEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
