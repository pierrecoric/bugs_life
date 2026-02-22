"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var beings_1 = require("./beings");
var initialAmountAnts = 40;
var initialAmountBugs = 16;
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
        }
    };
    //Function to populate the world.
    World.prototype.initialize = function () {
        for (var i = 0; i < initialAmountAnts; i++) {
            var posx = randomInterval(0, this.dimensions[0] - 1);
            var posy = randomInterval(0, this.dimensions[1] - 1);
            var newAnt = new beings_1.Ant([posx, posy], 0, "Bogusława");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
                this.population.push(newAnt);
            }
            else {
                i--;
            }
        }
        for (var i = 0; i < initialAmountBugs; i++) {
            var posx = randomInterval(0, this.dimensions[0] - 1);
            var posy = randomInterval(0, this.dimensions[1] - 1);
            var newDoodleBug = new beings_1.DoodleBug([posx, posy], 0, "Zbigniew");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
                this.population.push(newDoodleBug);
            }
            else {
                i--;
            }
        }
    };
    //Function to read the population
    World.prototype.readPopulation = function () {
        console.log(this.population.length);
        for (var i = 0; i < this.population.length; i++) {
            console.log(this.population[i]);
            console.log(this.population[i].getPosition());
        }
    };
    //Function to render the world.
    World.prototype.render = function () {
        console.clear();
        for (var h = 0; h < this.dimensions[1]; h++) {
            var line = "";
            for (var w = 0; w < this.dimensions[0]; w++) {
                var cell = this.cell[w][h];
                if (!cell) {
                    line += ".";
                }
                else if (cell instanceof beings_1.Ant) {
                    line += "\x1b[36mX\x1b[0m";
                }
                else if (cell instanceof beings_1.DoodleBug) {
                    line += "\x1b[31m#\x1b[0m";
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
var aWorld = new World([30, 30]);
aWorld.render();
aWorld.readPopulation();
