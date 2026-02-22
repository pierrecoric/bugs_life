//Base class: Being.
class Being {
    private position: [number, number];
    private age: number;
    private lifeExpectancy: number;
    private life: number;
    private name: string;

    //constructor signatures:
    constructor();
    constructor(position: [number, number], age: number, lifeExpectancy: number, life: number, name: string);

    constructor(
        position: [number, number] = [0, 0],
        age: number = 0,
        lifeExpectancy: number = 0,
        life: number = 0,
        name: string = "Boris"
    ) {
        this.position = position;
        this.age = age;
        this.lifeExpectancy = lifeExpectancy;
        this.life = life;
        this.name = name;
    }

    setPosition(x: number, y: number): void {
        this.position[0] = x;
        this.position[1] = y;
    }

    getPosition(): [number, number] {
        return ([this.position[0], this.position[1]]);
    }

    die(): number {
        return 1;
    }

    growOlder(): number {
        this.age++;
        if (this.age > this.lifeExpectancy) {
            return this.die();
        } else { return 0; }
    }

    getHit(hit: number): number {
        this.life -= hit;
        if (this.life <= 0) {
            return this.die();
        } else { return 0; }
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
        super(position ?? [0, 0], age ?? 0, Ant.DEFAULT_LIFE_EXPECTANCY, Ant.DEFAULT_LIFE, name ?? "Charlie");
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
        super(position ?? [0, 0], age ?? 0, DoodleBug.DEFAULT_LIFE_EXPECTANCY, DoodleBug.DEFAULT_LIFE, name ?? "Magda");
        this.starve = starve;
    }
}

export { Being, Ant, DoodleBug };