import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ResizableTableComponent } from './resizable-table/resizable-table.component';
import { GridComponent } from './grid/grid.component';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ResizableTableComponent,
        GridComponent
      ],
      imports:[
        MaterialModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
