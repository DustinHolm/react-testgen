import { Attribute, Export, ImportBlock } from "../types"
import { createResetMocksFunction } from "./resetMocksTemplate"

describe("resetMocksTemplate Tests", () => {
    test("With only props", () => {
        const props: Attribute[] = [{name: "att_1", type: "type_1"}, {name: "att_2", type: "type_2"}]
        const mocks: ImportBlock[] = []
        const returnedString = createResetMocksFunction(props, mocks)
        expect(returnedString).toMatchSnapshot()
    })

    test("With one mocked import block", () => {
        const props: Attribute[] = []
        const mocks: ImportBlock[] = [getImportBlock(2)]
        const returnedString = createResetMocksFunction(props, mocks)
        expect(returnedString).toMatchSnapshot()
    })

    test("With two mocked import blocks", () => {
        const props: Attribute[] = []
        const mocks: ImportBlock[] = [getImportBlock(1), getImportBlock(1)]
        const returnedString = createResetMocksFunction(props, mocks)
        expect(returnedString).toMatchSnapshot()
    })

    test("With mixed inputs", () => {
        const props: Attribute[] = [{name: "att_1", type: "type_1"}, {name: "att_2", type: "type_2"}]
        const mocks: ImportBlock[] = [getImportBlock(2)]
        const returnedString = createResetMocksFunction(props, mocks)
        expect(returnedString).toMatchSnapshot()
    })
})

function getImportBlock(numberOfImports: number): ImportBlock {
    const imports = []
    for (let i = 0; i < numberOfImports; i++) {
        imports.push(getImport(i))
    }

    return {
        sourceFile: "./mock",
        isInternal: true,
        imports: imports
    }
}

function getImport(num: number): Export {
    return {
        name: "import_" + num,
        isDefault: false
    }
}