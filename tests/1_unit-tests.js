const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

suite('Unit Tests', () => {
  suite('Function validate()', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.equal(solver.validate(input), true);
    });

    test('Logic handles a puzzle string with invalid characters', () => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x';
      const result = solver.validate(input);
      assert.equal(result.error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      const input = '1.5..2.84..63.12.7.2';
      const result = solver.validate(input);
      assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    });
  });

  suite('Function checkRowPlacement()', () => {
    test('Logic handles a valid row placement', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const row = 0;
      const column = 1;
      const value = '3';
      assert.isTrue(solver.checkRowPlacement(puzzleString, row, column, value));
    });

    test('Logic handles an invalid row placement', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const row = 0;
      const column = 1;
      const value = '1';
      assert.isFalse(solver.checkRowPlacement(puzzleString, row, column, value));
    });
  });

  suite('Function checkColPlacement()', () => {
    test('Logic handles a valid column placement', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const row = 0;
      const column = 1;
      const value = '3';
      assert.isTrue(solver.checkColPlacement(puzzleString, row, column, value));
    });

    test('Logic handles an invalid column placement', () => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const row = 1; // Check second row
        const column = 0; // First column
        const value = '1'; // 1 already exists in first column at row 0
        assert.isFalse(solver.checkColPlacement(puzzleString, row, column, value));
    });
  });

  suite('Function checkRegionPlacement()', () => {
    test('Logic handles a valid region (3x3 grid) placement', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const row = 0;
      const column = 1;
      const value = '3';
      assert.isTrue(solver.checkRegionPlacement(puzzleString, row, column, value));
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const row = 0;
      const column = 1;
      const value = '5';
      assert.isFalse(solver.checkRegionPlacement(puzzleString, row, column, value));
    });
  });

  suite('Function solve()', () => {
    test('Valid puzzle strings pass the solver', () => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.solve(input);
      assert.property(result, 'solution');
      assert.equal(result.solution.length, 81);
      assert.notInclude(result.solution, '.');
    });

    test('Invalid puzzle strings fail the solver', () => {
      const input = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.solve(input);
      assert.property(result, 'error');
      assert.equal(result.error, 'Puzzle cannot be solved');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      const result = solver.solve(input);
      assert.property(result, 'solution');
      assert.equal(result.solution, solution);
    });
  });
});