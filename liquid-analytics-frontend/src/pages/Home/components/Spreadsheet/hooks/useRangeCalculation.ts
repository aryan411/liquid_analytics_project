import { useEffect, useState } from "react";
import { Matrix, Point, RangeSelection } from "react-spreadsheet";
import { calculateRangeStats } from "../../../../../utils";
import { CellData } from "../../../../../types";




/**
 * Custom hook for handling range calculations in a spreadsheet
 * @param formattedData - Matrix of cell data with string values
 * @param setFormattedData - Function to update the formatted data matrix
 * @param isAdd - Boolean flag indicating if addition mode is active
 * @param isMulti - Boolean flag indicating if multiplication mode is active
 * @param updateCell - Callback function to update a cell's value
 * @param rowLabels - Array of row labels
 * @param columnLabels - Array of column labels
 * @param updateButtonsState - Function to reset button states
 * @returns Object containing setSelectedRange function
 */
export const useRangeCalculation = (
  formattedData: Matrix<{ value: string }>,
  setFormattedData: any,
  isAdd: boolean,
  isMulti: boolean,
  updateCell: (param: CellData) => void,
  rowLabels: string[],
  columnLabels: string[],
  updateButtonsState:()=>void
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
      {
        updateButtonsState();
        return;
    }
    const { start, end } = selectedRange.range;
    
    // Find best cell to put result
    const findBestCell = (): Point => {
        // Check if single row selection
        const isSingleRow = start.row === end.row;
      
        if (isSingleRow) {
          // For single row, try rightmost's next cell first
          const rightNext: Point = {
            row: start.row,
            column: end.column + 1
          };
      
          // Check if right next cell is valid
          if (
            rightNext.row >= 0 &&
            rightNext.row < formattedData.length &&
            rightNext.column >= 0 &&
            rightNext.column < formattedData[0].length
          ) {
            return rightNext;
          }
        }
      
        // If not single row or right next not valid, try bottom right's below cell
        const bottomRightBelow: Point = {
          row: end.row + 1,
          column: end.column
        };
      
        // Check if bottom right below cell is valid
        if (
          bottomRightBelow.row >= 0 &&
          bottomRightBelow.row < formattedData.length &&
          bottomRightBelow.column >= 0 &&
          bottomRightBelow.column < formattedData[0].length
        ) {
          return bottomRightBelow;
        }
      
        // Last resort: top right's top cell
        return {
          row: start.row - 1,
          column: end.column
        };
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
    else updateButtonsState()
  }, [isAdd, isMulti]);

  return { setSelectedRange };
};
