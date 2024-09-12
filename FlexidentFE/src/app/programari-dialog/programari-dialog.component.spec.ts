import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramariDialogComponent } from './programari-dialog.component';

describe('ProgramariDialogComponent', () => {
  let component: ProgramariDialogComponent;
  let fixture: ComponentFixture<ProgramariDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramariDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramariDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
