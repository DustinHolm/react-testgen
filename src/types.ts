export interface Import {
    isDefault: boolean,
    sourceFile: string,
    name: string,
    isInternal: boolean,
    element?: ExportableElement
}

export interface Export {
    isDefault: boolean,
    type: ExportType,
    element: ExportableElement
}

export enum ExportType {
    Class,
    Function,
    Interface,
    Variable
}

export interface ExportableElement {
    name: string,
    returnsJSX: boolean
}

export interface ClassElement extends ExportableElement {
    constructor: Attribute[]
}

export interface FunctionElement extends ExportableElement {
    returnType: string,
    parameters: Attribute[]
}

export interface InterfaceElement extends ExportableElement {
    attributes: Attribute[]
}

export interface VariableElement extends ExportableElement {
    type: string,
    arrowFunction?: FunctionElement
}

export interface Attribute {
    name: string,
    type: string
}
