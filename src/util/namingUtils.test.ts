import { toPascalCase } from "./namingUtils"

describe("namingUtils Tests", () => {
    test("With empty string", () => {
        const returnedString = toPascalCase("")
        
        expect(returnedString).toEqual("")
    })

    test("With one letter", () => {
        const returnedString = toPascalCase("a")
        
        expect(returnedString).toEqual("A")
    })

    test("With multiple letters", () => {
        const returnedString = toPascalCase("abc")
        
        expect(returnedString).toEqual("Abc")
    })
})