"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var beings_1 = require("./beings");
var utils_1 = require("./utils");
var Constants = require("./constants");
//World Class.
var World = /** @class */ (function () {
    //The constructor of the world.
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
        this.antPopulation = [];
        this.doodleBugPopulation = [];
        this.initialize();
    }
    //Function to put a being into place.
    World.prototype.placeBeing = function (newPosition, newBeing) {
        //Check boundaries
        if (newPosition[0] < 0 ||
            newPosition[0] >= this.dimensions[0] ||
            newPosition[1] < 0 ||
            newPosition[1] > this.dimensions[1]) {
            return;
        }
        else {
            this.cell[newPosition[0]][newPosition[1]] = newBeing;
            this.population.push(newBeing);
            if (newBeing instanceof beings_1.Ant) {
                this.antPopulation.push(newBeing);
            }
            else if (newBeing instanceof beings_1.DoodleBug) {
                this.doodleBugPopulation.push(newBeing);
            }
        }
    };
    //Function to kill a being.
    World.prototype.killBeing = function (index) {
        var beingToKill = this.population[index];
        var _a = beingToKill.getPosition(), x = _a[0], y = _a[1];
        this.cell[x][y] = undefined;
        this.population.splice(index, 1);
        if (beingToKill instanceof beings_1.Ant) {
            var antIndex = this.antPopulation.indexOf(beingToKill);
            this.antPopulation.splice(antIndex, 1);
        }
        else if (beingToKill instanceof beings_1.DoodleBug) {
            var doodleBugIndex = this.doodleBugPopulation.indexOf(beingToKill);
            this.doodleBugPopulation.splice(doodleBugIndex, 1);
        }
    };
    //Function to populate the world.
    World.prototype.initialize = function () {
        for (var i_1 = 0; i_1 < Constants.initialAmountAnts; i_1++) {
            var posx = (0, utils_1.randomInterval)(0, this.dimensions[0] - 1);
            var posy = (0, utils_1.randomInterval)(0, this.dimensions[1] - 1);
            var newAnt = new beings_1.Ant([posx, posy]);
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
            }
            else {
                i_1--;
            }
        }
        for (var i_2 = 0; i_2 < Constants.initialAmountDoodleBugs; i_2++) {
            var posx = (0, utils_1.randomInterval)(0, this.dimensions[0] - 1);
            var posy = (0, utils_1.randomInterval)(0, this.dimensions[1] - 1);
            var newDoodleBug = new beings_1.DoodleBug([posx, posy]);
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
            }
            else {
                i_2--;
            }
        }
    };
    //Function to read the size of the population
    World.prototype.readPopulation = function () {
        console.log("This world comprises of ".concat(this.population.length, " beings of which ").concat(this.antPopulation.length, " are ants and ").concat(this.doodleBugPopulation.length, " are doodlebugs."));
    };
    //Returns an array of beings from a location.
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
    //Return an array of valid coordinate for free cells around a given point.
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
    //Doodlebugs eat ants or get hungry.
    World.prototype.feedTheDoodleBugs = function () {
        for (var i_4 = 0; i_4 < this.doodleBugPopulation.length; i_4++) {
            var hungryBug = this.doodleBugPopulation[i_4];
            var _a = hungryBug.getPosition(), x = _a[0], y = _a[1];
            var neighbors = this.getNeighbors(x, y);
            var availableAnts = [];
            for (var b = 0; b < neighbors.length; b++) {
                if (neighbors[b] instanceof beings_1.Ant) {
                    availableAnts.push(neighbors[b]);
                }
            }
            if (availableAnts.length > 0) {
                hungryBug.resteStarve();
                hungryBug.setHasEaten();
                hungryBug.notBaby();
                var antToKill = availableAnts[(0, utils_1.randomInterval)(0, availableAnts.length - 1)];
                var index = this.population.indexOf(antToKill);
                this.killBeing(index);
            }
            else {
                if (!hungryBug.starvation()) {
                    var index = this.population.indexOf(hungryBug);
                    this.killBeing(index);
                }
            }
        }
    };
    //Beings are making babies.
    World.prototype.makingBabies = function () {
        //Iterate over the population.
        for (var i_5 = 0; i_5 < this.population.length; i_5++) {
            //Get the position of the current being.
            var _a = this.population[i_5].getPosition(), x = _a[0], y = _a[1];
            var neighbors = this.getNeighbors(x, y);
            //If the current being only has a neighbor
            if (neighbors.length === 1) {
                //Get the species and ages of both beings.
                var beingA = this.population[i_5];
                var beingB = neighbors[0];
                //If both beings are of the same species and old enough to have babies and not too old to have babies.
                if (beingA.getSpecies() === beingB.getSpecies() &&
                    beingA.getAge() > beingA.getLifeExpectancy() / Constants.maturityDivider &&
                    beingB.getAge() > beingB.getLifeExpectancy() / Constants.maturityDivider &&
                    beingA.getAge() < beingA.getLifeExpectancy() - beingA.getLifeExpectancy() / Constants.oldAgeDivider &&
                    beingB.getAge() < beingB.getLifeExpectancy() - beingB.getLifeExpectancy() / Constants.oldAgeDivider) {
                    //Define wheter babies are being made
                    var letsMakeBabies = false;
                    if (beingA instanceof beings_1.Ant) {
                        var dice = (0, utils_1.randomInterval)(0, 100);
                        if (dice < Constants.antReproductionLikelihood) {
                            letsMakeBabies = true;
                        }
                    }
                    else if (beingA instanceof beings_1.DoodleBug && beingB instanceof beings_1.DoodleBug) {
                        var dice = (0, utils_1.randomInterval)(0, 100);
                        if (dice < Constants.doodleBugReproductionLikelihood) {
                            letsMakeBabies = true;
                        }
                        if (beingA.getStarve() > Constants.doodleBugStarvationTresholdReproduction || beingB.getStarve() > Constants.doodleBugStarvationTresholdReproduction) {
                            letsMakeBabies = false;
                        }
                        if (beingA.isBaby() || beingB.isBaby()) {
                            letsMakeBabies = false;
                        }
                    }
                    if (letsMakeBabies) {
                        var freeCells = this.getFreeCells(x, y);
                        var babyCell = freeCells[(0, utils_1.randomInterval)(0, freeCells.length - 1)];
                        if (beingA.getSpecies() === "ANT") {
                            var newAnt = new beings_1.Ant(babyCell);
                            this.placeBeing(newAnt.getPosition(), newAnt);
                        }
                        else {
                            var newDoodleBug = new beings_1.DoodleBug(babyCell);
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
        for (var i_6 = this.population.length - 1; i_6 >= 0; i_6--) {
            if (this.population[i_6].growOlder() === false) {
                this.killBeing(i_6);
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
                //If cell is undefined.
                if (!cell) {
                    line += " ";
                }
                else if (cell instanceof beings_1.Ant) {
                    var ageIndex = Math.floor((age / Constants.antLifeExpectancy) * (Constants.antChars.length - 1));
                    var char = Constants.antChars[ageIndex];
                    line += (0, utils_1.colorCharacter)(char, 255 - 9 * age, 255 - 9 * age, 0);
                }
                else if (cell instanceof beings_1.DoodleBug) {
                    var ageIndex = Math.floor((age / Constants.doodleBugLifeExpectancy) * (Constants.doodleBugChar.length - 1));
                    var char = Constants.doodleBugChar[ageIndex];
                    line += (0, utils_1.colorCharacter)(char, 2 * age, 2 * age, 255);
                }
            }
            console.log(line);
        }
    };
    World.prototype.aNewDayInTheWorld = function () {
        aWorld.moveEverybody();
        aWorld.growingOlder();
        aWorld.makingBabies();
        aWorld.feedTheDoodleBugs();
        aWorld.render();
    };
    return World;
}());
//Initialize a world.
var aWorld = new World([200, 55]);
//Time based animation.
var i = 0;
var maxIterations = 1000000;
var interval = setInterval(function () {
    if (i >= maxIterations) {
        clearInterval(interval);
        return;
    }
    aWorld.aNewDayInTheWorld();
    aWorld.readPopulation();
    i++;
}, 100);
