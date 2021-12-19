import {createDescribeBlock} from "./describeBlockTemplate"

describe("describeBlockTemplate Tests", () => {
    test("With name", () => {
        const returnedString = createDescribeBlock("test")
        expect(returnedString).toMatchSnapshot()
    })
})