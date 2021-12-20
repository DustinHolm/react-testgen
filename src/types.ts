import { ArrowFunction, FunctionDeclaration, FunctionExpression, MethodDeclaration } from "ts-morph";

export interface ImportBlock {
    sourceFile: string,
    isInternal: boolean,
    imports: Export[]
}

export interface Export {
    name: string,
    isDefault: boolean,
    element?: ExportableElement
}

export enum ExportType {
    Class,
    Function,
    Interface,
    Variable
}

export interface ExportableElement {
    type: ExportType,
    returnsJSX: boolean
}

export interface ClassElement extends ExportableElement {
    methods: MethodElement[],
    constructors: Constructor[]
}

export interface MethodElement extends FunctionElement {
    name: string
}

export interface FunctionElement extends ExportableElement {
    returnType: string,
    parameters: Attribute[]
}

export interface InterfaceElement extends ExportableElement {
    name: string,
    attributes: Attribute[]
}

export interface VariableElement extends ExportableElement {
    varType: string,
    varValue: string
}

export interface Attribute {
    name: string,
    type: string
}

export interface Constructor {
    parameters: Attribute[]
}

export interface ParserResult {
    imports: ImportBlock[],
    exports: Export[]
}

export type HasReturnAndParameters = FunctionDeclaration | ArrowFunction | FunctionExpression | MethodDeclaration