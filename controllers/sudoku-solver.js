class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (!/^[1-9.]+$/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    const rowArray = grid[row];
    
    // Skip the current position when checking
    for (let i = 0; i < 9; i++) {
      if (i !== column && rowArray[i] === parseInt(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    value = parseInt(value);

    // Check if the value already exists in the column
    for (let i = 0; i < 9; i++) {
        // Don't skip any positions when checking for conflicts
        if (grid[i][column] === value) {
            return false;
        }
    }
    return true;
}

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    const regionStartRow = Math.floor(row / 3) * 3;
    const regionStartCol = Math.floor(column / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = regionStartRow + i;
        const currentCol = regionStartCol + j;
        // Skip the current position when checking
        if (currentRow !== row || currentCol !== column) {
          if (grid[currentRow][currentCol] === parseInt(value)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    // Basic validation first
    const validationResult = this.validate(puzzleString);
    if (validationResult !== true) return validationResult;
  
    const grid = this.transformToGrid(puzzleString);
    if (this.solveSudoku(grid)) {
      return { solution: this.transformToString(grid) }; // Return object with solution property
    }
    return { error: 'Puzzle cannot be solved' };
  }

  // Helper methods
transformToGrid(puzzleString) {
  const grid = [];
  let pos = 0;
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      row.push(puzzleString[pos] === '.' ? 0 : parseInt(puzzleString[pos]));
      pos++;
    }
    grid.push(row);
  }
  return grid;
}

  transformToString(grid) {
    return grid.flat().join('');
  }

  solveSudoku(grid) {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid)) {
          return true;
        }

        grid[row][col] = 0;
      }
    }
    return false;
  }

  findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  isSafe(grid, row, col, num) {
    return (
      this.checkRowPlacement(this.transformToString(grid), row, col, num) &&
      this.checkColPlacement(this.transformToString(grid), row, col, num) &&
      this.checkRegionPlacement(this.transformToString(grid), row, col, num)
    );
  }
}

module.exports = SudokuSolver;