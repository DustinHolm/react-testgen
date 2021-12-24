import { Attribute } from "../types"
import { createComponentRenderFunction } from "./componentRenderingTemplate"

describe("createComponentRenderFunction Tests", () => {
    test("Without props", () => {
        const name = "test"
        const props: Attribute[] = []
        const returnedString = createComponentRenderFunction(name, props)
        expect(returnedString).toMatchSnapshot()
    })

    test("With one prop", () => {
        const name = "test"
        const props: Attribute[] = [{ name: "att_1", type: "type_1" }]
        const returnedString = createComponentRenderFunction(name, props)
        expect(returnedString).toMatchSnapshot()
    })

    test("With multiple props", () => {
        const name = "test"
        const props: Attribute[] = [{ name: "att_1", type: "type_1" }, { name: "att_2", type: "type_2" }]
        const returnedString = createComponentRenderFunction(name, props)
        expect(returnedString).toMatchSnapshot()
    })
})