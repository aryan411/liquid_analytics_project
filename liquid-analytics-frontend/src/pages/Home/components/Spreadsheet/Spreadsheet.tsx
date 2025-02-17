import { memo, useEffect, useState } from "react";
import {
  Matrix,
  Point,
  RangeSelection,
  default as ReactSpreadsheet,
} from "react-spreadsheet";
import { formatSpreadsheetData } from "../../../../utils/formateSpreadsheetData";
import { useDebouncedCallback } from "use-debounce";
import { calculateRangeStats } from "../../../../utils";
import { useRangeCalculation } from "./hooks/useRangeCalculation";

type CellData = {
  row: string;
  col: string;
  value: string;
};

type SpreadsheetProps = {
  updateCell: (param: CellData) => void;
  rowLabels: string[];
  columnLabels: string[];
  data: CellData[];
  isAdd: boolean;
  isMulti: boolean;
};

const Spreadsheet = ({
  updateCell,
  rowLabels,
  columnLabels,
  data,
  isAdd,
  isMulti,
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
       const columnCount = selected.range?.start.column - selected?.range.start.column + 1;
       const rowCount= selected.range.end.row - selected.range.start.row + 1;
       if (columnCount <= 1 && rowCount <= 1) return;
       setSelectedRange(selected as any);
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

export const MemoizedSpreadsheet = memo(Spreadsheet, (prevProps, nextProps) => {
  debugger
  return (
    prevProps.isAdd === nextProps.isAdd &&
    prevProps.isMulti === nextProps.isMulti &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    JSON.stringify(prevProps.rowLabels) === JSON.stringify(nextProps.rowLabels) &&
    JSON.stringify(prevProps.columnLabels) === JSON.stringify(nextProps.columnLabels)
  );
});