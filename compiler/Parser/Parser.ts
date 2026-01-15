import { Token } from "../Tokenizer/Token";
import { tokenize } from "../Tokenizer/Lexer";
import { ASTNode, CallExpression, Program } from "./AST/ASTNode";

export class Parser {
    private tokens: ReadonlyArray<Token>;
    private current = 0;

    constructor(tokens: ReadonlyArray<Token>) {
        this.tokens = tokens;
    }

    private peek() {
        return this.tokens[this.current] || null;
    }

    private consume() {
        return this.tokens[this.current++];
    }

    parse(): Program {
        const program: Program = { type: "Program", body: [] };
        while (this.current < this.tokens.length) {
            program.body.push(this.walk());
        }
        return program;
    }

    private walk(): ASTNode {
        let token = this.consume();

        if (token.type === "NUMBER") {
            return { type: "Literal", value: Number(token.value), kind: "number" };
        }

        if (token.type === "STRING") {
            return { type: "Literal", value: token.value, kind: "string" };
        }

        if (token.type === "SYMBOL") {
            return { type: "Symbol", name: token.value };
        }

        if (token.type === "PAREN" && token.value === "(") {
            // Look at the next token WITHOUT consuming it yet
            const next = this.peek();

            // Check if this is an empty list "()" or a nested expression starting with "("
            // This is crucial for your (lambda () ( ... )) syntax
            if (!next || (next.type === "PAREN" && next.value === ")")) {
                this.consume(); // consume the ")"
                return { type: "CallExpression", callee: "void", arguments: [] };
            }

            // Standard Call: consume the callee
            const calleeToken = this.consume();
            const callExp: CallExpression = {
                type: "CallExpression",
                callee: calleeToken.value,
                arguments: [],
            };

            // Parse arguments until we hit the matching ")"
            while (this.peek() && (this.peek().type !== "PAREN" || this.peek().value !== ")")) {
                callExp.arguments.push(this.walk());
            }

            // Ensure we consume the closing parenthesis
            const closingParen = this.consume();
            if (!closingParen || closingParen.value !== ")") {
                throw new Error("Missing closing parenthesis");
            }

            return callExp;
        }

        throw new TypeError(`Unexpected token type: ${token.type}`);
    }
}

console.log(
    new Parser(
        tokenize(`(print "hello")
(println "hello")

(defvar i (0))

(let s ("5"))
(defvar n (str-to-int (s)))
(defvar incremented (+ n 1))
(setf n incremented)`),
    ).parse(),
);
