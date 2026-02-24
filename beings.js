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
    function Being(species, position, age, lifeExpectancy, life) {
        if (species === void 0) { species = ""; }
        if (position === void 0) { position = [0, 0]; }
        if (age === void 0) { age = 0; }
        if (lifeExpectancy === void 0) { lifeExpectancy = 0; }
        if (life === void 0) { life = 0; }
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
    }
    //Modifiers:
    Being.prototype.setPosition = function (coordinates) {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    };
    //Accessors
    Being.prototype.getSpecies = function () {
        return this.species;
    };
    Being.prototype.getPosition = function () {
        return ([this.position[0], this.position[1]]);
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
        this.setPosition(freeCells[(0, utils_1.randomInterval)(0, freeCells.length - 1)]);
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
        return _super.call(this, "ANT", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE) || this;
    }
    Ant.DEFAULT_LIFE = Constants.antLife;
    Ant.DEFAULT_LIFE_EXPECTANCY = Constants.antLifeExpectancy;
    return Ant;
}(Being));
exports.Ant = Ant;
//Doodlebug Class.
var DoodleBug = /** @class */ (function (_super) {
    __extends(DoodleBug, _super);
    function DoodleBug(position, age, starve) {
        if (starve === void 0) { starve = 0; }
        var _this = _super.call(this, "DOODLEBUG", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE) || this;
        _this.starve = starve;
        return _this;
    }
    DoodleBug.prototype.starvation = function (hasEaten) {
        if (!hasEaten) {
            this.starve++;
        }
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
