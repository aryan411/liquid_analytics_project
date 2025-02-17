import type { Matrix } from "react-spreadsheet";
import { CellData } from "../types";

/**
 * Formats cell data into a matrix structure for the spreadsheet component
 * @param data - Array of cell data containing row, column and value information
 * @param rowLabels - Array of row labels/indices It should be number
 * @param columnLabels - Array of column labels (A, B, C etc)
 * @returns Matrix of cell objects with string values formatted for the spreadsheet
 */
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
    const rowIndex = rowLabels.indexOf(cell.row.toString());
    const colIndex = columnLabels.indexOf(cell.col);
    if (rowIndex >= 0 && colIndex >= 0) {
      matrix[rowIndex][colIndex] = { value: cell.value };
    }
  });

  return matrix;
};
