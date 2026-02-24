import { Being, DoodleBug, Ant } from "./beings";

const initialAmountAnts: number = 200;
const initialAmountBugs: number = 80;
const antReproductionLikelihood: number = 10 - 9;
const doodleBugReproductionLikelihood: number = 10 - 8;

const antChars: string[] = [".", "o", "O", "0", "8"];
const doodleBugChar: string[] = ["-", "x", "X", "F", "E", "#"];

//World Class.
class World {
    private dimensions: [number, number];
    private cell: (Being | undefined)[][];
    private population: Being[];

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
        this.initialize();
    }

    //Function to put a being into place.
    placeBeing(newPosition: [number, number], guy: Being): void {
        if (newPosition[0] > this.dimensions[0] || newPosition[1] > this.dimensions[1]) {
            return;
        }
        else {
            this.cell[newPosition[0]][newPosition[1]] = guy;
            this.population.push(guy);
        }
    }

    //Function to populate the world.
    initialize(): void {
        for (let i: number = 0; i < initialAmountAnts; i++) {
            const posx: number = randomInterval(0, this.dimensions[0] - 1);
            const posy: number = randomInterval(0, this.dimensions[1] - 1);
            const newAnt: Ant = new Ant([posx, posy], 0, "Bogusława");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newAnt);
            } else { i--; }
        }
        for (let i: number = 0; i < initialAmountBugs; i++) {
            const posx: number = randomInterval(0, this.dimensions[0] - 1);
            const posy: number = randomInterval(0, this.dimensions[1] - 1);
            const newDoodleBug: DoodleBug = new DoodleBug([posx, posy], 0, "Zbigniew");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
            } else { i--; }
        }
    }

    //Function to read the population
    readPopulation(): void {
        console.log(this.population.length);
    }


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
    //[left, right, up, down]
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

    //Doodlebugs eat ants.

    //Everybody gets hungry.

    //Everybody is making babies. Rule: if exactly two of the same beings are next to eachOther,
    //they have one chance out of three to make a baby. The baby appears in one of the free spots around them.

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
                    beingA.getAge() > beingA.getLifeExpectancy() / 8 &&
                    beingB.getAge() > beingB.getLifeExpectancy() / 8 &&
                    beingA.getAge() < beingA.getLifeExpectancy() - beingA.getLifeExpectancy() / 5 &&
                    beingB.getAge() < beingB.getLifeExpectancy() - beingB.getLifeExpectancy() / 5
                ) {
                    //Define wheter babies are being made
                    let letsMakeBabies: boolean = false;
                    if (beingA.getSpecies() === "ANT") {
                        const dice: number = randomInterval(0, antReproductionLikelihood);
                        if (dice === 0) {
                            letsMakeBabies = true;
                        }
                    }
                    else {
                        const dice: number = randomInterval(0, doodleBugReproductionLikelihood);
                        if (dice === 0) {
                            letsMakeBabies = true;
                        }
                    }

                    if (letsMakeBabies) {
                        const freeCells: [number, number][] = this.getFreeCells(x, y);
                        const babyCell: [number, number] = freeCells[randomInterval(0, freeCells.length - 1)];
                        if (beingA.getSpecies() === "ANT") {
                            const newAnt: Ant = new Ant(babyCell, 0, "Jamnicek");
                            this.placeBeing(newAnt.getPosition(), newAnt);
                        }
                        else {
                            const newDoodleBug: DoodleBug = new DoodleBug(babyCell, 0, "Jamnicek");
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
                const position: [number, number] = this.population[i].getPosition();
                this.cell[position[0]][position[1]] = undefined;
                this.population.splice(i, 1);
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
                if(cell instanceof Being) {
                    age = cell.getAge();
                }
                if (!cell) {
                    line += " ";
                }
                else if (cell instanceof Ant) {
                    const ageIndex: number = Math.floor((age / 20) * (antChars.length - 1));
                    const char: string = antChars[ageIndex];
                    line += colorCharacter(char, 255 - 9 * age, 255 - 9 * age, 0);
                }
                else if (cell instanceof DoodleBug) {
                    const ageIndex: number = Math.floor((age / 30) * (doodleBugChar.length - 1));
                    const char: string = doodleBugChar[ageIndex];
                    line += colorCharacter(char, 0, 255 - 7 * age, 255 - 7 * age);
                }
            }
            console.log(line);
        }
    }
}

function randomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function colorCharacter(char: string, red: number, green: number, blue: number): string {
    return `\x1b[38;2;${red};${green};${blue}m${char}\x1b[0m`;
}

const aWorld: World = new World([200, 50]);

for (let i: number = 0; i < 100; i++) {
    aWorld.moveEverybody();
    aWorld.render();
    console.log(i);
}

let i: number = 0;
const maxIterations: number = 10000;

//Time based animation.
const interval = setInterval(() => {
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


