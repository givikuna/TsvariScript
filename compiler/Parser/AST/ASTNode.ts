export interface Program {
    type: "Program";
    body: ASTNode[];
}

export interface CallExpression {
    type: "CallExpression";
    callee: string; // e.g., "print", "defvar", "+"
    arguments: ASTNode[];
}

export interface Literal {
    type: "Literal";
    value: string | number | boolean;
    kind: "string" | "number" | "boolean";
}

export interface Symbol {
    type: "Symbol";
    name: string; // e.g., "i", "n", "this.field"
}

export interface ClassProperty {
    kind: "field" | "method" | "constructor";
    visibility: "pub" | "priv";
    name: string;
    params: string[];
    body: ASTNode[];
}

export interface ClassDeclaration {
    type: "ClassDeclaration";
    name: string;
    properties: ClassProperty[];
}

export interface ExportDeclaration {
    type: "ExportDeclaration";
    declaration: ASTNode;
}

export type ASTNode = Program | CallExpression | Literal | Symbol | ClassDeclaration | ExportDeclaration;
