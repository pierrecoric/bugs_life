//Base class: Being.
abstract class Being {
    private species: string;
    private position: [number, number];
    private age: number;
    private lifeExpectancy: number;
    private life: number;
    private name: string;

    //constructor signatures:
    constructor();
    constructor(species: string, position: [number, number], age: number, lifeExpectancy: number, life: number, name: string);

    constructor(
        species: string = "",
        position: [number, number] = [0, 0],
        age: number = 0,
        lifeExpectancy: number = 0,
        life: number = 0,
        name: string = "Boris"
    ) {
        this.species = species;
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
        this.name = name;
    }

    setPosition(coordinates: [number, number]): void {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
    }

    getPosition(): [number, number] {
        return ([this.position[0], this.position[1]]);
    }

    getSpecies(): string {
        return this.species;
    }

    getAge(): number {
        return this.age;
    }

    getLife(): number {
        return this.life;
    }

    getLifeExpectancy(): number {
        return this.lifeExpectancy;
    }

    die(): boolean {
        return false;
    }

    growOlder(): boolean {
        this.age++;
        if (this.age > this.lifeExpectancy) {
            return this.die();
        } else { return true; }
    }

    getHit(hit: number): boolean {
        this.life -= hit;
        if (this.life <= 0) {
            return this.die();
        } else { return true; }
    }

    //[left, right, up, down]
    move(freeCells: [number, number][]): void {
        if (freeCells.length === 0) {
            return;
        }
        this.setPosition(freeCells[randomInterval(0, freeCells.length - 1)]);
    }

    sayHello(): void {
        console.log(`This is ${this.name} who is ${this.age} generations old in position ${this.position[0]}, ${this.position[1]}.`);
    }

}

//Ant class.
class Ant extends Being {
    private static readonly DEFAULT_LIFE: number = 10;
    private static readonly DEFAULT_LIFE_EXPECTANCY: number = 20;
    constructor(
        position?: [number, number],
        age?: number,
        name?: string
    ) {
        //How to add the string species?
        super("ANT", position ?? [0, 0], age ?? 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE, name ?? "Charlie");
    }
}

//Doodlebug Class.
class DoodleBug extends Being {
    private static readonly DEFAULT_LIFE: number = 20;
    private static readonly DEFAULT_LIFE_EXPECTANCY: number = 30;
    private starve: number;

    constructor(
        position?: [number, number],
        age?: number,
        name?: string,
        starve: number = 0
    ) {
        super("DOODLEBUG", position ?? [0, 0], age ?? 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE, name ?? "Magda");
        this.starve = starve;
    }

    starvation(hasEaten: boolean): boolean {
        if (!hasEaten) {
            this.starve++;
        }
        if (this.starve === 5) {
            return this.die()
        } else { return true; }
    }

}

function randomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export { Being, Ant, DoodleBug };
