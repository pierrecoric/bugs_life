"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var beings_1 = require("./beings");
var initialAmountAnts = 300;
var initialAmountBugs = 140;
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
        for (var i_1 = 0; i_1 < initialAmountAnts; i_1++) {
            var posx = randomInterval(0, this.dimensions[0] - 1);
            var posy = randomInterval(0, this.dimensions[1] - 1);
            var newAnt = new beings_1.Ant([posx, posy], 0, "Bogusława");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
                this.population.push(newAnt);
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
                this.population.push(newDoodleBug);
            }
            else {
                i_2--;
            }
        }
    };
    //Function to read the population
    World.prototype.readPopulation = function () {
        console.log(this.population.length);
        for (var i_3 = 0; i_3 < this.population.length; i_3++) {
            console.log(this.population[i_3]);
            console.log(this.population[i_3].getPosition());
        }
    };
    //Everybody move
    //[left, right, up, down]
    World.prototype.moveEverybody = function () {
        for (var i_4 = 0; i_4 < this.population.length; i_4++) {
            var left = true;
            var right = true;
            var up = true;
            var down = true;
            var position = this.population[i_4].getPosition();
            //check for edges.
            if (position[0] == 0) {
                left = false;
            }
            else if (this.cell[position[0] - 1][position[1]] != undefined) {
                left = false;
            }
            if (position[0] == this.dimensions[0] - 1) {
                right = false;
            }
            else if (this.cell[position[0] + 1][position[1]] != undefined) {
                right = false;
            }
            if (position[1] == 0) {
                up = false;
            }
            else if (this.cell[position[0]][position[1] - 1] != undefined) {
                up = false;
            }
            if (position[1] == this.dimensions[1] - 1) {
                down = false;
            }
            else if (this.cell[position[0]][position[1] + 1] != undefined) {
                down = false;
            }
            //move
            this.population[i_4].move([left, right, up, down]);
            this.cell[position[0]][position[1]] = undefined;
            var newPosition = this.population[i_4].getPosition();
            if (this.population[i_4] instanceof beings_1.Being) {
                var thisBeing = this.population[i_4];
                this.cell[newPosition[0]][newPosition[1]] = thisBeing;
            }
        }
    };
    //Everybody interacts
    //Everybody grow older
    //Everybody gets hungry
    //Function to render the world.
    World.prototype.render = function () {
        console.clear();
        for (var h = 0; h < this.dimensions[1]; h++) {
            var line = "";
            for (var w = 0; w < this.dimensions[0]; w++) {
                var cell = this.cell[w][h];
                if (!cell) {
                    line += " ";
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
var aWorld = new World([200, 50]);
for (var i_5 = 0; i_5 < 100; i_5++) {
    aWorld.moveEverybody();
    aWorld.render();
    console.log(i_5);
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
    aWorld.render();
    console.log(i);
    i++;
}, 200);
