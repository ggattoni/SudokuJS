'use strict'
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class SudokuComponent {

    constructor() {
        this.numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    setBox(index, num) {
        if (num < 1 || num > 9) {
            throw new TypeError("Number must be from 1 to 9");
        }
        this.numbers[index] = num;
    }

    getBox(index) {
        return this.numbers[index];
    }

    isFilled(index) {
        return this.numbers[index] != 0;
    }

    missingNumbers() {
        var result = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (var i = 0; i < 9; i++) {
            if (this.isFilled(i)) {
                var num = this.getBox(i);
                var index = result.indexOf(num);
                result.splice(index, 1);
            }
        }
        return result;
    }
}

class Sudoku {

    constructor() {
        this.grid = new Array(9);
        for (var i = 0; i < 9; i++) {
            this.grid[i] = new Array(9);
            for (var j = 0; j < 9; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    getBox(row, column) {
        return this.grid[row][column];
    }

    setBox(row, column, num) {
        this.grid[row][column] = num;
    }

    resetBox(row, column) {
        this.grid[row][column] = 0;
    }

    getRow(rowIndex) {
        return new SudokuComponent(this.grid[rowIndex]);
    }

    getColumn(columnIndex) {
        var column = [];
        for (var i = 0; i < 9; i++) {
            column.push(this.grid[i][columnIndex]);
        }
        return new SudokuComponent(column);
    }

    getSquare(rowIndex, colIndex) {
        var square = [];
        var rowStart = Math.floor(rowIndex / 3);
        var columnStart = Math.floor(colIndex / 3);
        for (var i = rowStart; i < rowStart + 3; i++) {
            for (var j = columnStart; j < columnStart + 3; j++) {
                square.push(this.grid[i][j]);
            }
        }
        return new SudokuComponent(square);
    }

    missingNumbers(rowIndex, columnIndex) {
        var rowMissing = this.getRow(rowIndex).missingNumbers();
        var columnMissing = this.getColumn(columnIndex).missingNumbers();
        var squareMissing = this.getSquare(rowIndex, columnIndex).missingNumbers();
        var result = [];
        for (var i = 1; i <= 9; i++) {
            if (rowMissing.indexOf(i) > -1 && columnMissing.indexOf(i) > -1 && squareMissing.indexOf(i)) {
                result.push(i);
            }
        }
        return result;
    }

    isFilled(rowIndex, columnIndex) {
        return this.grid[rowIndex][columnIndex] != 0;
    }

    generate() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                /** If I'm backtracking, I found the box filled.
                 *  So I save the number before resetting the box
                 *  and check if it's the only choice left.
                 */
                var prevNum = this.getBox(i, j);

                if (this.isFilled(i, j)) {
                    this.resetBox(i, j);
                    /** If it was the only number possible,
                     *  then go one box back. 
                     */
                    if (this.missingNumbers(i, j).length == 1) {
                        if (j == 0) {
                            j = 9;
                            i--;
                        } else {
                            j--;
                        }
                        continue;
                    }
                }
                var choices = this.missingNumbers(i, j);
                if (prevNum != 0) {
                    var prevNumIndex = choices.indexOf(prevNum);
                    choices.splice(prevNumIndex, 1);
                }
                if (choices.length == 0) {
                    if (j == 0) {
                        j = 9;
                        i--;
                    } else {
                        j--;
                    }
                    continue;
                } else if (choices.length == 1) {
                    this.setBox(i, j, choices[0]);
                } else {
                    var rand = getRandomInt(choices.length);
                    this.setBox(i, j, choices[rand]);
                }
            }
        }
    }

 show() {
        var line = "+---+---+---+---+---+---+---+---+---+\n";
        var midline = "|   |   |   |   |   |   |   |   |   |\n";
        var startline = "| ";
        var inline = " | ";
        var endline = "\n";
        var oneRow = "";
        for (var i = 0; i < 9; i++) {
            console.log(line);
            console.log(midline);
            oneRow = startline;
            for (var j = 0; j < 9; j++) {
                oneRow += this.getBox(i, j);
                if (i != 9) {
                    oneRow += inline;
                }
            }
            oneRow += endline
            console.log(oneRow);
            console.log(midline);
        }
        console.log(line);
    }

}

var sudoku = new Sudoku();
sudoku.generate();
sudoku.show();
