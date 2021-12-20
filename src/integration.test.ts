import Parser from "./Parser"
import ScaffoldBuilder from "./ScaffoldBuilder"

describe("Integration Tests", () => {
    test("ReactClass matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactClass.tsx")
        const builder = new ScaffoldBuilder("ReactClass.tsx")
        parser.parse().exports.forEach(e => builder.addExport(e))
        parser.parse().imports.forEach(i => builder.addImport(i))
        const returnedString = builder.build()

        expect(returnedString).toMatchSnapshot()
    })

    test("ReactFC matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactFC.tsx")
        const builder = new ScaffoldBuilder("ReactFC.tsx")
        parser.parse().exports.forEach(e => builder.addExport(e))
        parser.parse().imports.forEach(i => builder.addImport(i))
        const returnedString = builder.build()

        expect(returnedString).toMatchSnapshot()
    })

    test("ReactFunction matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactFunction.tsx")
        const builder = new ScaffoldBuilder("ReactFunction.tsx")
        parser.parse().exports.forEach(e => builder.addExport(e))
        parser.parse().imports.forEach(i => builder.addImport(i))
        const returnedString = builder.build()

        expect(returnedString).toMatchSnapshot()
    })
})