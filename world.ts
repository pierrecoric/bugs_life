import { Being, DoodleBug, Ant } from "./beings";

const initialAmountAnts: number = 300;
const initialAmountBugs: number = 140;

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
                this.population.push(newAnt);
            } else { i--; }
        }
        for (let i: number = 0; i < initialAmountBugs; i++) {
            const posx: number = randomInterval(0, this.dimensions[0] - 1);
            const posy: number = randomInterval(0, this.dimensions[1] - 1);
            const newDoodleBug: DoodleBug = new DoodleBug([posx, posy], 0, "Zbigniew");
            if (!this.cell[posx][posy]) {
                this.placeBeing([posx, posy], newDoodleBug);
                this.population.push(newDoodleBug);
            } else { i--; }
        }
    }

    //Function to read the population
    readPopulation(): void {
        console.log(this.population.length);
        for (let i: number = 0; i < this.population.length; i++) {
            console.log(this.population[i]);
            console.log(this.population[i].getPosition());
        }
    }

    //Everybody move
    //[left, right, up, down]
    moveEverybody(): void {
        for (let i: number = 0; i < this.population.length; i++) {
            let left: boolean = true;
            let right: boolean = true;
            let up: boolean = true;
            let down: boolean = true;
            const position: [number, number] = this.population[i].getPosition();
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
            this.population[i].move([left, right, up, down]);
            this.cell[position[0]][position[1]] = undefined;
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

    /*
    OXX
    XXX
    XXX
    */

    makingBabies(): void {
        let newBorns: Being[] = [];
        for (let i: number = 0; i < this.population.length; i++) {
            const position: [number, number] = this.population[i].getPosition();
            const x: number = position[0];
            const y: number = position[1];

            //Defining some booleans for the edge cases.
            let neighbors: (Being | undefined)[] = [];
            let isLeft: boolean = false;
            let isRight: boolean = false;
            let isUp: boolean = false;
            let isDown: boolean = false;
            if (x === 0) { isLeft = true; }
            if (x === this.dimensions[0] - 1) { isRight = true; }
            if (y === 0) { isUp = true; }
            if (y === this.dimensions[1] - 1) { isDown = true; }

            
            if(isUp) {

                /*
                OX
                XX
                */
                if(isLeft){

                }

                /*
                XO
                XX
                */
                else if(isRight) {

                }

                /*
                XOX
                XXX
                */
                else {

                }
            }
            else if(isDown) {

                /*
                XX
                0X
                */
                if(isLeft) {

                }

                /*
                XX
                XO
                */
                else if (isRight) {

                }

                /*
                XXX
                XOX
                */
                else {
                    neighbors.push(this.cell[x - 1][y - 1]);
                    neighbors.push(this.cell[x - 1][y]);
                    neighbors.push(this.cell[x][y - 1]);
                    neighbors.push(this.cell[x + 1][y - 1]);
                    neighbors.push(this.cell[x + 1][y]);

                }
            }

            /*
            XX
            OX
            XX
            */
            else if (!isUp && ! isDown && isLeft) {
                neighbors.push(this.cell[x][y - 1]);
                neighbors.push(this.cell[x][y + 1]);
                neighbors.push(this.cell[x + 1][y - 1]);
                neighbors.push(this.cell[x + 1][y]);
                neighbors.push(this.cell[x + 1][y + 1]);
            }

            /*
            XX
            XO
            XX
            */
            else if (!isUp && ! isDown && isRight) {
                neighbors.push(this.cell[x - 1][y - 1]);
                neighbors.push(this.cell[x - 1][y]);
                neighbors.push(this.cell[x - 1][y + 1]);
                neighbors.push(this.cell[x][y - 1]);
                neighbors.push(this.cell[x][y + 1]);
            
            }

            /*
            XXX
            XOX
            XXX
            */
            else {
                neighbors.push(this.cell[x - 1][y - 1]);
                neighbors.push(this.cell[x - 1][y]);
                neighbors.push(this.cell[x - 1][y + 1]);
                neighbors.push(this.cell[x][y - 1]);
                neighbors.push(this.cell[x][y + 1]);
                neighbors.push(this.cell[x + 1][y - 1]);
                neighbors.push(this.cell[x + 1][y]);
                neighbors.push(this.cell[x + 1][y + 1]);
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
        for (let h: number = 0; h < this.dimensions[1]; h++) {
            let line: string = "";
            for (let w: number = 0; w < this.dimensions[0]; w++) {
                const cell = this.cell[w][h];
                if (!cell) {
                    line += " ";
                }
                else if (cell instanceof Ant) {
                    line += "\x1b[36mX\x1b[0m";
                }
                else if (cell instanceof DoodleBug) {
                    line += "\x1b[31m#\x1b[0m";
                }
            }
            console.log(line);
        }
    }
}

function randomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    aWorld.render();
    console.log(i);
    i++;
}, 100);
