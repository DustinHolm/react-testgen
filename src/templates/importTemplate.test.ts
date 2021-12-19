import { ImportBlock } from "../types"
import { createImport } from "./importTemplate"

describe("importTemplate Tests", () => {
    let givenBlock: ImportBlock

    beforeEach(() => {
        givenBlock = {
            sourceFile: "./test",
            isInternal: true,
            imports: []
        }
    })

    test("With only default import", () => {
        givenBlock.imports.push({ name: "TestDefault", isDefault: true })
        const returnedString = createImport(givenBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With only one named import", () => {
        givenBlock.imports.push({ name: "TestNamed", isDefault: false })
        const returnedString = createImport(givenBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With only multiple named imports", () => {
        givenBlock.imports.push({ name: "TestNamed_1", isDefault: false })
        givenBlock.imports.push({ name: "TestNamed_2", isDefault: false })
        const returnedString = createImport(givenBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With only multiple unsorted named imports", () => {
        givenBlock.imports.push({ name: "TestNamed_2", isDefault: false })
        givenBlock.imports.push({ name: "TestNamed_1", isDefault: false })
        const returnedString = createImport(givenBlock)

        expect(returnedString).toMatchSnapshot()
    })

    test("With mixed imports", () => {
        givenBlock.imports.push({ name: "TestDefault", isDefault: true })
        givenBlock.imports.push({ name: "TestNamed_1", isDefault: false })
        givenBlock.imports.push({ name: "TestNamed_2", isDefault: false })
        const returnedString = createImport(givenBlock)

        expect(returnedString).toMatchSnapshot()
    })
})