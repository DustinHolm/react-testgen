import { readdir } from "fs"
import { Project, PropertySignature, SourceFile, SyntaxKind } from "ts-morph"

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
    parseFunctions(sourceFile)
    parseVariables(sourceFile)
    parseExports(sourceFile)
}

function parseImports(sourceFile: SourceFile) {
    console.log("IMPORTS")
    const imports = sourceFile.getImportDeclarations()
    imports.forEach(i => {
        console.log("  ", i.getNamedImports().map(n => n.getName()))
        const def = i.getDefaultImport()
        if (def) {
            console.log("  ", def.getText())
        }
    })
}

function parseInterfaces(sourceFile: SourceFile) {
    console.log("INTERFACE")
    const interfaces = sourceFile.getInterfaces()
    interfaces.forEach(i => {
        console.log("  ", i.getName())
        i.getMembers().forEach(m => {
            let memberName = (m as PropertySignature).getName()
            const memberType = (m as PropertySignature).getType().getText()
            console.log("    ", memberName, ":", memberType)
        })
    })
}

function parseFunctions(sourceFile: SourceFile) {
    console.log("FUNCTIONS")
    const functions = sourceFile.getFunctions()
    functions.forEach(f => {
        console.log("  ", f.getName(), f.isExported() ? "[exported]" : "")
        console.log("    Returns:", f.getReturnType().getText())
        console.log("    Params:")
        f.getParameters().forEach(p => {
            const pName = p.getName()
            const pType = p.getType().getText()
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
            console.log("  ", v.getName(), ":", v.getType().getApparentType().getText())
        }

        const arrowFunction = v.getInitializerIfKind(SyntaxKind.ArrowFunction)
        if (arrowFunction) {
            arrowFunction.getParameters().forEach(p => {
                const pName = p.getName()
                const pType = p.getType().getText()
                console.log("      ", pName, ":", pType)
            })
        }

        const otherFunction = v.getInitializerIfKind(SyntaxKind.FunctionExpression)
        if (otherFunction) {
            otherFunction.getParameters().forEach(p => {
                const pName = p.getName()
                const pType = p.getType().getText()
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