import { generateFileFor } from "./generator"

describe("generator integration Tests", () => {
    beforeEach(() => {
        resetMockWriteFileSync()
    })

    test("ReactClass matches snapshot", () => {
        generateFileFor("ReactClass", "./__test_resources__/ReactClass.tsx", "mockOutput")
        thenWriteFileSyncMatchesSnapshot()
    })

    test("ReactFC matches snapshot", () => {
        generateFileFor("ReactFC", "./__test_resources__/ReactFC.tsx", "mockOutput")
        thenWriteFileSyncMatchesSnapshot()
    })

    test("ReactFunction matches snapshot", () => {
        generateFileFor("ReactFunction", "./__test_resources__/ReactFunction.tsx", "mockOutput")
        thenWriteFileSyncMatchesSnapshot()
    })

    test("ReactMemoizedFC matches snapshot", () => {
        generateFileFor("ReactMemoizedFC", "./__test_resources__/ReactMemoizedFC.tsx", "mockOutput")
        thenWriteFileSyncMatchesSnapshot()
    })
})

let mockWriteFileSync: jest.Mock
function resetMockWriteFileSync() {
    mockWriteFileSync = jest.fn()
}
jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    writeFileSync: (...args: any[]) => mockWriteFileSync(args)
}))

function thenWriteFileSyncMatchesSnapshot() {
    expect(mockWriteFileSync.mock.calls).toMatchSnapshot()
}