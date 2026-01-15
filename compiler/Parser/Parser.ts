import { Token } from "../Tokenizer/Token";
import {
    ASTNode,
    CallExpression,
    ConditionalStatement,
    FunctionDeclaration,
    LambdaExpression,
    Program,
} from "./AST/ASTNode";

export class Parser {
    private tokens: ReadonlyArray<Token>;
    private current = 0;

    public constructor(tokens: ReadonlyArray<Token>) {
        this.tokens = tokens;
    }

    private peek() {
        return this.tokens[this.current] || null;
    }

    private consume() {
        return this.tokens[this.current++];
    }

    public parse(): Program {
        const program: Program = { type: "Program", body: [] };
        while (this.current < this.tokens.length) {
            program.body.push(this.walk());
        }
        return program;
    }

    private walk(): ASTNode {
        let token = this.consume();

        if (!token) {
            throw new Error("Unexpected end of input");
        }

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

            if (next && next.value === ")") {
                this.consume();
                return { type: "CallExpression", callee: "void", arguments: [] };
            }

            if (next.type === "SYMBOL") {
                if (next.value === "lambda") return this.handleLambda();
                if (next.value === "defun") return this.handleFunction();
                if (next.value === "case") return this.handleConditional();
            }

            if (next.type === "PAREN" && next.value === "(") {
                const inner = this.walk();
                if (this.peek()?.value === ")") this.consume();
                return inner;
            }

            const calleeToken = this.consume();
            const callExp: CallExpression = {
                type: "CallExpression",
                callee: calleeToken.value,
                arguments: [],
            };

            while (this.peek() && this.peek().value !== ")") {
                callExp.arguments.push(this.walk());
            }

            if (this.peek()?.value === ")") this.consume();
            return callExp;
        }

        throw new TypeError(`Unexpected token type: ${token.type} value: ${token.value}`);
    }

    private handleLambda(): LambdaExpression {
        const params: string[] = [];
        const body: ASTNode[] = [];

        this.consume();
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

    private handleConditional(): ConditionalStatement {
        this.consume();

        const body: ASTNode[] = [];
        const test = this.walk();

        while (this.peek() && this.peek().value !== ")") {
            body.push(this.walk());
        }

        this.consume();

        return { type: "ConditionalStatement", test, body };
    }
}
