import { Attribute, ImportBlock } from "../types"
import { getMockName, getPropName, toPascalCase } from "./common"

export const createResetMocksFunction = (props: Attribute[], mocks: ImportBlock[]): string => {
    const propResetCalls = props.map(a => {
        const name = toPascalCase(getPropName(a.name))
        return "    reset" + name + "()"
    }).join("\n")

    const mockResetCalls = mocks.flatMap(ib => ib.imports).map(i => {
        const name = toPascalCase(getMockName(i.name))
        return "    reset" + name + "()"
    }).join("\n")

    const newLine = propResetCalls.length > 0 && mockResetCalls.length > 0
        ? "\n"
        : ""

    return `\
function resetMocks() {
${propResetCalls}${newLine}${mockResetCalls}
}
`
}