export type TokenType = "PAREN" | "SYMBOL" | "STRING" | "NUMBER";

export interface Token {
    type: TokenType;
    value: string;
}
