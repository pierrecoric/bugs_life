"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var beings_1 = require("./beings");
var initialAmountAnts = 200;
var initialAmountBugs = 80;
var antReproductionLikelihood = 10 - 9;
var doodleBugReproductionLikelihood = 10 - 8;
var antChars = [".", "o", "O", "0", "8"];
var doodleBugChar = ["-", "x", "X", "F", "E", "#"];
//World Class.
var World = /** @class */ (function () {
    function World(dimensions) {
        this.dimensions = dimensions;
        this.cell = [];
        for (var x = 0; x < dimensions[0]; x++) {
            var column = [];
            for (var y = 0; y < dimensions[1]; y++) {
                column.push(undefined);
            }
            this.cell.push(column);
        }
        this.population = [];
        this.initialize();
    }
    //Function to put a being into place.
    World.prototype.placeBeing = function (newPosition, guy) {
        if (newPosition[0] > this.dimensions[0] || newPosition[1] > this.dimensions[1]) {
            return;
        }
        else {
            this.cell[newPosition[0]][newPosition[1]] = guy;
            this.population.push(guy);
        }
    };
    //Function to populate the world.
    World.prototype.initialize = function () {
        for (var i_1 = 0; i_1 < initialAmountAnts; i_1++) {
            var posx = randomInterval(0, this.dimensions[0] - 1);
            var posy = randomInterval(0, this.dimensions[1] - 1);
            var newAnt = new beings_1.Ant([posx, posy], 0, "Bogusława");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
            }
            else {
                i_1--;
            }
        }
        for (var i_2 = 0; i_2 < initialAmountBugs; i_2++) {
            var posx = randomInterval(0, this.dimensions[0] - 1);
            var posy = randomInterval(0, this.dimensions[1] - 1);
            var newDoodleBug = new beings_1.DoodleBug([posx, posy], 0, "Zbigniew");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
            }
            else {
                i_2--;
            }
        }
    };
    //Function to read the population
    World.prototype.readPopulation = function () {
        console.log(this.population.length);
    };
    World.prototype.getNeighbors = function (x, y) {
        var neighbors = [];
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                //checking the cell itself.
                if (dx === 0 && dy === 0)
                    continue;
                var nx = x + dx;
                var ny = y + dy;
                if (nx >= 0 &&
                    nx < this.dimensions[0] &&
                    ny >= 0 &&
                    ny < this.dimensions[1]) {
                    if (this.cell[nx][ny] instanceof beings_1.Being)
                        neighbors.push(this.cell[nx][ny]);
                }
            }
        }
        return neighbors;
    };
    World.prototype.getFreeCells = function (x, y) {
        var freeCells = [];
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0)
                    continue;
                var nx = x + dx;
                var ny = y + dy;
                if (nx >= 0 &&
                    nx < this.dimensions[0] &&
                    ny >= 0 &&
                    ny < this.dimensions[1]) {
                    if (this.cell[nx][ny] === undefined) {
                        var coordinates = [nx, ny];
                        freeCells.push(coordinates);
                    }
                }
            }
        }
        return freeCells;
    };
    //Everybody move
    //[left, right, up, down]
    World.prototype.moveEverybody = function () {
        for (var i_3 = 0; i_3 < this.population.length; i_3++) {
            var _a = this.population[i_3].getPosition(), x = _a[0], y = _a[1];
            var freeCells = this.getFreeCells(x, y);
            //move
            this.population[i_3].move(freeCells);
            this.cell[x][y] = undefined;
            var newPosition = this.population[i_3].getPosition();
            if (this.population[i_3] instanceof beings_1.Being) {
                var thisBeing = this.population[i_3];
                this.cell[newPosition[0]][newPosition[1]] = thisBeing;
            }
        }
    };
    //Doodlebugs eat ants.
    //Everybody gets hungry.
    //Everybody is making babies. Rule: if exactly two of the same beings are next to eachOther,
    //they have one chance out of three to make a baby. The baby appears in one of the free spots around them.
    World.prototype.makingBabies = function () {
        //Iterate over the population.
        for (var i_4 = 0; i_4 < this.population.length; i_4++) {
            //Get the position of the current being.
            var _a = this.population[i_4].getPosition(), x = _a[0], y = _a[1];
            var neighbors = this.getNeighbors(x, y);
            //If the current being only has a neighbor
            if (neighbors.length === 1) {
                //Get the species and ages of both beings.
                var beingA = this.population[i_4];
                var beingB = neighbors[0];
                //If both beings are of the same species and old enough to have babies and not too old to have babies.
                if (beingA.getSpecies() === beingB.getSpecies() &&
                    beingA.getAge() > beingA.getLifeExpectancy() / 8 &&
                    beingB.getAge() > beingB.getLifeExpectancy() / 8 &&
                    beingA.getAge() < beingA.getLifeExpectancy() - beingA.getLifeExpectancy() / 5 &&
                    beingB.getAge() < beingB.getLifeExpectancy() - beingB.getLifeExpectancy() / 5) {
                    //Define wheter babies are being made
                    var letsMakeBabies = false;
                    if (beingA.getSpecies() === "ANT") {
                        var dice = randomInterval(0, antReproductionLikelihood);
                        if (dice === 0) {
                            letsMakeBabies = true;
                        }
                    }
                    else {
                        var dice = randomInterval(0, doodleBugReproductionLikelihood);
                        if (dice === 0) {
                            letsMakeBabies = true;
                        }
                    }
                    if (letsMakeBabies) {
                        var freeCells = this.getFreeCells(x, y);
                        var babyCell = freeCells[randomInterval(0, freeCells.length - 1)];
                        if (beingA.getSpecies() === "ANT") {
                            var newAnt = new beings_1.Ant(babyCell, 0, "Jamnicek");
                            this.placeBeing(newAnt.getPosition(), newAnt);
                        }
                        else {
                            var newDoodleBug = new beings_1.DoodleBug(babyCell, 0, "Jamnicek");
                            this.placeBeing(newDoodleBug.getPosition(), newDoodleBug);
                        }
                    }
                }
            }
        }
    };
    //Everybody growing older.
    World.prototype.growingOlder = function () {
        //Iterating from the end of the population array.
        for (var i_5 = this.population.length - 1; i_5 >= 0; i_5--) {
            if (this.population[i_5].growOlder() === false) {
                var position = this.population[i_5].getPosition();
                this.cell[position[0]][position[1]] = undefined;
                this.population.splice(i_5, 1);
            }
        }
    };
    //Function to render the world.
    World.prototype.render = function () {
        console.clear();
        //Iterate over the cells array.
        for (var h = 0; h < this.dimensions[1]; h++) {
            var line = "";
            for (var w = 0; w < this.dimensions[0]; w++) {
                //Check the current cell.
                var cell = this.cell[w][h];
                var age = 0;
                if (cell instanceof beings_1.Being) {
                    age = cell.getAge();
                }
                if (!cell) {
                    line += " ";
                }
                else if (cell instanceof beings_1.Ant) {
                    var ageIndex = Math.floor((age / 20) * (antChars.length - 1));
                    var char = antChars[ageIndex];
                    line += colorCharacter(char, 255 - 9 * age, 255 - 9 * age, 0);
                }
                else if (cell instanceof beings_1.DoodleBug) {
                    var ageIndex = Math.floor((age / 30) * (doodleBugChar.length - 1));
                    var char = doodleBugChar[ageIndex];
                    line += colorCharacter(char, 0, 255 - 7 * age, 255 - 7 * age);
                }
            }
            console.log(line);
        }
    };
    return World;
}());
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function colorCharacter(char, red, green, blue) {
    return "\u001B[38;2;".concat(red, ";").concat(green, ";").concat(blue, "m").concat(char, "\u001B[0m");
}
var aWorld = new World([200, 50]);
for (var i_6 = 0; i_6 < 100; i_6++) {
    aWorld.moveEverybody();
    aWorld.render();
    console.log(i_6);
}
var i = 0;
var maxIterations = 10000;
//Time based animation.
var interval = setInterval(function () {
    if (i >= maxIterations) {
        clearInterval(interval);
        return;
    }
    aWorld.moveEverybody();
    aWorld.growingOlder();
    aWorld.makingBabies();
    aWorld.render();
    aWorld.readPopulation();
    i++;
}, 100);
