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
//Base class: Being.
var Being = /** @class */ (function () {
    function Being(species, position, age, lifeExpectancy, life, name) {
        if (species === void 0) { species = ""; }
        if (position === void 0) { position = [0, 0]; }
        if (age === void 0) { age = 0; }
        if (lifeExpectancy === void 0) { lifeExpectancy = 0; }
        if (life === void 0) { life = 0; }
        if (name === void 0) { name = "Boris"; }
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
        this.name = name;
    }
    Being.prototype.setPosition = function (coordinates) {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    };
    Being.prototype.getPosition = function () {
        return ([this.position[0], this.position[1]]);
    };
    Being.prototype.getSpecies = function () {
        return this.species;
    };
    Being.prototype.getAge = function () {
        return this.age;
    };
    Being.prototype.getLife = function () {
        return this.life;
    };
    Being.prototype.getLifeExpectancy = function () {
        return this.lifeExpectancy;
    };
    Being.prototype.die = function () {
        return false;
    };
    Being.prototype.growOlder = function () {
        this.age++;
        if (this.age > this.lifeExpectancy) {
            return this.die();
        }
        else {
            return true;
        }
    };
    Being.prototype.getHit = function (hit) {
        this.life -= hit;
        if (this.life <= 0) {
            return this.die();
        }
        else {
            return true;
        }
    };
    //[left, right, up, down]
    Being.prototype.move = function (freeCells) {
        if (freeCells.length === 0) {
            return;
        }
        this.setPosition(freeCells[randomInterval(0, freeCells.length - 1)]);
    };
    Being.prototype.sayHello = function () {
        console.log("This is ".concat(this.name, " who is ").concat(this.age, " generations old in position ").concat(this.position[0], ", ").concat(this.position[1], "."));
    };
    return Being;
}());
exports.Being = Being;
//Ant class.
var Ant = /** @class */ (function (_super) {
    __extends(Ant, _super);
    function Ant(position, age, name) {
        //How to add the string species?
        return _super.call(this, "ANT", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE, name !== null && name !== void 0 ? name : "Charlie") || this;
    }
    Ant.DEFAULT_LIFE = 10;
    Ant.DEFAULT_LIFE_EXPECTANCY = 20;
    return Ant;
}(Being));
exports.Ant = Ant;
//Doodlebug Class.
var DoodleBug = /** @class */ (function (_super) {
    __extends(DoodleBug, _super);
    function DoodleBug(position, age, name, starve) {
        if (starve === void 0) { starve = 0; }
        var _this = _super.call(this, "DOODLEBUG", position !== null && position !== void 0 ? position : [0, 0], age !== null && age !== void 0 ? age : 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE, name !== null && name !== void 0 ? name : "Magda") || this;
        _this.starve = starve;
        return _this;
    }
    DoodleBug.prototype.starvation = function (hasEaten) {
        if (!hasEaten) {
            this.starve++;
        }
        if (this.starve === 5) {
            return this.die();
        }
        else {
            return true;
        }
    };
    DoodleBug.DEFAULT_LIFE = 20;
    DoodleBug.DEFAULT_LIFE_EXPECTANCY = 30;
    return DoodleBug;
}(Being));
exports.DoodleBug = DoodleBug;
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
