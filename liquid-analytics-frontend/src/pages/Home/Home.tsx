// src/pages/Home/Home.tsx
import React from 'react';
import { Spreadsheet } from './components';

export const Home: React.FC = () => {
  // Generate column labels A to G
  const columnLabels = Array.from({ length: 6 }, (_, i) => 
    String.fromCharCode(65 + i)
  ); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  // Generate row labels 1 to 10
  const rowLabels = Array.from({ length: 10 }, (_, i) => 
    `${i + 1}`
  ); // ['1', '2', '3', ..., '10']

  // Generate empty data array
  const initialData:any = []
//   Array.from({ length: 10 }, (_, row) => 
//     Array.from({ length: 7 }, (_, col) => ({
//       row: rowLabels[row],
//       col: columnLabels[col],
//       value: ''
//     }))
//   ).flat(); // Flatten the 2D array to match our data structure

  const handleUpdateCell = (param: { row: string; col: string; value: string }) => {
    console.log('Cell updated:', param);
  };    

  return (
    <div className="p-4 h-screen">
      <Spreadsheet
        data={initialData}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
        updateCell={handleUpdateCell}
      />
    </div>
  );
};