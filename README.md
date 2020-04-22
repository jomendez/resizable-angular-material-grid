
# Angular material resizable grid component (with example)

You can find the component: `src/app/grid`

Example of how to use the component: `src/app/resizable-table`

## Clone and install dependencies

```bash
git clone https://github.com/jomendez/resizable-angular-material-grid
cd resizable-angular-material-grid
npm install
```

## @Inputs

- `[dataSource]` Object of type MatTableDataSource with the data
- `[columns]` object with the column definition
- `[cellTemplateRef]` html reference to the cell definition template
- `[addRemoveColumn]` boolean to specify if show add/remove functionality (default true)
- `[resizable]` boolean to specify if make the columns resizable (default true)
- `[infiniteScroll]` boolean to specify if the pagination is going to be infinite scroll (default false)
- `[totalPages]` number that specify the total number of pages
  
  
  ## @outputs
  

- `(nextPage)` call a function with the code that load the next page
- `(rowClick)` call a function when a row is clicked and pas the row object as parameter in the $event object


## Css variables:

-  `--background-color-even` Define the color of the even rows
-  `--background-color-odd` Define the color of the odd rows
-  `--background-color-header` Define the color of the header rows

### Example:

```css
app-grid {
  --background-color-even: #070ada;
  --background-color-odd: rgb(38, 236, 12);
  --background-color-header: #f80808;
}
```



Notes: 
Cell template reference `ng-template(#columnTemplateRef, let-row=row, let-column=column)`
`let-row=row` Defines a variable `row` that can be used as angular variable in the child components (the same for `column`)
