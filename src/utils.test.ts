import { ClassElement, Export, ExportType, FunctionElement } from "./types"
import { getPropsForExport } from "./utils"

describe("utils Tests", () => {
    describe("getPropsForExport Tests", () => {
        const givenAttribute = { name: "test", type: "test" }
        const expectedAttributes = [givenAttribute, givenAttribute]

        test("For Function", () => {
            const givenAttributes = [givenAttribute, givenAttribute]
            const element: FunctionElement = {
                returnsJSX: false,
                type: ExportType.Function,
                returnType: "number",
                parameters: givenAttributes
            }
            const exportElement: Export = { name: "Test", isDefault: false, element: element }
            const returnedAttributes = getPropsForExport(exportElement)
            expect(returnedAttributes).toEqual(expectedAttributes)
        })

        test("For Class", () => {
            const element: ClassElement = {
                returnsJSX: false,
                type: ExportType.Class,
                methods: [],
                constructors: [{ parameters: [givenAttribute, givenAttribute] }]
            }
            const exportElement: Export = { name: "Test", isDefault: false, element: element }
            const returnedAttributes = getPropsForExport(exportElement)
            expect(returnedAttributes).toEqual(expectedAttributes)
        })

        test("For Class with separate constructors", () => {
            const element: ClassElement = {
                returnsJSX: false,
                type: ExportType.Class,
                methods: [],
                constructors: [{ parameters: [givenAttribute] }, { parameters: [givenAttribute] }]
            }
            const exportElement: Export = { name: "Test", isDefault: false, element: element }
            const returnedAttributes = getPropsForExport(exportElement)
            expect(returnedAttributes).toEqual(expectedAttributes)
        })
    })
})