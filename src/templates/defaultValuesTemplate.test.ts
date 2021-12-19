import { ExportType, FunctionElement } from "../types"
import { createFunctionDefaults, createJSXDefaults } from "./defaultValuesTemplate"

describe("defaultValuesTemplate Tests", () => {
    describe("createJSXDefaults Tests", () => {
        test("With name", () => {
            const returnedString = createJSXDefaults("test")
            expect(returnedString).toMatchSnapshot()
        })
    })

    describe("createFunctionDefaults Tests", () => {
        test("With name", () => {
            const element: FunctionElement = {
                type: ExportType.Function,
                returnsJSX: false,
                returnType: "testType",
                parameters: []
            }
            const returnedString = createFunctionDefaults("test", element)
            expect(returnedString).toMatchSnapshot()
        })
    })
})