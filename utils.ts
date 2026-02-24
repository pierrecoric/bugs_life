export function randomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function colorCharacter(char: string, red: number, green: number, blue: number): string {
    return `\x1b[38;2;${red};${green};${blue}m${char}\x1b[0m`;
}

