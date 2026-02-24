import { randomInterval } from "./utils";
import * as Constants from "./constants";

//Base class: Being.
abstract class Being {
    private species: string;
    private position: [number, number];
    private age: number;
    private lifeExpectancy: number;
    private life: number;

    //Constructor signatures:
    constructor();
    constructor(species: string, position: [number, number], age: number, lifeExpectancy: number, life: number);

    //The constructor
    constructor(
        species: string = "",
        position: [number, number] = [0, 0],
        age: number = 0,
        lifeExpectancy: number = 0,
        life: number = 0
    ) {
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
    }

    //Modifiers:
    setPosition(coordinates: [number, number]): void {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    }

    //Accessors
    getSpecies(): string {
        return this.species;
    }

    getPosition(): [number, number] {
        return ([this.position[0], this.position[1]]);
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
        this.setPosition(freeCells[randomInterval(0, freeCells.length - 1)]);
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
        super("ANT", position ?? [0, 0], age ?? 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE);
    }
}

//Doodlebug Class.
class DoodleBug extends Being {
    private static readonly DEFAULT_LIFE: number = Constants.doodleBugLife;
    private static readonly DEFAULT_LIFE_EXPECTANCY: number = Constants.doodleBugLifeExpectancy;
    private starve: number;

    constructor(
        position?: [number, number],
        age?: number,
        starve: number = 0
    ) {
        super("DOODLEBUG", position ?? [0, 0], age ?? 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE);
        this.starve = starve;
    }

    starvation(hasEaten: boolean): boolean {
        if (!hasEaten) {
            this.starve++;
        }
        if (this.starve === Constants.doodleBugStarvation) {
            return this.die()
        } else { return true; }
    }
}

export { Being, Ant, DoodleBug };