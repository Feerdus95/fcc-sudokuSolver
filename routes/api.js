'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/puzzles')
    .get((req, res) => {
      res.json(puzzlesAndSolutions);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const solution = solver.solve(puzzle);
      res.json(solution);
    });

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate puzzle string
      const validationResult = solver.validate(puzzle);
      if (validationResult !== true) {
        return res.json(validationResult);
      }

      // Validate coordinate format
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Validate value
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate.charCodeAt(0) - 65; // Convert A-I to 0-8
      const col = parseInt(coordinate[1]) - 1;

      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, parseInt(value))) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, col, parseInt(value))) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, col, parseInt(value))) {
        conflicts.push('region');
      }

      res.json({
        valid: conflicts.length === 0,
        conflict: conflicts.length > 0 ? conflicts : undefined
      });
    });
};