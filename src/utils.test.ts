import { ClassElement, Export, ExportType, FunctionElement } from "./types"
import { createModulePath, getPropsForExport } from "./utils"

describe("utils Tests", () => {
    describe("createModulePath Tests", () => {
        test("For adjacent file", () => {
            const file = "./Test.ts"
            const directory = "/home/admin/projects/webapp"
            const returnedString = createModulePath(directory, file)
            expect(returnedString).toEqual("/home/admin/projects/webapp/Test.ts")
        })

        test("For file in upper directory", () => {
            const file = "../../Test.ts"
            const directory = "/home/admin/projects/webapp"
            const returnedString = createModulePath(directory, file)
            expect(returnedString).toEqual("/home/admin/Test.ts")
        })

        test("For file in other directory on same level", () => {
            const file = "../other_webapp/Test.ts"
            const directory = "/home/admin/projects/webapp"
            const returnedString = createModulePath(directory, file)
            expect(returnedString).toEqual("/home/admin/projects/other_webapp/Test.ts")
        })
    })

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