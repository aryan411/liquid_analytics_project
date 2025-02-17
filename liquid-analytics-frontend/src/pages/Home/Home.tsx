// src/pages/Home/Home.tsx
import React, { useState } from "react";
import { MemoizedSpreadsheet } from "./components";
import { Button } from "../../components";

export const Home: React.FC = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [isMulti, setIsMulti] = useState(false);

  const columnLabels = Array.from({ length: 6 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const rowLabels = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

  const initialData: any = [];

const handleUpdateCell = (param: {
    row: string;
    col: string;
    value: string;
  }) => {
    console.log("Cell updated:", param);

    // isAdd && setIsAdd(false);
    // !isMulti  && setIsMulti(false);
    // setIsMulti(false);
  };  

  const handleAddition = () => {
    setIsAdd(true);
    console.log("Addition mode activated");
  };

  const handleMultiplication = () => {
    setIsMulti(true);
    console.log("Multiplication mode activated");
  };

  return (
    <div className="p-4 h-screen">
      <div className="flex flex-col">
        <div className="flex justify-end space-x-4 mb-4">
          <Button
            onClick={handleAddition}
            variant={isAdd ? "primary" : "outline"}
            size="sm"
          >
            Addition
          </Button>
          <Button
            onClick={handleMultiplication}
            variant={isMulti ? "secondary" : "outline"}
            size="sm"
          >
            Multiplication
          </Button>
        </div>
        <MemoizedSpreadsheet
          data={initialData}
          columnLabels={columnLabels}
          rowLabels={rowLabels}
          updateCell={handleUpdateCell}
          isAdd={isAdd}
          isMulti={isMulti}
        />
      </div>
    </div>
  );
};
