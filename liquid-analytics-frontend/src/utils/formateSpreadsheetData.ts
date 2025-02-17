import type { Matrix } from "react-spreadsheet";

type CellData = {
  row: string;
  col: string;
  value: string;
};

export const formatSpreadsheetData = (
  data: CellData[],
  rowLabels: string[],
  columnLabels: string[]
): Matrix<{
  value: string;
}> => {
  const matrix: Matrix<{
    value: string;
  }> = Array(rowLabels.length)
    .fill(null)
    .map(() => Array(columnLabels.length).fill({ value: "" }));

  data.forEach((cell) => {
    const rowIndex = rowLabels.indexOf(cell.col);
    const colIndex = columnLabels.indexOf(cell.col);
    if (rowIndex >= 0 && colIndex >= 0) {
      matrix[rowIndex][colIndex] = { value: cell.value };
    }
  });

  return matrix;
};
