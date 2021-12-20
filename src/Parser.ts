import { existsSync } from "fs"
import { ArrowFunction, ConstructorDeclaration, FunctionDeclaration, FunctionExpression, MethodDeclaration, Project, PropertySignature, SourceFile, SyntaxKind } from "ts-morph"
import { Attribute, ClassElement, Constructor, Export, ExportType, FunctionElement, HasReturnAndParameters, ImportBlock, InterfaceElement, MethodElement, ParserResult, VariableElement } from "./types"
import { createModulePath } from "./utils"


class Parser {
    private source: SourceFile
    private imports: ImportBlock[]
    private isImportsParsed: boolean
    private exports: Export[]
    private isExportsParsed: boolean
    private interfaces: InterfaceElement[]

    constructor(path: string) {
        const project = new Project()
        project.addSourceFileAtPath(path)
        const source = project.getSourceFile(path)
        if (source === undefined) {
            throw new Error("Sourcefile not found!")
        }

        this.source = source
        this.imports = []
        this.isImportsParsed = false
        this.exports = this.getExportNames()
        this.isExportsParsed = false
        this.interfaces = []
    }

    parse(): ParserResult {
        if (!this.isImportsParsed) {
            this.parseImports()
            this.isImportsParsed = true
        }

        if (!this.isExportsParsed) {
            this.parseExports()
            this.isExportsParsed = true
        }

        return {
            imports: this.imports,
            exports: this.exports
        }
    }

    parseExportsOnly(): ParserResult {
        if (!this.isExportsParsed) {
            this.parseExports()
            this.isExportsParsed = true
        }

        return {
            imports: [],
            exports: this.exports
        }
    }

    private parseImports(): void {
        this.imports = this.source.getImportDeclarations().map(imDe => {
            let importModule = imDe.getModuleSpecifier().getText()
            if (importModule.startsWith("\"") && importModule.endsWith("\"")
                || importModule.startsWith("\'") && importModule.endsWith("\'")) {
                importModule = importModule.slice(1, -1)
            }
            const importModuleIsInternal = importModule.startsWith(".")

            const namedImports = imDe.getNamedImports().map(imSp =>
                imSp.getName())
            const defaultImport = imDe.getDefaultImport()?.getText()

            const imports: Export[] = namedImports
                .map(i => ({ name: i, isDefault: false }))
                .concat([defaultImport]
                    .filter(i => i !== undefined)
                    .map(i => ({ name: i!, isDefault: true }))
                )

            if (importModuleIsInternal) {
                const path = createModulePath(this.source.getDirectoryPath(), importModule)
                const fileExtension = existsSync(path + ".tsx") ? ".tsx" : ".ts"
                if (fileExtension === ".ts" && !existsSync(path + fileExtension)) {
                    throw Error(`This import was not found: ${path + fileExtension}`)
                }
                const importParser = new Parser(path + fileExtension)
                const importExports = importParser.parseExportsOnly().exports

                imports.forEach(i => {
                    i.element = importExports.find(e => e.name === i.name)?.element
                })
            }

            return {
                sourceFile: importModule,
                isInternal: importModuleIsInternal,
                imports: imports
            }
        })
    }

    private parseExports(): void {
        this.parseInterfaces()
        this.parseClasses()
        this.parseFunctions()
        this.parseVariables()
    }

    private parseInterfaces(): void {
        this.source.getInterfaces().forEach(inDe => {
            const attributes: Attribute[] = inDe.getMembers().map(tyElTy => ({
                name: (tyElTy as PropertySignature).getName(),
                type: tyElTy.getType().getText()
            }))

            const interfaceElement = {
                returnsJSX: false,
                type: ExportType.Interface,
                attributes: attributes,
                name: inDe.getName()
            } as InterfaceElement

            const existingExport = this.exports.find(e => e.name === inDe.getName())

            if (existingExport !== undefined) {
                existingExport.element = interfaceElement
            }

            this.interfaces.push(interfaceElement)
        })
    }

    private parseClasses(): void {
        this.source.getClasses().forEach(clDe => {
            const existingExport = this.exports.find(e => e.name === clDe.getName())

            if (existingExport !== undefined) {
                const methods = clDe.getMethods().map(meDe => {
                    const name = meDe.getName()
                    const functionElement = this.getFunctionElement(meDe)

                    return {
                        ...functionElement,
                        name: name
                    } as MethodElement
                })

                const returnsJSX = methods.some(m => m.returnsJSX)

                const constructors: Constructor[] = clDe.getConstructors().map(coDe => {
                    const attributes: Attribute[] = this.getAttributes(coDe)

                    return {
                        parameters: attributes
                    }
                })

                existingExport.element = {
                    returnsJSX: returnsJSX,
                    type: ExportType.Class,
                    methods: methods,
                    constructors: constructors
                } as ClassElement
            }
        })
    }

    private parseFunctions(): void {
        this.source.getFunctions().forEach(fuDe => {
            const existingExport = this.exports.find(e => e.name === fuDe.getName())

            if (existingExport !== undefined) {
                existingExport.element = this.getFunctionElement(fuDe)
            }
        })
    }

    private parseVariables(): void {
        this.source.getVariableDeclarations().forEach(vaDe => {
            const existingExport = this.exports.find(e => e.name === vaDe.getName())

            if (existingExport !== undefined) {
                const arrowFunction = vaDe.getInitializerIfKind(SyntaxKind.ArrowFunction)
                const otherFunction = vaDe.getInitializerIfKind(SyntaxKind.FunctionExpression)

                if (arrowFunction) {
                    existingExport.element = this.getFunctionElement(arrowFunction)
                } else if (otherFunction) {
                    existingExport.element = this.getFunctionElement(otherFunction)
                } else {
                    const aliasType = vaDe.getChildrenOfKind(SyntaxKind.TypeReference)
                        .map(typeRef => typeRef.getText())
                        .shift()
                    const variableType = aliasType ?? vaDe.getType().getText()

                    existingExport.element = {
                        returnsJSX: variableType.startsWith("JSX"),
                        type: ExportType.Variable,
                        varType: variableType,
                        varValue: vaDe.getInitializer()?.getText() ?? "undefined"
                    } as VariableElement
                }
            }
        })
    }

    private getExportNames(): Export[] {
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

    
    private getFunctionElement(declaration: HasReturnAndParameters): FunctionElement {
        const returnType = declaration.getReturnType().getText()
        const attributes: Attribute[] = this.getAttributes(declaration)

        return {
            returnsJSX: returnType.startsWith("JSX"),
            type: ExportType.Function,
            returnType: returnType,
            parameters: attributes
        }
    }

    private getAttributes(declaration: HasReturnAndParameters | ConstructorDeclaration): Attribute[] {
        return declaration.getParameters().flatMap(p => {
            const typeName = p.getType().getText()
            const correspondingInterface = this.interfaces.find(i =>
                i.name === typeName
                || (typeName.includes("import(")
                    && typeName.includes(i.name)))
            if (correspondingInterface !== undefined) {
                return correspondingInterface.attributes
            } else {
                return {
                    name: p.getName(),
                    type: p.getType().getText()
                }
            }
        })
    }
}

export default Parser