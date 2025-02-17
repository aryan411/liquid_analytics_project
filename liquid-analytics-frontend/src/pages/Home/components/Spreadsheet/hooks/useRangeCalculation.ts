import { useEffect, useState } from "react";
import { Matrix, Point, RangeSelection } from "react-spreadsheet";
import { calculateRangeStats } from "../../../../../utils";

// type RangeSelection = {
//   start: Point;
//   end: Point;
// };

type CellData = {
  row: string;
  col: string;
  value: string;
};

export const useRangeCalculation = (
  formattedData: Matrix<{ value: string }>,
  setFormattedData: any,
  isAdd: boolean,
  isMulti: boolean,
  updateCell: (param: CellData) => void,
  rowLabels: string[],
  columnLabels: string[]
) => {
  const [selectedRange, setSelectedRange] = useState<RangeSelection | null>(
    null
  );
  useEffect(() => {
    if (
      !selectedRange?.range ||
      !selectedRange?.range.start ||
      !formattedData.length ||
      (!isAdd && !isMulti)
    )
      return;
    const { start, end } = selectedRange.range;

    // Find best cell to put result
    const findBestCell = (): Point => {
      const possibleCells: Point[] = [
        { row: start.row - 1, column: start.column }, // Top
        { row: end.row + 1, column: end.column }, // Bottom
        { row: start.row, column: end.column + 1 }, // Right
        { row: end.row, column: start.column - 1 }, // Left
      ];

      // Filter valid cells (within grid bounds)
      const validCells = possibleCells.filter(
        (cell) =>
          cell.row >= 0 &&
          cell.row < formattedData.length &&
          cell.column >= 0 &&
          cell.column < formattedData[0].length
      );

      // Priority check function
      const getCellPriority = (cell: Point): number => {
        const value = formattedData[cell.row][cell.column]?.value;
        if (!value || value === "") return 1; // Empty cells highest priority
        if (isNaN(Number(value))) return 2; // String cells medium priority
        return 3; // Number cells lowest priority
      };

      // Sort by priority and return best cell
      return validCells.sort(
        (a, b) => getCellPriority(a) - getCellPriority(b)
      )[0];
    };

    // Execute calculation and update
    const bestCell = findBestCell();
    if (bestCell) {
      const result = calculateRangeStats(
        selectedRange.range,
        columnLabels,
        rowLabels,
        formattedData
      );
      setFormattedData(() => {
        formattedData[bestCell.row][bestCell.column] = {
          value: isAdd ? result.sum.toString() : result.product.toString(),
        };
        return JSON.parse(JSON.stringify(formattedData));
      });
      updateCell({
        row: rowLabels[bestCell.row],
        col: columnLabels[bestCell.column],
        value: isAdd ? result.sum.toString() : result.product.toString(),
      });
      setSelectedRange(null);
    }
  }, [isAdd, isMulti]);

  return { setSelectedRange };
};
