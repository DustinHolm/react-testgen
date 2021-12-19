import { Attribute } from "../types"
import { getReturnForType, toPascalCase } from "./common"

export const createProp = (prop: Attribute): string => {
    const name = "mockProp" + toPascalCase(prop.name)
    const pascalName = toPascalCase(name)

    return `\
let ${name}: ${prop.type}
function reset${pascalName}() {
    ${name} = ${getReturnForType(prop.type)}
}
function given${pascalName}(given: ${prop.type}) {
    ${name} = given
}
`
}