import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimerComponente } from './primer-componente';

describe('PrimerComponente', () => {
  let component: PrimerComponente;
  let fixture: ComponentFixture<PrimerComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimerComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimerComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
