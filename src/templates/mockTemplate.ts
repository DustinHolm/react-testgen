import { Attribute, ClassElement, Export, ExportType, FunctionElement, ImportBlock } from "../types"
import { getMockName, supportedTypes, toPascalCase } from "./common"
import { createFunctionDefaults, createJSXDefaults } from "./defaultValuesTemplate"

export const createMock = (block: ImportBlock): string => {
    const jestActual = block.imports.find(i =>
        i.element === undefined
        || (!supportedTypes.includes(i.element.type) && !i.element.returnsJSX))
        ? `\
    ...jest.requireActual("${block.sourceFile}"),
`
        : ""

    const jestMocks = block.imports.map(i => createJestObject(i)).join("")

    const jestMockCall = `
jest.mock("${block.sourceFile}", () => ({
${jestActual}${jestMocks}}))
`

    const mocks = block.imports.map(i => createExportMock(i))

    return mocks.join("\n") + jestMockCall
}

const createJestObject = (importElement: Export): string => {
    if (importElement.isDefault) {
        return `\
    __esModule: true,
    default: (...args: any[]) => mock${toPascalCase(importElement.name)}(args),
`
    } else {
        return `\
    ${importElement.name}: (...args: any[]) => mock${toPascalCase(importElement.name)}(args),
`
    }
}

const createExportMock = (exportElement: Export): string => {
    const mockName = getMockName(exportElement.name)
    const element = exportElement.element

    if (element?.returnsJSX === true) {
        const parameters: Attribute[] = []
        switch (element?.type) {
            case ExportType.Function: {
                return createJSXMock(
                    mockName,
                    (element as FunctionElement).parameters
                )
            }
            case ExportType.Class: {
                return createJSXMock(
                    mockName,
                    (element as ClassElement).constructors.flatMap(c => c.parameters)
                )
            }
            // Other cases not yet implemented
            default: return ""
        }
    }

    switch (element?.type) {
        case ExportType.Function: return createFunctionMock(mockName, element as FunctionElement)
        // Other cases not yet implemented
        default: return ""
    }
}

const createFunctionMock = (name: string, functionElement: FunctionElement): string => {
    const defaults = functionElement.returnsJSX
        ? createJSXDefaults(name)
        : createFunctionDefaults(name, functionElement)

    return `\
let ${name}: jest.Mock
let ${name}Return: ${functionElement.returnType}
function reset${toPascalCase(name)}() {
${defaults}
}
function given${toPascalCase(name)}Return(given: ${functionElement.returnType}) {
    ${name}Return = given
}
`
}

const createJSXMock = (name: string, props: Attribute[]): string => {
    const defaults = createJSXDefaults(name)

    return `\
let ${name}: jest.Mock
let ${name}Return: JSX.Element
function reset${toPascalCase(name)}() {
${defaults}
}
`
}
