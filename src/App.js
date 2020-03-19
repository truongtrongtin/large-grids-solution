import React, { useState, useEffect } from 'react';
import './App.css';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from 'react-window';

function Cell({ columnIndex, rowIndex, data, style }) {
  const { selection, setSelection } = data;
  const { start, end } = selection;

  function className() {
    // Check if cell is outside of selected area
    if (columnIndex < Math.min(start.columnIndex, end.columnIndex)
      || columnIndex > Math.max(start.columnIndex, end.columnIndex)
      || rowIndex < Math.min(start.rowIndex, end.rowIndex)
      || rowIndex > Math.max(start.rowIndex, end.rowIndex)) {
      return '';
    }
    return 'selected';
  }

  function handleMouseDown({rowIndex, columnIndex}) {
    setSelection(prevState => ({
      ...selection,
      isSelecting: true,
      start: {
        ...prevState.start,
        rowIndex,
        columnIndex
      },
      end: {
        ...prevState.end,
        rowIndex,
        columnIndex
      }
    }));
  }

  function handleMouseOver({rowIndex, columnIndex}) {
    if (selection.isSelecting) {
      setSelection(prevState => ({
        ...selection,
        end: {
          ...prevState.end,
          rowIndex,
          columnIndex
        }
      }));
    }
  }

  return (
    <div
      className={className()}
      onMouseDown={() => handleMouseDown({rowIndex, columnIndex})}
      onMouseOver={() => handleMouseOver({rowIndex, columnIndex})}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '.5px solid black',
        userSelect: 'none',
      }}
    >
      {columnIndex}, {rowIndex}
    </div>
  )
};

function App() {
  const [selection, setSelection] = useState({
    isSelecting: false,
    start: {
      rowIndex: -1,
      columnIndex: -1
    },
    end: {
      rowIndex: -1,
      columnIndex: -1
    }
  });

  function handleMouseUp() {
    setSelection(prevState => ({
      ...prevState,
      isSelecting: false,
    }));
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  })

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          columnCount={1000}
          columnWidth={100}
          height={height}
          rowCount={1000000}
          rowHeight={35}
          width={width}
          itemData={{selection, setSelection}}
        >
          {Cell}
        </Grid>
      )}
    </AutoSizer>
  )
};

export default App;
