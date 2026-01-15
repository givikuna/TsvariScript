import { Token } from "../Tokenizer/Token";
import { tokenize } from "../Tokenizer/Lexer";
import {
    ASTNode,
    CallExpression,
    ClassDeclaration,
    ClassProperty,
    FunctionDeclaration,
    LambdaExpression,
    Program,
} from "./AST/ASTNode";

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
            const next = this.peek();

            if (!next || (next.type === "PAREN" && next.value === ")")) {
                this.consume();

                return { type: "CallExpression", callee: "void", arguments: [] };
            }

            if (next.type === "SYMBOL" && next.value === "lambda") {
                return this.handleLambda();
            }

            if (next.type === "SYMBOL" && next.value === "defun") {
                return this.handleFunction();
            }

            if (next.type === "PAREN" && next.value === "(") {
                const expression = this.walk();

                this.consume();

                return expression;
            }

            const calleeToken = this.consume();
            const callExp: CallExpression = {
                type: "CallExpression",
                callee: calleeToken.value,
                arguments: [],
            };

            while (this.peek() && (this.peek().type !== "PAREN" || this.peek().value !== ")")) {
                callExp.arguments.push(this.walk());
            }

            this.consume();
            return callExp;
        }

        throw new TypeError(`Unexpected token type: ${token.type}`);
    }

    private handleLambda(): LambdaExpression {
        this.consume();
        this.consume();

        const body: ASTNode[] = [];
        const params: string[] = [];

        while (this.peek() && this.peek().value !== ")") {
            params.push(this.consume().value);
        }

        this.consume();
        this.consume();

        while (this.peek() && this.peek().value !== ")") {
            body.push(this.walk());
        }

        this.consume();
        this.consume();

        return { type: "LambdaExpression", params, body };
    }

    private handleFunction(): FunctionDeclaration {
        this.consume();

        const body: ASTNode[] = [];
        const name = this.consume().value;
        const params: string[] = [];

        this.consume();

        while (this.peek() && this.peek().value !== ")") {
            params.push(this.consume().value);
        }

        this.consume();
        this.consume();

        while (this.peek() && this.peek().value !== ")") {
            body.push(this.walk());
        }

        this.consume();
        this.consume();

        return {
            type: "FunctionDeclaration",
            name,
            params,
            body,
        };
    }
}

console.log(
    JSON.stringify(
        new Parser(
            tokenize(`(print "hello")
(println "hello")

(defvar i (0))

(repeat 5 (lambda () (
    (print "1")
)))

(let s ("5"))
(defvar n (str-to-int (s)))
(defvar incremented (+ n 1))
(setf n incremented)

(defun decrement (n) (
    (- n 1)
))

(let s (lambda (x) (x + 1)))
`),
        ).parse(),
        null,
        2,
    ),
);
