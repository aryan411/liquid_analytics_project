
import React, { useState } from "react";
import { MemoizedSpreadsheet as Spreadsheet } from "./components";
import { Button } from "../../components";
import { useSpreadsheetSync } from "../../hooks/useSpreadsheetSync";

/**
 * Home component that displays an interactive spreadsheet with addition and multiplication functionality
 * @component
 * @returns {JSX.Element} A page containing a spreadsheet and control buttons
 */
export const Home: React.FC = () => {
  const { data,updateCell } = useSpreadsheetSync();
  const [isAdd, setIsAdd] = useState(false);
  const [isMulti, setIsMulti] = useState(false);

  const columnLabels = Array.from({ length: 6 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  //   console.log(data, isConnected, updateCell);

  const rowLabels = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

  /**
   * Handles cell updates in the spreadsheet
   * @param param - Object containing row, column and value information
   * @param param.row - Row index as string
   * @param param.col - Column label
   * @param param.value - New cell value
   */
  const handleUpdateCell = (param: {
    row: string;
    col: string;
    value: string;
  }) => {
    console.log("Cell updated:", param);
    updateCell({ ...param, row: Number(param.row) });
    updateButtonsState()
  };

/**
 * Resets the state of addition and multiplication buttons using setTimeout
 * 
 * Why setTimeout instead of direct state update:
 * 1. React-Spreadsheet has an internal state management that conflicts with immediate state updates
 * 2. Direct state updates (setIsAdd(false), setIsMulti(false)) cause React-Spreadsheet's onChange 
 *    to enter an infinite loop
 * 3. setTimeout moves our state update to the next event loop tick, allowing React-Spreadsheet 
 *    to complete its internal operations
 * 4. This micro-delay prevents state update collision between our component and React-Spreadsheet
 * 5. While not ideal, this workaround maintains component stability without affecting UX
 * 
 * Note: This is a workaround for React-Spreadsheet's event handling limitation
 */
const updateButtonsState = () => {
  setTimeout(() => {
    setIsAdd(false);
    setIsMulti(false);
  }, 1);
};

  /**
   * Toggles the addition mode for the spreadsheet
   */
  const handleAddition = () => {
    setIsAdd((val)=>!val);
    // console.log("Addition mode activated");
  };

  /**
   * Toggles the multiplication mode for the spreadsheet
   */
  const handleMultiplication = () => {
    setIsMulti((val)=>!val);
    // console.log("Multiplication mode activated");
  };

  return (
    <div className="p-4 h-screen">
      <div className="flex flex-col">
        <div className="flex justify-end space-x-4 mb-4">
          <Button
            onClick={handleAddition}
            variant={isAdd ? "primary" : "new"}
            disabled={isAdd}
            size="sm"
          >
            Addition
          </Button>
          <Button
            onClick={handleMultiplication}
            disabled={isMulti}
            variant={isMulti ? "secondary" : "new"}
            size="sm"
          >
            Multiplication
          </Button>
        </div>
        <Spreadsheet
          data={data.map((obj) => ({ ...obj, row: obj.row.toString() }))}
          columnLabels={columnLabels}
          rowLabels={rowLabels}
          updateCell={handleUpdateCell}
          isAdd={isAdd}
          isMulti={isMulti}
          updateButtonsState={updateButtonsState}
        />
      </div>
    </div>
  );
};
