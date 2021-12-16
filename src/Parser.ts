import { Project, PropertySignature, SourceFile, SyntaxKind } from "ts-morph"
import { Attribute, ClassElement, Constructor, Export, ExportType, FunctionElement, ImportBlock, InterfaceElement, MethodElement, VariableElement } from "./types"


class Parser {
    source: SourceFile
    exports: Export[]
    isExportsParsed: boolean

    constructor(path: string) {
        const project = new Project()
        project.addSourceFileAtPath(path)
        const source = project.getSourceFile(path)
        if (source === undefined) {
            throw new Error("SourceFile not found!")
        }

        this.source = source
        this.exports = this.parseExportNames()
        this.isExportsParsed = false
    }

    parseImports(): ImportBlock[] {
        return this.source.getImportDeclarations().map(imDe => {
            let importModule = imDe.getModuleSpecifier().getText()
            if (importModule.startsWith("\"") && importModule.endsWith("\"")
                || importModule.startsWith("\'") && importModule.endsWith("\'")) {
                importModule = importModule.slice(1, -1)
            }
            const importModuleIsInternal = importModule.startsWith(".")

            const namedImports = imDe.getNamedImports().map(imSp =>
                imSp.getName())
            const defaultImport = imDe.getDefaultImport()?.getText()

            const imports: Export[] = []

            namedImports.forEach(naIm =>
                imports.push({
                    name: naIm,
                    isDefault: false,
                })
            )

            if (defaultImport !== undefined) {
                imports.push({
                    name: defaultImport,
                    isDefault: true,
                })
            }

            return {
                sourceFile: importModule,
                isInternal: importModuleIsInternal,
                imports: imports
            }
        })
    }

    parseExports(): Export[] {
        if (!this.isExportsParsed) {
            this.parseInterfaces()
            this.parseClasses()
            this.parseFunctions()
            this.parseVariables()
            this.isExportsParsed = true
        }

        return this.exports
    }

    parseInterfaces() {
        this.source.getInterfaces().forEach(inDe => {
            const existingExport = this.exports.find(e => e.name === inDe.getName())

            if (existingExport !== undefined) {
                const attributes: Attribute[] = inDe.getMembers().map(tyElTy => ({
                    name: (tyElTy as PropertySignature).getName(),
                    type: tyElTy.getType().getText()
                }))

                existingExport.element = {
                    returnsJSX: false,
                    type: ExportType.Interface,
                    attributes: attributes
                } as InterfaceElement
            }
        })
    }

    parseClasses() {
        this.source.getClasses().forEach(clDe => {
            const existingExport = this.exports.find(e => e.name === clDe.getName())

            if (existingExport !== undefined) {
                const constructors: Constructor[] = clDe.getConstructors().map(coDe => {
                    const attributes: Attribute[] = coDe.getParameters().map(p => ({
                        name: p.getName(),
                        type: p.getType().getText()
                    }))

                    return {
                        parameters: attributes
                    }
                })


                const methods = clDe.getMethods().map(meDe => {
                    const name = meDe.getName()
                    const returnType = meDe.getReturnType().getText()

                    const parameters: Attribute[] = meDe.getParameters().map(paDe => ({
                        name: paDe.getName(),
                        type: paDe.getType().getText()
                    }))

                    return {
                        returnsJSX: returnType.includes("JSX"),
                        type: ExportType.Function,
                        returnType: returnType,
                        parameters: parameters,
                        name: name
                    } as MethodElement
                })

                existingExport.element = {
                    returnsJSX: methods.some(m => m.returnsJSX),
                    type: ExportType.Class,
                    methods: methods,
                    constructors: constructors
                } as ClassElement
            }
        })
    }

    parseFunctions() {
        this.source.getFunctions().forEach(fuDe => {
            const existingExport = this.exports.find(e => e.name === fuDe.getName())

            if (existingExport !== undefined) {
                const returnType = fuDe.getReturnType().getText()

                const parameters: Attribute[] = fuDe.getParameters().map(paDe => ({
                    name: paDe.getName(),
                    type: paDe.getType().getText()
                }))

                existingExport.element = {
                    returnsJSX: returnType.includes("JSX"),
                    type: ExportType.Function,
                    returnType: returnType,
                    parameters: parameters
                } as FunctionElement
            }
        })
    }

    parseVariables() {
        this.source.getVariableDeclarations().forEach(vaDe => {
            const existingExport = this.exports.find(e => e.name === vaDe.getName())

            if (existingExport !== undefined) {
                const aliasType = vaDe.getChildrenOfKind(SyntaxKind.TypeReference)
                    .map(typeRef => typeRef.getText())
                    .shift()


                const variableType = aliasType ?? vaDe.getType().getText()
                let variableValue = undefined
                let parameters: Attribute[] | undefined = undefined
                let returnType: string | undefined = undefined
                const arrowFunction = vaDe.getInitializerIfKind(SyntaxKind.ArrowFunction)
                const otherFunction = vaDe.getInitializerIfKind(SyntaxKind.FunctionExpression)

                if (arrowFunction) {
                    returnType = arrowFunction.getReturnType().getText()

                    parameters = arrowFunction.getParameters().map(p => ({
                        name: p.getName(),
                        type: p.getType().getText()
                    }))
                } else if (otherFunction) {
                    returnType = otherFunction.getReturnType().getText()

                    parameters = otherFunction.getParameters().map(p => ({
                        name: p.getName(),
                        type: p.getType().getText()
                    }))
                } else {
                    variableValue = vaDe.getInitializer()?.getText()
                }

                if (parameters !== undefined && returnType !== undefined) {
                    existingExport.element = {
                        returnsJSX: returnType.includes("JSX"),
                        type: ExportType.Function,
                        returnType: returnType,
                        parameters: parameters
                    } as FunctionElement
                } else {
                    existingExport.element = {
                        returnsJSX: variableType.includes("JSX"),
                        type: ExportType.Variable,
                        varType: variableType,
                        varValue: variableValue ?? "undefined"
                    } as VariableElement
                }
            }
        })
    }

    private parseExportNames(): Export[] {
        const defaultExports = this.source.getExportAssignments()
        const exportSymbols = this.source.getExportSymbols()
        const exportNames: Export[] = []

        defaultExports.forEach(exAs => {
            exportNames.push({
                name: exAs.getExpression().getText(),
                isDefault: true
            })
        })

        exportSymbols.forEach(exSy => {
            if (exSy.getName() !== "default") {
                exportNames.push({
                    name: exSy.getName(),
                    isDefault: false
                })
            }
        })

        return exportNames
    }
}

export default Parser