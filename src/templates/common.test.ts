import { defaultReturnValue, getReturnForType, toPascalCase } from "./common"

describe("common Tests", () => {
    describe("getReturnForType Tests", () => {
        test("For string", () => {
            const returnedString = getReturnForType("string")
            expect(returnedString).not.toEqual(defaultReturnValue)
        })

        test("For number", () => {
            const returnedString = getReturnForType("number")
            expect(returnedString).not.toEqual(defaultReturnValue)
        })

        test("For undefined", () => {
            const returnedString = getReturnForType("undefined")
            expect(returnedString).not.toEqual(defaultReturnValue)
        })

        test("For any", () => {
            const returnedString = getReturnForType("any")
            expect(returnedString).toEqual(defaultReturnValue)
        })

        test("For a not existing type", () => {
            const returnedString = getReturnForType("This is a test type that hopefully never exists")
            expect(returnedString).toEqual(defaultReturnValue)
        })
    })
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
})