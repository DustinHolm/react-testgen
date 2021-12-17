import { Export, ExportType, FunctionElement, ImportBlock } from "../types"
import { toPascalCase } from "../util/namingUtils"

const supportedTypes = [ExportType.Function]

export const createMock = (block: ImportBlock): string | undefined => {
    const imports = block.imports

    if (imports.length === 0) {
        return undefined
    }

    const jestActual = imports.find(i => i.element === undefined
        || !supportedTypes.includes(i.element.type))
        ? `    ...jest.requireActual("${block.sourceFile}"),\n`
        : ""

    const jestMocks = imports.map(i => createJestObject(i)).join("")

    const jestMockCall = `jest.mock("${block.sourceFile}", () => ({
${jestActual}${jestMocks}})\n`

    const mocks = block.imports.map(i => createExportMock(i))

    return mocks.join("") + jestMockCall
}

const createJestObject = (importElement: Export): string => {
    if (importElement.isDefault) {
        return `    __esmodule: true,
    ${importElement.name}: (_val: any) => mock${toPascalCase(importElement.name)}(_val),\n`
    } else {
        return `    ${importElement.name}: (_val: any) => mock${toPascalCase(importElement.name)}(_val),\n`
    }
}

const createExportMock = (exportElement: Export): string => {
    switch (exportElement.element?.type) {
        case ExportType.Function: return createFunctionMock(exportElement)
        // Other cases not yet implemented
        default: return ""
    }
}

const createFunctionMock = (exportElement: Export): string => {
    const functionElement = exportElement.element as FunctionElement
    const mockName = "mock" + toPascalCase(exportElement.name)
    const returnName = mockName + "Return"
    const resetFunctionName = "reset" + toPascalCase(mockName)

    const mockDeclaration = `let ${mockName}: jest.Mock\n`
    const mockReturn = `let ${returnName}: ${functionElement.returnType}\n`
    const mockReset = `function ${resetFunctionName}() {

}\n`

    return mockDeclaration + mockReturn + mockReset
}
