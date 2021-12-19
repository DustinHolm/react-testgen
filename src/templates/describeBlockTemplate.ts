export const createDescribeBlock = (name: string): string => {

    return `\
describe("${name} Tests", () => {
    beforeEach(() => {
        resetMocks()
    })

    test("Component renders", () => {
        whenComponentIsRendered()
        screen.debug()
    })
})
`
}