import Parser from "./Parser"

describe("Parser Tests", () => {
    test("Nonexisting file throws error", () => {
        const parser = new Parser("./__test_resources__/ReactClass.tsx")
        expect(parser.parse).toThrow()
    })

    test("ReactClass matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactClass.tsx")
        const parserResult = parser.parse()
        expect(parserResult).toMatchSnapshot()
    })

    test("ReactFC matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactFC.tsx")
        const parserResult = parser.parse()
        expect(parserResult).toMatchSnapshot()
    })

    test("ReactFunction matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactFunction.tsx")
        const parserResult = parser.parse()
        expect(parserResult).toMatchSnapshot()
    })

    test("ReactClassDependency matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactClassDependency.tsx")
        const parserResult = parser.parse()
        expect(parserResult).toMatchSnapshot()
    })

    test("ReactFCDependency matches snapshot", () => {
        const parser = new Parser("./__test_resources__/ReactFCDependency.tsx")
        const parserResult = parser.parse()
        expect(parserResult).toMatchSnapshot()
    })
})