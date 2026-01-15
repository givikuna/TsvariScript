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
    visibility: "pub" | "priv";
    name: string;
    isMethod: boolean;
    params?: string[]; // for methods
    body?: ASTNode[]; // for methods
}

export interface ClassDeclaration {
    type: "ClassDeclaration";
    name: string;
    isExported: boolean;
    properties: ClassProperty[];
}

export type ASTNode = Program | CallExpression | Literal | Symbol | ClassDeclaration;
