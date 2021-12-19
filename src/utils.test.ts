import { createModulePath } from "./utils"

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
})