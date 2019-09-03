import { Component, OnInit } from '@angular/core';
import { GridColumnDefinition } from '../grid/grid.component';
import { MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-resizable-table',
  templateUrl: './resizable-table.component.html',
  styleUrls: ['./resizable-table.component.scss']
})
export class ResizableTableComponent implements OnInit {

  // dataSource: MatTableDataSource<any>;
  columns: GridColumnDefinition[] = [
    { field: 'position', width: 20, name: 'position', show: true, order: 1 },
    { field: 'name', width: 80, name: 'name', show: true, order: 2 },
    { field: 'weight', width: 40, name: 'weight', show: true, order: 3 },
    { field: 'symbol', width: 30, name: 'symbol', show: true, order: 4 },

  ];
  dataSource: MatTableDataSource<any>;

  constructor() {
    this.dataSource = new MatTableDataSource<any>(DATA);
  }
  
  ngOnInit() {
  }

}
