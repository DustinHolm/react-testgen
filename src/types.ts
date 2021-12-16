export interface ImportBlock {
    sourceFile: string,
    isInternal: boolean,
    imports: Import[]
}

export interface Import {
    isDefault: boolean,
    name: string,
    element?: ExportableElement
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