import { useEffect, useState } from "react";
import {
  Matrix,
  Point,
  Selection,
  RangeSelection,
  default as ReactSpreadsheet,
} from "react-spreadsheet";
import { formatSpreadsheetData } from "../../../../utils/formateSpreadsheetData";
import { useDebouncedCallback } from "use-debounce";
import { calculateRangeStats } from "../../../../utils";

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
};

export const Spreadsheet = ({
  updateCell,
  rowLabels,
  columnLabels,
  data,
}: SpreadsheetProps) => {
  const [formattedData, setFormattedData] = useState<Matrix<{ value: string }>>(
    []
  );

  useEffect(() => {
    const newData = formatSpreadsheetData(data, rowLabels, columnLabels);
    setFormattedData(newData);
  }, [data, rowLabels, columnLabels]);

 

  const handleCellCommit = (
    prevCell: { value: string } | null,
    nextCell: { value: string } | null,
    coords: Point | null
  ) => {
    if (prevCell?.value !== nextCell?.value && coords && nextCell) {
      updateCell({
        row: rowLabels[coords.row],
        col: columnLabels[coords.column],
        value: nextCell.value,
      });
    }
  };
  const debouncedSelect = useDebouncedCallback((selected: Selection) => {
    calculateRangeStats(selected as RangeSelection, columnLabels,rowLabels,formattedData);
  }, 500);

  return (
    <ReactSpreadsheet
      data={formattedData}
      columnLabels={columnLabels}
      rowLabels={rowLabels}
      onCellCommit={handleCellCommit}
      onSelect={(selected) => debouncedSelect(selected)}
      onChange={setFormattedData}
    />
  );
};
