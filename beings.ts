import { randomInterval } from "./utils";
import * as Constants from "./constants";

//Base class: Being.
abstract class Being {
    private species: string;
    private position: [number, number];
    private age: number;
    private lifeExpectancy: number;
    private life: number;
    private lastMove: [number, number];

    //Constructor signatures:
    constructor();
    constructor(species: string, position: [number, number], age: number, lifeExpectancy: number, life: number, lastMove: [number, number]);

    //The constructor
    constructor(
        species: string = "",
        position: [number, number] = [0, 0],
        age: number = 0,
        lifeExpectancy: number = 0,
        life: number = 0,
        lastMove: [number, number] = [0,0]
    ) {
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
        this.lastMove = lastMove;
    }

    //Modifiers:
    setPosition(coordinates: [number, number]): void {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    }

    setLastMove(coordinates: [number, number]): void {
        this.lastMove[0] = coordinates[0];
        this.lastMove[1] = coordinates[1];
    }

    //Accessors
    getSpecies(): string {
        return this.species;
    }

    getPosition(): [number, number] {
        return ([this.position[0], this.position[1]]);
    }

    getLastMove(): [number, number] {
        return ([this.lastMove[0], this.lastMove[1]]);
    }

    getAge(): number {
        return this.age;
    }

    getLifeExpectancy(): number {
        return this.lifeExpectancy;
    }

    //Return false when the being dies.
    die(): boolean {
        return false;
    }

    //Increments the age and return return false if the being has died.
    growOlder(): boolean {
        this.age++;
        if (this.age > this.lifeExpectancy) {
            return this.die();
        } else { return true; }
    }

    //Takes hit and return false if the being has died.
    getHit(hit: number): boolean {
        this.life -= hit;
        if (this.life <= 0) {
            return this.die();
        } else { return true; }
    }

    //Update the position to a random free cell around the being.
    move(freeCells: [number, number][]): void {
        if (freeCells.length === 0) {
            return;
        }
        const oldPosition: [number, number] = this.getPosition();
        const newPosition: [number, number] = freeCells[randomInterval(0, freeCells.length - 1)];
        this.setLastMove([oldPosition[0] - newPosition[0], oldPosition[1] - newPosition [1]]);
        this.setPosition(newPosition);
        console.log(this.lastMove);
    }

    //Tells you things about the being.
    sayHello(): void {
        console.log(`${this.age} generations old in position ${this.position[0]}, ${this.position[1]}.`);
    }
}

//Ant class.
class Ant extends Being {
    private static readonly DEFAULT_LIFE: number = Constants.antLife;
    private static readonly DEFAULT_LIFE_EXPECTANCY: number = Constants.antLifeExpectancy;
    constructor(
        position?: [number, number],
        age?: number,
    ) {
        super("ANT", position ?? [0, 0], age ?? 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE, [0,0]);
    }
}

//Doodlebug Class.
class DoodleBug extends Being {
    private static readonly DEFAULT_LIFE: number = Constants.doodleBugLife;
    private static readonly DEFAULT_LIFE_EXPECTANCY: number = Constants.doodleBugLifeExpectancy;
    private starve: number;
    private hasEaten: boolean;
    private isNewBorn: boolean;

    constructor(
        position?: [number, number],
        age?: number,
        starve: number = 0,
        hasEverEaten: boolean = false,
        isNewBorn: boolean = true
    ) {
        super("DOODLEBUG", position ?? [0, 0], age ?? 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE, [0,0]);
        this.starve = starve;
        this.hasEaten = hasEverEaten;
        this.isNewBorn = true;
    }

    resteStarve(): void {
        this.starve = 0;
    }

    getStarve(): number {
        return this.starve;
    }

    setHasEaten(): void {
        this.hasEaten = true;
    }

    getHasEaten(): boolean {
        return this.hasEaten;
    }

    notBaby(): void {
        this.isNewBorn = false;
    }

    isBaby(): boolean {
        return this.isNewBorn;
    }

    starvation(): boolean {
        this.starve++;
        if (this.starve === Constants.doodleBugStarvation) {
            return this.die()
        } else { return true; }
    }
}

export { Being, Ant, DoodleBug };