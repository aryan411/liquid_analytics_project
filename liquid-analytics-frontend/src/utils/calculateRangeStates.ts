import { Matrix, RangeSelection } from "react-spreadsheet";

export const calculateRangeStats = (
  rangeObj: RangeSelection,
  columnLabels: String[],
  rowLabels: String[],
  formattedData: Matrix<{ value: string }>
) => {
  const { range } = rangeObj;

  if (!range?.start || !range.end) return;

  const { start, end } = range;
  // Get range dimensions
  const rowCount = end.row - start.row + 1;
  const colCount = end.column - start.column + 1;

  console.log("Range dimensions:", {
    rows: rowCount,
    columns: colCount,
    from: `${columnLabels[start.column]}${rowLabels[start.row]}`,
    to: `${columnLabels[end.column]}${rowLabels[end.row]}`,
  });

  let product = 1;
  let sum = 0;

  let validNumbers = 0;
  // Calculate for each column in range
  for (let col = start.column; col <= end.column; col++) {
    // Process each row in current column
    for (let row = start.row; row <= end.row; row++) {
      const cellValue = formattedData?.[row]?.[col]?.value;
      const number = Number(cellValue);

      if (!isNaN(number) && cellValue !== undefined && cellValue !== null) {
        sum += number;
        product *= number;
        validNumbers++;
      } else if (cellValue) {
        // invalidCells.push(`${columnLabels[col]}${rowLabels[row]}`);
      }
    }
  }
  if (validNumbers > 0) {
    console.log(`selection  stats:`, {
      sum,
      product,
      validNumbers,
      // invalidCells,
    });
  }
};
