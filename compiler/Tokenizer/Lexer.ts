import { Token } from "./Token";

export class Lexer {
    //
}

export function tokenize(input: string): ReadonlyArray<Token> {
    let idx: number = 0;
    const tokens: Token[] = [];

    while (idx < input.length) {
        let char: string = input[idx];

        if (/\s/.test(char)) {
            idx++;
            continue;
        }

        if (char === "(" || char === ")") {
            tokens.push({ type: "PAREN", value: char });
            idx++;
            continue;
        }

        if (char === '"') {
            let value: string = "";
            char = input[++idx];

            while (char !== '"' && idx < input.length) {
                value += char;
                char = input[++idx];
            }

            idx++;
            tokens.push({ type: "STRING", value });
            continue;
        }

        if (/[0-9]/.test(char)) {
            let value: string = "";

            while (/[0-9]/.test(char) && idx < input.length) {
                value += char;
                char = input[++idx];
            }

            tokens.push({ type: "NUMBER", value: value });
            continue;
        }

        if (/[a-zA-Z\+\-\*\/\<\>\=\!\.]/.test(char)) {
            let value = "";
            while (/[a-zA-Z0-9\-\.\?\!\*\+\/\=\>\<]/.test(char) && idx < input.length) {
                value += char;
                char = input[++idx];
            }
            tokens.push({ type: "SYMBOL", value });
            continue;
        }

        throw new TypeError(`Unknown character: ${char}`);
    }

    return tokens;
}
