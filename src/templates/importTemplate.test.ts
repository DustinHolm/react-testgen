import { ImportBlock } from "../types"
import { createImport } from "./importTemplate"

describe("importTemplate Tests", () => {
    test("With empty filename", () => {
        const returnedString = createImport({
            sourceFile: "",
            isInternal: true,
            imports: [{name: "MockDefault", isDefault: true}]
        })

        expect(returnedString).toBeUndefined()
    })

    test("With blank filename", () => {
        const returnedString = createImport({
            sourceFile: "   ",
            isInternal: true,
            imports: [{name: "MockDefault", isDefault: true}]
        })

        expect(returnedString).toBeUndefined()
    })

    describe("Given correct ImportBlock", () => {
        let givenBlock: ImportBlock

        beforeEach(() => {
            givenBlock = {
                sourceFile: "./test",
                isInternal: true,
                imports: []
            }
        })

        test("With only default import", () => {
            givenBlock.imports.push({name: "MockDefault", isDefault: true})
            const returnedString = createImport(givenBlock)

            expect(returnedString).toMatchSnapshot()
        })

        test("With only one named import", () => {
            givenBlock.imports.push({name: "MockNamed", isDefault: false})
            const returnedString = createImport(givenBlock)

            expect(returnedString).toMatchSnapshot()
        })

        test("With only multiple named imports", () => {
            givenBlock.imports.push({name: "MockNamed_1", isDefault: false})
            givenBlock.imports.push({name: "MockNamed_2", isDefault: false})
            const returnedString = createImport(givenBlock)

            expect(returnedString).toMatchSnapshot()
        })

        test("With only multiple unsorted named imports", () => {
            givenBlock.imports.push({name: "MockNamed_2", isDefault: false})
            givenBlock.imports.push({name: "MockNamed_1", isDefault: false})
            const returnedString = createImport(givenBlock)

            expect(returnedString).toMatchSnapshot()
        })

        test("With mixed imports", () => {
            givenBlock.imports.push({name: "MockDefault", isDefault: true})
            givenBlock.imports.push({name: "MockNamed_1", isDefault: false})
            givenBlock.imports.push({name: "MockNamed_2", isDefault: false})
            const returnedString = createImport(givenBlock)

            expect(returnedString).toMatchSnapshot()
        })

        test("With no imports", () => {
            const returnedString = createImport(givenBlock)

            expect(returnedString).toBeUndefined()
        })
    })
})