import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableTableComponent } from './resizable-table.component';
import { GridComponent } from '../grid/grid.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';

describe('ResizableTableComponent', () => {
  let component: ResizableTableComponent;
  let fixture: ComponentFixture<ResizableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResizableTableComponent,
        GridComponent,
      ],
      imports: [
        MaterialModule,
        FormsModule
      ]
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
