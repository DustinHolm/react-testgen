import { Project, PropertySignature, SourceFile, SyntaxKind, TypeFormatFlags } from "ts-morph"


class Parser{
    source: SourceFile

    constructor(path: string) {
        const project = new Project()
        project.addSourceFileAtPath(path)
        const source = project.getSourceFile(path)
        if (source === undefined) {
            throw new Error("SourceFile not found!")
        }

        this.source = source
    }

    parseImports() {
        console.log("IMPORTS")
        const imports = this.source.getImportDeclarations()
        imports.forEach(i => {
            const importModule = i.getModuleSpecifier().getText()
            const namedImports = i.getNamedImports().map(n => n.getName())
            const defaultImport = i.getDefaultImport()?.getText()
    
            if (namedImports.length > 0) {
                console.log("  ", namedImports, "from", importModule)
            }
            if (defaultImport !== undefined) {
                console.log("  ", defaultImport, "from", importModule)
            }
        })
    }

    parseInterfaces() {
        console.log("INTERFACES")
        const interfaces = this.source.getInterfaces()
        interfaces.forEach(i => {
            console.log("  ", i.getName())
            i.getMembers().forEach(m => {
                let memberName = (m as PropertySignature).getName()
                const memberType = (m as PropertySignature).getType().getText(undefined, TypeFormatFlags.InTypeAlias)
                console.log("    ", memberName, ":", memberType)
            })
        })
    }

    parseClasses() {
        console.log("CLASSES")
        const classes = this.source.getClasses()
        classes.forEach(c => {
            console.log("  ", c.getName())
            console.log("  ", "constructors")
            c.getConstructors().forEach(con => {
                const cParams = con.getParameters()
                cParams.forEach(param => {
                    const name = param.getName()
                    const type = param.getType().getText(undefined, TypeFormatFlags.InTypeAlias)
                    console.log("    ", name, ":", type)
                })
            })
        })
    }

    parseFunctions() {
        console.log("FUNCTIONS")
        const functions = this.source.getFunctions()
        functions.forEach(f => {
            console.log("  ", f.getName(), f.isExported() ? "[exported]" : "")
            console.log("    Returns:", f.getReturnType().getText(undefined, TypeFormatFlags.InTypeAlias))
            console.log("    Params:")
            f.getParameters().forEach(p => {
                const pName = p.getName()
                const pType = p.getType().getText(undefined, TypeFormatFlags.InTypeAlias)
                console.log("      ", pName, ":", pType)
            })
        })
    }

    parseVariables() {
        console.log("VARIABLES")
        const variables = this.source.getVariableDeclarations()
        variables.forEach(v => {
            const aliasTypes = v.getChildrenOfKind(SyntaxKind.TypeReference)
                .map(typeRef => typeRef.getText())
    
            if (aliasTypes.length > 0) {
                console.log("  ", v.getName(), ":", aliasTypes[0])
            } else {
                console.log("  ", v.getName(), ":", v.getType().getText(undefined, TypeFormatFlags.InTypeAlias))
            }
    
            const arrowFunction = v.getInitializerIfKind(SyntaxKind.ArrowFunction)
            if (arrowFunction) {
                arrowFunction.getParameters().forEach(p => {
                    const pName = p.getName()
                    const pType = p.getType().getText(undefined, TypeFormatFlags.InTypeAlias)
                    console.log("      ", pName, ":", pType)
                })
            }
    
            const otherFunction = v.getInitializerIfKind(SyntaxKind.FunctionExpression)
            if (otherFunction) {
                otherFunction.getParameters().forEach(p => {
                    const pName = p.getName()
                    const pType = p.getType().getText(undefined, TypeFormatFlags.InTypeAlias)
                    console.log("      ", pName, ":", pType)
                })
            }
    
        })
    }

    parseExports() {
        console.log("EXPORTS")
        const defaultExports = this.source.getExportAssignments()
        const exports = this.source.getExportSymbols()
        defaultExports.forEach(e => {
            console.log("  ", e.getExpression().getText())
        })
        exports.forEach(e => {
            console.log("  ", e.getName())
        })
    }
}

export default Parser