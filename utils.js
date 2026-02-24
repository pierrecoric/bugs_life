"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInterval = randomInterval;
exports.colorCharacter = colorCharacter;
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function colorCharacter(char, red, green, blue) {
    return "\u001B[38;2;".concat(red, ";").concat(green, ";").concat(blue, "m").concat(char, "\u001B[0m");
}
