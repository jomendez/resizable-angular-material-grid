import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableTableComponent } from './resizable-table.component';

describe('ResizableTableComponent', () => {
  let component: ResizableTableComponent;
  let fixture: ComponentFixture<ResizableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
