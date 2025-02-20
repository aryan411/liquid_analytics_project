import { memo, useEffect, useState } from "react";
import {
  Matrix,
  Point,
  RangeSelection,
  default as ReactSpreadsheet,
} from "react-spreadsheet";
import { formatSpreadsheetData } from "../../../../utils/formateSpreadsheetData";
import { useDebouncedCallback } from "use-debounce";
import { useRangeCalculation } from "./hooks/useRangeCalculation";
import { CellData } from "../../../../types";

type SpreadsheetProps = {
  updateCell: (param: CellData) => void;
  rowLabels: string[];
  columnLabels: string[];
  data: CellData[];
  isAdd: boolean;
  isMulti: boolean;
  updateButtonsState:()=>void
};

/**
 * Spreadsheet component that provides an interactive spreadsheet interface with cell editing and range selection capabilities
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.updateCell - Callback function to update cell data
 * @param {string[]} props.rowLabels - Array of row labels
 * @param {string[]} props.columnLabels - Array of column labels
 * @param {CellData[]} props.data - Array of cell data objects
 * @param {boolean} props.isAdd - Flag indicating if addition mode is active
 * @param {boolean} props.isMulti - Flag indicating if multiplication mode is active
 * @param {Function} props.updateButtonsState - Callback to update button states
 * @returns {JSX.Element} Spreadsheet component
 */
const Spreadsheet = ({
  updateCell,
  rowLabels,
  columnLabels,
  data,
  isAdd,
  isMulti,
  updateButtonsState
}: SpreadsheetProps) => {
  const [formattedData, setFormattedData] = useState<Matrix<{ value: string }>>(
    []
  );

  useEffect(() => {
    const newData = formatSpreadsheetData(data, rowLabels, columnLabels);
    setFormattedData(newData);
  }, [data, rowLabels, columnLabels]);


  const { setSelectedRange } = useRangeCalculation(
    formattedData,
    setFormattedData,
    isAdd,
    isMulti,
    updateCell,
    rowLabels,
    columnLabels,
    updateButtonsState
  );
  const [previousCommit, setPreviousCommit] = useState<{
    prevValue: string | undefined | null;
    nextValue: string | undefined | null;
    coordinates: string | undefined | null;
  }>({
    prevValue: null,
    nextValue: null,
    coordinates: null
  });

  const handleCellCommit = (
    prevCell: { value: string } | undefined | null,
    nextCell: { value: string } | undefined | null,
    coords: Point | null
  ) => {
    const currentCoordinates = coords ? `${coords.column}-${coords.row}` : null;
    
    // Check if this is a new commit or different from previous
    const isDifferentCommit = 
      previousCommit.prevValue != prevCell?.value ||
      previousCommit.nextValue != nextCell?.value ||
      previousCommit.coordinates != currentCoordinates;

    // Check if value actually changed
    const hasValueChanged = prevCell?.value !== nextCell?.value && (prevCell?.value || nextCell?.value);
    if (isDifferentCommit && hasValueChanged && coords && nextCell) {
      // Update previous commit state
      setPreviousCommit({
        prevValue: prevCell?.value,
        nextValue: nextCell.value,
        coordinates: currentCoordinates
      });

      // Update cell
      updateCell({
        row: rowLabels[coords.row],
        col: columnLabels[coords.column],
        value: nextCell.value,
      });
    }
  };
  const debouncedSelect = useDebouncedCallback((selected: RangeSelection) => {
       // Check if multiple columns are selected
       if(!selected?.range) return;
       const columnCount = selected.range?.end.column - selected?.range.start.column + 1;
       const rowCount= selected.range.end.row - selected.range.start.row + 1;
       if (columnCount <= 1 && rowCount <= 1) return;
       setSelectedRange(selected);
    // calculateRangeStats(selected, columnLabels, rowLabels, formattedData);
  }, 500);



  return (
    <ReactSpreadsheet
      data={formattedData}
      columnLabels={columnLabels}
      rowLabels={rowLabels}
      onCellCommit={handleCellCommit}
      onSelect={(selected) => debouncedSelect(selected as RangeSelection)}
      onChange={setFormattedData}
      // onBlur={() => setSelectedRange(null)}
    />
  );

};

/**
 * Memoized version of the Spreadsheet component to optimize rendering performance
 * @component
 * @param {SpreadsheetProps} prevProps - Previous props
 * @param {SpreadsheetProps} nextProps - Next props
 * @returns {boolean} Whether the component should update
 */
export const MemoizedSpreadsheet = memo(Spreadsheet, (prevProps, nextProps) => {
  return (
    prevProps.isAdd === nextProps.isAdd &&
    prevProps.isMulti === nextProps.isMulti &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    JSON.stringify(prevProps.rowLabels) === JSON.stringify(nextProps.rowLabels) &&
    JSON.stringify(prevProps.columnLabels) === JSON.stringify(nextProps.columnLabels)
  );
});