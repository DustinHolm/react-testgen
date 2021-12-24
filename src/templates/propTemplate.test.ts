import { Attribute } from "../types"
import { createProp } from "./propTemplate"

describe("propTemplate Tests", () => {
    beforeEach(() => {
        resetMocks()
    })

    test("With attribute", () => {
        const returnedString = createProp({ name: "testName", type: "testType" })
        expect(returnedString).toMatchSnapshot()
    })

    test("getReturnForType is called correctly", () => {
        const attribute: Attribute = { name: "testName", type: "testType" }
        createProp(attribute)
        expect(mockGetReturnForType).toHaveBeenCalledWith([attribute.type])
    })
})

function resetMocks() {
    resetMockGetReturnForType()
}

let mockGetReturnForType: jest.Mock
function resetMockGetReturnForType() {
    mockGetReturnForType = jest.fn(() => "mockedReturn")
}
jest.mock("./common", () => ({
    ...jest.requireActual("./common"),
    getReturnForType: (...args: any[]) => mockGetReturnForType(args)
}))
