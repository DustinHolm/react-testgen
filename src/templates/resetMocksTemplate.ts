import { Attribute, ImportBlock } from "../types"
import { toPascalCase } from "./common"

export const createResetMocksFunction = (props: Attribute[], mocks: ImportBlock[]): string => {
    const propResetCalls = props.map(a =>
        "    resetMockProp" + toPascalCase(a.name) + "()"
    ).join("\n")

    const mockResetCalls = mocks.flatMap(ib => ib.imports).map(i =>
        "    resetMock" + toPascalCase(i.name) + "()"
    ).join("\n")

    const newLine = propResetCalls.length > 0 && mockResetCalls.length > 0
        ? "\n"
        : ""

    return `\
function resetMocks() {
${propResetCalls}${newLine}${mockResetCalls}
}
`
}