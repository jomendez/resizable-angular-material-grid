import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';


export interface GridColumnDefinition {
  field: string;
  width: number;
  actualWidth?: number;
  name?: string;
  index?: number;
  show: boolean;
  order: number;
}


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatTable, { read: ElementRef, static: true }) private matTableRef: ElementRef;
  @ViewChildren('MatTableRowRef') matTableRow: QueryList<any>;
  @Input() dataSource: MatTableDataSource<any[]>;
  @Input() columns: GridColumnDefinition[] = [];
  @Input() cellTemplateRef: TemplateRef<any>;
  @Input() addRemoveColumn = true;
  @Output() rowClick = new EventEmitter<any>();
  @Output() nextPage = new EventEmitter<number>();
  @Input() infiniteScroll: boolean;
  @Input() totalPages = 10;
  @Input() resizable = true;

  currentPage = 1;
  displayedColumns: string[] = [];
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  subscriptions: Subscription[] = [];

  removedColumns: GridColumnDefinition[] = [];
  data: MatTableDataSource<any[]>;
  columnsDef: GridColumnDefinition[] = [];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.columns = [...this.setAddColumns(this.columns)];
    this.columnsDef = [...this.columns];
    this.setDataSource(this.dataSource);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.matTableRow.changes
        .pipe(delay(1))
        .subscribe(results => {
          if (results) {
            // re-ajust the columns width
            this.setDisplayedColumns();
          }
        }));
  }

  setAddColumns(columns: GridColumnDefinition[]): GridColumnDefinition[] {
    if (!columns || columns.length === 0) {
      return [];
    }
    const plusActionExist = columns.find(c => c.field === 'plusAction') as GridColumnDefinition;
    const maxOrder = columns.reduce((max, p) => p.order > max ? p.order : max, columns[0].order);
    if (!plusActionExist && this.addRemoveColumn) {
      columns.push({ field: 'plusAction', width: 20, name: '+', show: true, order: maxOrder + 1 });
      return columns;
    } else {
      return columns;
    }
  }

  onAddRemoveColumn(col: GridColumnDefinition, $event: MouseEvent): void {
    $event.stopPropagation();
    if (!col.show) {
      this.onAddColumn(col);
    } else {
      this.onRemoveColumn(col);
    }
  }

  onAddColumn(column: GridColumnDefinition): void {
    column.show = true;
    this.columns.unshift(...this.removedColumns.filter(c => c.show));
    this.removedColumns = this.removedColumns.filter(c => !c.show);
    this.setDisplayedColumns();
  }

  onRemoveColumn(column: GridColumnDefinition): void {
    column.show = false;
    this.removedColumns.push(...this.columns.filter(c => !c.show));
    this.columns = this.columns.filter(c => c.show);
    this.setDisplayedColumns();
  }

  setDataSource(dataSource: MatTableDataSource<any[]>): void {
    if (!dataSource) {
      return;
    }

    dataSource.data = this.addRemoveColumn ? dataSource.data.map((element: any) => {
      element.plusAction = '';
      return element;
    }) : dataSource.data;

    this.data = dataSource;
    this.setDisplayedColumns();
  }

  setTableResize(tableWidth: number): void {
    let totalWidth = 0;
    totalWidth = this.columns.reduce((a, b) => {
      return a + b.width;
    }, 0);
    const scale = (tableWidth - 5) / totalWidth;
    this.columns.forEach((column: GridColumnDefinition) => {
      column.actualWidth = column.width * scale;
      this.setColumnWidth(column);
    });
  }

  setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.columns.forEach((column: GridColumnDefinition, index: number) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  onResizeColumn(event: MouseEvent, index: number): void {
    if (!this.resizable) {
      return;
    }

    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = (event.target as HTMLInputElement).clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }

  private checkResizing(event: MouseEvent, index: number): void {
    const cellData = this.getCellData(index);
    if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number): DOMRect {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number): void {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', () => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }

  setColumnWidthChanges(index: number, width: number): void {
    if (!this.columns || (index + 1 === this.columns.length)) {
      return;
    }
    const orginalWidth = this.columns[index].actualWidth;
    const dx = width - orginalWidth;
    if (dx !== 0) {
      const j = (this.isResizingRight) ? index + 1 : index - 1;
      const newWidth = this.columns[j].actualWidth - dx;
      if (newWidth > 50) {
        this.columns[index].actualWidth = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].actualWidth = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }


  sortColumns(columns: GridColumnDefinition[]): GridColumnDefinition[] {
    return columns;
    // return columns.sort(numberPropertyComparator('order'));
  }

  setColumnWidth(column: GridColumnDefinition): void {
    of(this.matTableRef)
      .pipe(delay(1))
      .subscribe(x => {
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.field));
        if (columnEls) {
          columnEls.forEach((el: HTMLDivElement) => {
            el.style.width = column.actualWidth + 'px';
          });
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  trackByFn(index: number): number {
    return index;
  }

  onRowClick<T>(row: T): void {
    this.rowClick.emit(row);
  }

  onTableScroll(e: Event): void {
    if (!this.infiniteScroll) {
      return;
    }
    const tableViewHeight = (e.target as HTMLInputElement).offsetHeight; // viewport: ~500px
    const tableScrollHeight = (e.target as HTMLInputElement).scrollHeight; // length of all table
    const scrollLocation = (e.target as HTMLInputElement).scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 20;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation >= limit) {
      if (this.totalPages > this.currentPage) {
        this.nextPage.emit(this.currentPage);
        this.currentPage++;
      }
    }
  }

}
