import { Export, ExportType, FunctionElement, ImportBlock } from "../types"
import { createFunctionDefaults, createJSXDefaults } from "./defaultValuesTemplate"
import { supportedTypes, toPascalCase } from "./common"

export const createMock = (block: ImportBlock): string => {
    const jestActual = block.imports.find(i => 
        i.element === undefined
        || !supportedTypes.includes(i.element.type))
        ? `\
    ...jest.requireActual("${block.sourceFile}"),
`
        : ""

    const jestMocks = block.imports.map(i => createJestObject(i)).join("")

    const jestMockCall = `\
jest.mock("${block.sourceFile}", () => ({
${jestActual}${jestMocks}})
`

    const mocks = block.imports.map(i => createExportMock(i))

    return mocks.join("") + jestMockCall
}

const createJestObject = (importElement: Export): string => {
    if (importElement.isDefault) {
        return `\
    __esmodule: true,
    default: (...args: any[]) => mock${toPascalCase(importElement.name)}(args),
`
    } else {
        return `\
    ${importElement.name}: (...args: any[]) => mock${toPascalCase(importElement.name)}(args),
`
    }
}

const createExportMock = (exportElement: Export): string => {
    const mockName = "mock" + toPascalCase(exportElement.name)
    const element = exportElement.element

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
`
}
