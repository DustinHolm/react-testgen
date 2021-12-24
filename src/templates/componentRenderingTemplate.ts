import { Attribute } from "../types"
import { toPascalCase } from "./common"

export const createComponentRenderFunction = (name: string, props: Attribute[]): string => {
    const renderCall = props.length === 0
        ? `\
        <${name} />\
`
        : `\
        <${name}
${props.map(createPropCall).join("\n")}
        />\
`

    return `\
function whenComponentIsRendered() {
    return render(
${renderCall}
    )
}
`
}

const createPropCall = (prop: Attribute): string => {
    return `\
            ${prop.name}={mockProp${toPascalCase(prop.name)}}\
`
}