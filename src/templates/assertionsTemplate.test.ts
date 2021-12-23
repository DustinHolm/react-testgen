import { Export, ExportType, FunctionElement, ImportBlock } from "../types";
import { createAssertion } from "./assertionsTemplate";

describe("assertionsTemplate Tests", () => {
    test("For React component", () => {
        const element: FunctionElement = {
            returnsJSX: true,
            type: ExportType.Function,
            returnType: "JSX.Element",
            parameters: []
        }
        const exportElement: Export = {name: "MockComponent", isDefault: true, element: element}
        const returnedString = createAssertion(exportElement)
        expect(returnedString).toMatchSnapshot()
    })

    test("For function without parameters", () => {
        const element: FunctionElement = {
            returnsJSX: false,
            type: ExportType.Function,
            returnType: "number",
            parameters: []
        }
        const exportElement: Export = {name: "MockComponent", isDefault: true, element: element}
        const returnedString = createAssertion(exportElement)
        expect(returnedString).toMatchSnapshot()
    })

    test("For function with parameters", () => {
        const element: FunctionElement = {
            returnsJSX: false,
            type: ExportType.Function,
            returnType: "number",
            parameters: [{name: "num", type: "number"}, {name: "str", type: "string"}]
        }
        const exportElement: Export = {name: "MockComponent", isDefault: true, element: element}
        const returnedString = createAssertion(exportElement)
        expect(returnedString).toMatchSnapshot()
    })
})