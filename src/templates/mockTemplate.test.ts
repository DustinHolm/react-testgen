import { Attribute, ExportType, FunctionElement, ImportBlock } from "../types"
import {createMock} from "./mockTemplate"

describe("mockTemplate Tests", () => {
    let importBlock: ImportBlock

    beforeEach(() => {
        resetMocks()
        importBlock = {
            sourceFile: "./mock",
            isInternal: true,
            imports: []
        }
    })

    test("With default function", () => {
        importBlock.imports.push({
            name: "defaultTest",
            isDefault: true,
            element: getFunctionElement(false, 1)
        })

        const returnedString = createMock(importBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With named function", () => {
        importBlock.imports.push({
            name: "namedTest",
            isDefault: false,
            element: getFunctionElement(false, 1)
        })

        const returnedString = createMock(importBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With multiple named functions", () => {
        importBlock.imports.push({
            name: "namedTest_1",
            isDefault: false,
            element: getFunctionElement(false, 1)
        })
        importBlock.imports.push({
            name: "namedTest_2",
            isDefault: false,
            element: getFunctionElement(false, 1)
        })

        const returnedString = createMock(importBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With mixed functions", () => {
        importBlock.imports.push({
            name: "namedTest",
            isDefault: false,
            element: getFunctionElement(false, 1)
        })
        importBlock.imports.push({
            name: "defaultTest",
            isDefault: true,
            element: getFunctionElement(false, 1)
        })

        const returnedString = createMock(importBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("Calls createMockDefaults", () => {
        const exportElement = {
            name: "defaultTest",
            isDefault: true,
            element: getFunctionElement(false, 1)
        }
        importBlock.imports.push(exportElement)

        createMock(importBlock)

        expect(mockCreateFunctionDefaults).toHaveBeenCalledWith(["mockDefaultTest", exportElement.element])
    })
})

function getFunctionElement(returnsJSX: boolean, numberOfParameters: number): FunctionElement {
    const parameters = []
    for (let i = 0; i < numberOfParameters; i++) {
        parameters.push(getAttribute())
    }
    
    return {
        type: ExportType.Function,
        returnsJSX: returnsJSX,
        returnType: "mockReturn",
        parameters: parameters
    }
}

function getAttribute(): Attribute {
    return {type: "mockType", name: "mockName"}
}

let mockCreateJSXDefaults: jest.Mock
function resetMockCreateJSXDefaults() {
    mockCreateJSXDefaults = jest.fn(() => "    mockedReset")
}

let mockCreateFunctionDefaults: jest.Mock
function resetMockCreateFunctionDefaults() {
    mockCreateFunctionDefaults = jest.fn(() => "    mockedReset")
}
jest.mock("./defaultValuesTemplate", () => ({
    createJSXDefaults: (...args: any[]) => mockCreateJSXDefaults(args),
    createFunctionDefaults: (...args: any[]) => mockCreateFunctionDefaults(args)
}))

function resetMocks() {
    resetMockCreateJSXDefaults()
    resetMockCreateFunctionDefaults()
}