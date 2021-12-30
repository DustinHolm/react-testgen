import { createAssertion } from "./templates/assertionsTemplate"
import { supportedTypes } from "./templates/common"
import { createComponentRenderFunction } from "./templates/componentRenderingTemplate"
import { createDescribeBlock } from "./templates/describeBlockTemplate"
import { createComponentImport, createDefaultImports } from "./templates/importTemplate"
import { createMock } from "./templates/mockTemplate"
import { createProp } from "./templates/propTemplate"
import { createResetMocksFunction } from "./templates/resetMocksTemplate"
import { Export, ExportType, ImportBlock } from "./types"
import { getPropsForExport } from "./utils"

class ScaffoldBuilder {
    private name: string
    private exports: Export[]
    private imports: ImportBlock[]

    constructor(name: string) {
        this.name = name.replace(".tsx", "").replace(".ts", "")
        this.exports = []
        this.imports = []
    }

    addExport(element: Export) {
        this.exports.push(element)
    }

    addImport(element: ImportBlock) {
        this.imports.push(element)
    }

    build(): string {
        const jsxExports = this.exports.filter(e => e.element?.returnsJSX === true)
        const mainExport: Export | undefined = jsxExports.find(e => e.isDefault) ?? jsxExports[0]
        if (mainExport === undefined) throw Error("No exported React component found!")

        const props = getPropsForExport(mainExport)

        const mocks = this.imports.filter(ib => 
            ib.isInternal
            && ib.imports.find(i =>
                i.element !== undefined
                && (i.element.returnsJSX
                    || supportedTypes.includes(i.element.type))
            ) !== undefined
        )

        const importsAsStrings: string[] = []
        importsAsStrings.push(createDefaultImports())
        importsAsStrings.push(createComponentImport(mainExport, this.name))
        const importsString = importsAsStrings.join("\n")

        const describeString = createDescribeBlock(this.name)

        const resetMocksString = createResetMocksFunction(props, mocks)

        const mocksString = mocks
            .map(i => createMock(i))
            .join("\n")

        const propsString = props
            .map(p => createProp(p))
            .join("\n")

        const componentRenderString = createComponentRenderFunction(mainExport.name, props)

        const assertionsString = mocks
            .flatMap(m => m.imports)
            .filter(e => e.element?.returnsJSX === true || e.element?.type === ExportType.Function)
            .map(e => createAssertion(e))
            .join("\n")

        return `\
${importsString}


${describeString}
${resetMocksString}
${mocksString}
${propsString}
${componentRenderString}
${assertionsString}\
`
    }
}

export default ScaffoldBuilder