import { readdir } from "fs"
import { Project, PropertySignature, SourceFile, SyntaxKind, TypeFormatFlags } from "ts-morph"

const directory = "__test_resources__"
readdir(directory, parseFiles)

function parseFiles(err: NodeJS.ErrnoException | null, files: string[]) {
    if (err !== null) {
        console.error(err)
        return
    }

    for (let file of files) {
        console.log("FILE", file)
        const project = new Project()
        project.addSourceFileAtPath(`${directory}/${file}`)
        const source = project.getSourceFile(`${directory}/${file}`)
        if (source !== undefined) {
            parse(source)
        }
        console.log("\n\n")
    }
}


function parse(sourceFile: SourceFile) {
    parseImports(sourceFile)
    parseInterfaces(sourceFile)
    parseClasses(sourceFile)
    parseFunctions(sourceFile)
    parseVariables(sourceFile)
    parseExports(sourceFile)
}

function parseImports(sourceFile: SourceFile) {
    console.log("IMPORTS")
    const imports = sourceFile.getImportDeclarations()
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

function parseInterfaces(sourceFile: SourceFile) {
    console.log("INTERFACES")
    const interfaces = sourceFile.getInterfaces()
    interfaces.forEach(i => {
        console.log("  ", i.getName())
        i.getMembers().forEach(m => {
            let memberName = (m as PropertySignature).getName()
            const memberType = (m as PropertySignature).getType().getText(undefined, TypeFormatFlags.InTypeAlias)
            console.log("    ", memberName, ":", memberType)
        })
    })
}

function parseClasses(sourceFile: SourceFile) {
    console.log("CLASSES")
    const classes = sourceFile.getClasses()
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

function parseFunctions(sourceFile: SourceFile) {
    console.log("FUNCTIONS")
    const functions = sourceFile.getFunctions()
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

function parseVariables(sourceFile: SourceFile) {
    console.log("VARIABLES")
    const variables = sourceFile.getVariableDeclarations()
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

function parseExports(sourceFile: SourceFile) {
    console.log("EXPORTS")
    const defaultExports = sourceFile.getExportAssignments()
    const exports = sourceFile.getExportSymbols()
    defaultExports.forEach(e => {
        console.log("  ", e.getExpression().getText())
    })
    exports.forEach(e => {
        console.log("  ", e.getName())
    })
}