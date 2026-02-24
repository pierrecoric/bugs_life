"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoodleBug = exports.Ant = exports.Being = void 0;
var utils_1 = require("./utils");
var Constants = require("./constants");
//Base class: Being.
var Being = /** @class */ (function () {
    //The constructor
    function Being(species, position, age, lifeExpectancy, life, lastMove) {
        if (species === void 0) { species = ""; }
        if (position === void 0) { position = [0, 0]; }
        if (age === void 0) { age = 0; }
        if (lifeExpectancy === void 0) { lifeExpectancy = 0; }
        if (life === void 0) { life = 0; }
        if (lastMove === void 0) { lastMove = [0, 0]; }
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
        this.lastMove = lastMove;
    }
    //Modifiers:
    Being.prototype.setPosition = function (coordinates) {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    };
    Being.prototype.setLastMove = function (coordinates) {
        this.lastMove[0] = coordinates[0];
        this.lastMove[1] = coordinates[1];
    };
    //Accessors
    Being.prototype.getSpecies = function () {
        return this.species;
    };
    Being.prototype.getPosition = function () {
        return ([this.position[0], this.position[1]]);
    };
    Being.prototype.getLastMove = function () {
        return ([this.lastMove[0], this.lastMove[1]]);
    };
    Being.prototype.getAge = function () {
        return this.age;
    };
    Being.prototype.getLifeExpectancy = function () {
        return this.lifeExpectancy;
    };
    //Return false when the being dies.
    Being.prototype.die = function () {
        return false;
    };
    //Increments the age and return return false if the being has died.
    Being.prototype.growOlder = function () {
        this.age++;
        if (this.age > this.lifeExpectancy) {
            return this.die();
        }
        else {
            return true;
        }
    };
    //Takes hit and return false if the being has died.
    Being.prototype.getHit = function (hit) {
        this.life -= hit;
        if (this.life <= 0) {
            return this.die();
        }
        else {
            return true;
        }
    };
    //Update the position to a random free cell around the being.
    Being.prototype.move = function (freeCells) {
        if (freeCells.length === 0) {
            return;
        }
        var oldPosition = this.getPosition();
        var newPosition = freeCells[(0, utils_1.randomInterval)(0, freeCells.length - 1)];
        this.setLastMove([oldPosition[0] - newPosition[0], oldPosition[1] - newPosition[1]]);
        this.setPosition(newPosition);
        console.log(this.lastMove);
    };
    //Tells you things about the being.
    Being.prototype.sayHello = function () {
        console.log("".concat(this.age, " generations old in position ").concat(this.position[0], ", ").concat(this.position[1], "."));
    };
    return Being;
}());
exports.Being = Being;
//Ant class.
var Ant = /** @class */ (function (_super) {
    __extends(Ant, _super);
    function Ant(position, age) {
        return _super.call(this, "ANT", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE, [0, 0]) || this;
    }
    Ant.DEFAULT_LIFE = Constants.antLife;
    Ant.DEFAULT_LIFE_EXPECTANCY = Constants.antLifeExpectancy;
    return Ant;
}(Being));
exports.Ant = Ant;
//Doodlebug Class.
var DoodleBug = /** @class */ (function (_super) {
    __extends(DoodleBug, _super);
    function DoodleBug(position, age, starve, hasEverEaten, isNewBorn) {
        if (starve === void 0) { starve = 0; }
        if (hasEverEaten === void 0) { hasEverEaten = false; }
        if (isNewBorn === void 0) { isNewBorn = true; }
        var _this = _super.call(this, "DOODLEBUG", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE, [0, 0]) || this;
        _this.starve = starve;
        _this.hasEaten = hasEverEaten;
        _this.isNewBorn = true;
        return _this;
    }
    DoodleBug.prototype.resteStarve = function () {
        this.starve = 0;
    };
    DoodleBug.prototype.getStarve = function () {
        return this.starve;
    };
    DoodleBug.prototype.setHasEaten = function () {
        this.hasEaten = true;
    };
    DoodleBug.prototype.getHasEaten = function () {
        return this.hasEaten;
    };
    DoodleBug.prototype.notBaby = function () {
        this.isNewBorn = false;
    };
    DoodleBug.prototype.isBaby = function () {
        return this.isNewBorn;
    };
    DoodleBug.prototype.starvation = function () {
        this.starve++;
        if (this.starve === Constants.doodleBugStarvation) {
            return this.die();
        }
        else {
            return true;
        }
    };
    DoodleBug.DEFAULT_LIFE = Constants.doodleBugLife;
    DoodleBug.DEFAULT_LIFE_EXPECTANCY = Constants.doodleBugLifeExpectancy;
    return DoodleBug;
}(Being));
exports.DoodleBug = DoodleBug;
