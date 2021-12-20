import ScaffoldBuilder from "./ScaffoldBuilder"

describe("ScaffoldBuilder Tests", () => {
    test("Matches snapshot", () => {
        const builder = new ScaffoldBuilder("Test.tsx")
        const returnedString = builder.build()
        expect(returnedString).toMatchSnapshot()
    })
})