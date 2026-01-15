import { Token } from "./Token";

export class Lexer {
    private source: string;

    public constructor(source: string) {
        this.source = source;
    }

    public tokenize(): ReadonlyArray<Token> {
        let idx: number = 0;
        const tokens: Token[] = [];

        while (idx < this.source.length) {
            let char: string = this.source[idx];

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
                char = this.source[++idx];

                while (char !== '"' && idx < this.source.length) {
                    value += char;
                    char = this.source[++idx];
                }

                idx++;
                tokens.push({ type: "STRING", value });
                continue;
            }

            if (/[0-9]/.test(char)) {
                let value: string = "";

                while (/[0-9]/.test(char) && idx < this.source.length) {
                    value += char;
                    char = this.source[++idx];
                }

                tokens.push({ type: "NUMBER", value: value });
                continue;
            }

            if (/[a-zA-Z\+\-\*\/\<\>\=\!\.]/.test(char)) {
                let value = "";
                while (/[a-zA-Z0-9\-\.\?\!\*\+\/\=\>\<]/.test(char) && idx < this.source.length) {
                    value += char;
                    char = this.source[++idx];
                }
                tokens.push({ type: "SYMBOL", value });
                continue;
            }

            throw new TypeError(`Unknown character: ${char}`);
        }

        return tokens;
    }
}
