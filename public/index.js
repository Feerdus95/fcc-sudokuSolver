const textArea = document.getElementById('text-input');
const coordInput = document.getElementById('coord');
const valInput = document.getElementById('val');
const errorMsg = document.getElementById('error');

// Move all initialization code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    createSudokuGrid();
    setupEventListeners();
    loadPuzzle();
});

function setupEventListeners() {
    // Grid cell input listeners
    const cells = document.querySelectorAll('.sudoku-input');
    cells.forEach((cell, index) => {
        cell.addEventListener('input', handleCellInput);
        cell.addEventListener('focus', () => cell.classList.add('bg-slate-800'));
        cell.addEventListener('blur', () => cell.classList.remove('bg-slate-800'));
    });

    // Button listeners
    document.getElementById('solve-button').addEventListener('click', handleSolve);
    document.getElementById('check-button').addEventListener('click', handleCheck);
    document.getElementById('clear-button').addEventListener('click', handleClear);

    // Input validation listeners
    coordInput.addEventListener('input', handleCoordInput);
    valInput.addEventListener('input', handleValueInput);
}

async function handleSolve() {
    const puzzle = textArea.value;
    try {
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzle })
        });

        const data = await response.json();
        if (data.error) {
            showError(data.error);
        } else {
            updateGrid(data.solution);
        }
    } catch (err) {
        showError('Something went wrong');
        console.error(err);
    }
}

async function handleCheck() {
    const puzzle = textArea.value;
    const coordinate = coordInput.value;
    const value = valInput.value;

    try {
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzle, coordinate, value })
        });

        const data = await response.json();
        if (data.error) {
            showError(data.error);
        } else {
            showError(data.valid ? 
                'Valid placement!' : 
                `Invalid placement. Conflicts: ${data.conflict.join(', ')}`
            );
        }
    } catch (err) {
        showError('Something went wrong');
        console.error(err);
    }
}

function handleClear() {
    const emptyPuzzle = '.'.repeat(81);
    updateGrid(emptyPuzzle);
    errorMsg.textContent = '';
}

function handleCellInput(e) {
    let value = e.target.value;
    if (value && !/^[1-9]$/.test(value)) {
        value = '';
        e.target.value = '';
    }
    
    updateTextArea();
}

function handleCoordInput(e) {
    let value = e.target.value.toUpperCase();
    if (value.length <= 2) {
        e.target.value = value.replace(/[^A-I1-9]/g, '');
    }
    if (value.length > 2) {
        e.target.value = value.slice(0, 2);
    }
}

function handleValueInput(e) {
    const value = e.target.value;
    if (!/^[1-9]$/.test(value)) {
        e.target.value = value.replace(/[^1-9]/g, '').slice(0, 1);
    }
}

function updateTextArea() {
    const cells = document.querySelectorAll('.sudoku-input');
    let puzzleString = '';
    cells.forEach(cell => {
        puzzleString += cell.value || '.';
    });
    textArea.value = puzzleString;
}

function updateGrid(puzzleString) {
    const cells = document.querySelectorAll('.sudoku-input');
    cells.forEach((cell, index) => {
        cell.value = puzzleString[index] === '.' ? '' : puzzleString[index];
    });
    textArea.value = puzzleString;
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 3000);
}

function loadPuzzle() {
    const initialPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    updateGrid(initialPuzzle);
}

function createSudokuGrid() {
  const grid = document.getElementById('sudoku-grid');
  grid.innerHTML = '';
  const tbody = document.createElement('tbody');

  for (let i = 0; i < 9; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 9; j++) {
          const cell = document.createElement('td');
          const input = document.createElement('input');

          input.className = 'sudoku-input';
          input.type = 'text';
          input.maxLength = 1;
          
          cell.appendChild(input);
          row.appendChild(cell);
      }
      tbody.appendChild(row);
  }

  grid.appendChild(tbody);
}