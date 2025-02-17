import { Matrix, Point } from "react-spreadsheet";

export const calculateRangeStats = (
  rangeObj: { start:Point, end:Point },
  columnLabels: String[],
  rowLabels: String[],
  formattedData: Matrix<{ value: string }>
) => {


  const { start, end } = rangeObj;
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

      if (!isNaN(number) && cellValue !== undefined && cellValue !== null && cellValue !== "") {
        sum += number;
        product *= number;
        validNumbers++;
      } 
    }
  }
  if (validNumbers > 0) {
    console.log(`selection  stats:`, {
      sum,
      product,
      validNumbers,
    });
  }
  return {
    sum,
    product,
    validNumbers,
  };
};
