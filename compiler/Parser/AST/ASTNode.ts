import {
    PropertyVisibility,
    PropertyKind,
    LiteralKind,
} from "../../../types/types";

export interface Program {
    type: "Program";
    body: ASTNode[];
}

export interface CallExpression {
    type: "CallExpression";
    callee: string;
    arguments: ASTNode[];
}

export interface Literal {
    type: "Literal";
    value: string | number | boolean;
    kind: LiteralKind;
}


export interface Symbol {
    type: "Symbol";
    name: string;
}

export interface ClassMember {
    type: "ClassMember";
    visibility: PropertyVisibility;
    kind: PropertyKind;
    name: string;
    params: string[];
    body: ASTNode[];
}


export interface ClassDeclaration {
    type: "ClassDeclaration";
    name: string;
    members: ClassMember[];
}

export interface LambdaExpression {
    type: "LambdaExpression";
    params: string[];
    body: ASTNode[];
}

export interface FunctionDeclaration {
    type: "FunctionDeclaration";
    name: string;
    params: string[];
    body: ASTNode[];
}

export interface ConditionalStatement {
    type: "ConditionalStatement";
    test: ASTNode;
    body: ASTNode[];
}

export type ASTNode =
    | Program
    | CallExpression
    | Literal
    | Symbol
    | ClassDeclaration
    | LambdaExpression
    | FunctionDeclaration
    | ConditionalStatement;
