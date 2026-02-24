import { Being, DoodleBug, Ant } from "./beings";
import { randomInterval, colorCharacter } from "./utils";
import * as Constants from "./constants";

//World Class.
class World {
    private dimensions: [number, number];
    private cell: (Being | undefined)[][];
    private population: Being[];
    private antPopulation: Ant[];
    private doodleBugPopulation: DoodleBug[];

    //The constructor of the world.
    constructor(dimensions: [number, number]) {
        this.dimensions = dimensions;
        this.cell = [];
        for (let x = 0; x < dimensions[0]; x++) {
            const column: (Being | undefined)[] = [];
            for (let y = 0; y < dimensions[1]; y++) {
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
    placeBeing(newPosition: [number, number], newBeing: Being): void {
        //Check boundaries
        if (
            newPosition[0] < 0 ||
            newPosition[0] >= this.dimensions[0] ||
            newPosition[1] < 0 ||
            newPosition[1] > this.dimensions[1]
        ) {
            return;
        }
        else {
            this.cell[newPosition[0]][newPosition[1]] = newBeing;
            this.population.push(newBeing);
            if (newBeing instanceof Ant) {
                this.antPopulation.push(newBeing);
            }
            else if (newBeing instanceof DoodleBug) {
                this.doodleBugPopulation.push(newBeing);
            }
        }
    }

    //Function to kill a being.
    killBeing(index: number): void {
        const beingToKill: Being = this.population[index]
        const [x, y]: [number, number] = beingToKill.getPosition();
        this.cell[x][y] = undefined;
        this.population.splice(index, 1);
        if (beingToKill instanceof Ant) {
            const antIndex: number = this.antPopulation.indexOf(beingToKill);
            this.antPopulation.splice(antIndex, 1);
        }
        else if (beingToKill instanceof DoodleBug) {
            const doodleBugIndex = this.doodleBugPopulation.indexOf(beingToKill);
            this.doodleBugPopulation.splice(doodleBugIndex, 1);
        }
    }

    //Function to populate the world.
    initialize(): void {
        for (let i: number = 0; i < Constants.initialAmountAnts; i++) {
            const posx: number = randomInterval(0, this.dimensions[0] - 1);
            const posy: number = randomInterval(0, this.dimensions[1] - 1);
            const newAnt: Ant = new Ant([posx, posy]);
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
            } else { i--; }
        }
        for (let i: number = 0; i < Constants.initialAmountDoodleBugs; i++) {
            const posx: number = randomInterval(0, this.dimensions[0] - 1);
            const posy: number = randomInterval(0, this.dimensions[1] - 1);
            const newDoodleBug: DoodleBug = new DoodleBug([posx, posy]);
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
            } else { i--; }
        }
    }

    //Function to read the size of the population
    readPopulation(): void {
        console.log(`This world comprises of ${this.population.length} beings of which ${this.antPopulation.length} are ants and ${this.doodleBugPopulation.length} are doodlebugs.`);
    }

    //Returns an array of beings from a location.
    private getNeighbors(x: number, y: number): Being[] {
        let neighbors: Being[] = [];
        for (let dx: number = -1; dx <= 1; dx++) {
            for (let dy: number = -1; dy <= 1; dy++) {
                //checking the cell itself.
                if (dx === 0 && dy === 0) continue;
                const nx: number = x + dx;
                const ny: number = y + dy;
                if (
                    nx >= 0 &&
                    nx < this.dimensions[0] &&
                    ny >= 0 &&
                    ny < this.dimensions[1]
                ) {
                    if (this.cell[nx][ny] instanceof Being)
                        neighbors.push(this.cell[nx][ny]);
                }
            }
        }
        return neighbors;
    }

    //Return an array of valid coordinate for free cells around a given point.
    private getFreeCells(x: number, y: number): [number, number][] {
        let freeCells: [number, number][] = [];
        for (let dx: number = -1; dx <= 1; dx++) {
            for (let dy: number = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx: number = x + dx;
                const ny: number = y + dy;
                if (
                    nx >= 0 &&
                    nx < this.dimensions[0] &&
                    ny >= 0 &&
                    ny < this.dimensions[1]
                ) {
                    if (this.cell[nx][ny] === undefined) {
                        const coordinates: [number, number] = [nx, ny];
                        freeCells.push(coordinates);
                    }
                }
            }
        }
        return freeCells;
    }

    //Everybody move
    moveEverybody(): void {
        for (let i: number = 0; i < this.population.length; i++) {
            const [x, y]: [number, number] = this.population[i].getPosition();
            const freeCells: [number, number][] = this.getFreeCells(x, y);
            //move
            this.population[i].move(freeCells);
            this.cell[x][y] = undefined;
            const newPosition: [number, number] = this.population[i].getPosition();
            if (this.population[i] instanceof Being) {
                const thisBeing: Being = this.population[i];
                this.cell[newPosition[0]][newPosition[1]] = thisBeing;
            }
        }
    }

    //Doodlebugs eat ants or get hungry.
    feedTheDoodleBugs(): void {
        for (let i: number = 0; i < this.doodleBugPopulation.length; i++) {
            const hungryBug = this.doodleBugPopulation[i];
            const [x, y]: [number, number] = hungryBug.getPosition();
            const neighbors: Being[] = this.getNeighbors(x, y);
            let availableAnts: Ant[] = [];
            for (let b: number = 0; b < neighbors.length; b++) {
                if (neighbors[b] instanceof Ant) {
                    availableAnts.push(neighbors[b]);
                }
            }
            if (availableAnts.length > 0) {
                hungryBug.resteStarve();
                hungryBug.setHasEaten();
                hungryBug.notBaby();
                const antToKill: Ant = availableAnts[randomInterval(0, availableAnts.length - 1)];
                const index: number = this.population.indexOf(antToKill);
                this.killBeing(index);
            }
            else {
                if (!hungryBug.starvation()) {
                    const index: number = this.population.indexOf(hungryBug);
                    this.killBeing(index);
                }
            }
        }
    }


    //Beings are making babies.
    makingBabies(): void {
        //Iterate over the population.
        for (let i: number = 0; i < this.population.length; i++) {
            //Get the position of the current being.
            const [x, y]: [number, number] = this.population[i].getPosition();
            const neighbors: Being[] = this.getNeighbors(x, y);

            //If the current being only has a neighbor
            if (neighbors.length === 1) {

                //Get the species and ages of both beings.
                const beingA: Being = this.population[i];
                const beingB: Being = neighbors[0];

                //If both beings are of the same species and old enough to have babies and not too old to have babies.
                if (
                    beingA.getSpecies() === beingB.getSpecies() &&
                    beingA.getAge() > beingA.getLifeExpectancy() / Constants.maturityDivider &&
                    beingB.getAge() > beingB.getLifeExpectancy() / Constants.maturityDivider &&
                    beingA.getAge() < beingA.getLifeExpectancy() - beingA.getLifeExpectancy() / Constants.oldAgeDivider &&
                    beingB.getAge() < beingB.getLifeExpectancy() - beingB.getLifeExpectancy() / Constants.oldAgeDivider
                ) {
                    //Define wheter babies are being made
                    let letsMakeBabies: boolean = false;

                    if (beingA instanceof Ant) {
                        const dice: number = randomInterval(0, 100);
                        if (dice < Constants.antReproductionLikelihood) {
                            letsMakeBabies = true;
                        }
                    }
                    else if (beingA instanceof DoodleBug && beingB instanceof DoodleBug) {
                        const dice: number = randomInterval(0, 100);
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
                        const freeCells: [number, number][] = this.getFreeCells(x, y);
                        const babyCell: [number, number] = freeCells[randomInterval(0, freeCells.length - 1)];
                        if (beingA.getSpecies() === "ANT") {
                            const newAnt: Ant = new Ant(babyCell);
                            this.placeBeing(newAnt.getPosition(), newAnt);
                        }
                        else {
                            const newDoodleBug: DoodleBug = new DoodleBug(babyCell);
                            this.placeBeing(newDoodleBug.getPosition(), newDoodleBug);
                        }
                    }
                }
            }
        }
    }

    //Everybody growing older.
    growingOlder(): void {
        //Iterating from the end of the population array.
        for (let i: number = this.population.length - 1; i >= 0; i--) {
            if (this.population[i].growOlder() === false) {
                this.killBeing(i);
            }
        }
    }

    //Function to render the world.
    render(): void {
        console.clear();
        //Iterate over the cells array.
        for (let h: number = 0; h < this.dimensions[1]; h++) {
            let line: string = "";
            for (let w: number = 0; w < this.dimensions[0]; w++) {
                //Check the current cell.
                const cell = this.cell[w][h];
                let age: number = 0;
                if (cell instanceof Being) {
                    age = cell.getAge();
                }
                //If cell is undefined.
                if (!cell) {
                    line += " ";
                }
                else if (cell instanceof Ant) {
                    const ageIndex: number = Math.floor((age / Constants.antLifeExpectancy) * (Constants.antChars.length - 1));
                    const char: string = Constants.antChars[ageIndex];
                    line += colorCharacter(char, 255 - 9 * age, 255 - 9 * age, 0);
                }
                else if (cell instanceof DoodleBug) {
                    const ageIndex: number = Math.floor((age / Constants.doodleBugLifeExpectancy) * (Constants.doodleBugChar.length - 1));
                    const char: string = Constants.doodleBugChar[ageIndex];
                    line += colorCharacter(char, 2 * age, 2 * age, 255);
                }
            }
            console.log(line);
        }
    }

    aNewDayInTheWorld(): void {
        aWorld.moveEverybody();
        aWorld.growingOlder();
        aWorld.makingBabies();
        aWorld.feedTheDoodleBugs();
        aWorld.render();
    }
}

//Initialize a world.
const aWorld: World = new World([200, 55]);

//Time based animation.
let i: number = 0;
const maxIterations: number = 1000000;
const interval = setInterval(() => {
    if (i >= maxIterations) {
        clearInterval(interval);
        return;
    }
    aWorld.aNewDayInTheWorld();
    aWorld.readPopulation();
    i++;
}, 100);