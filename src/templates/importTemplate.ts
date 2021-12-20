import { ImportBlock } from "../types"

export const createImport = (importBlock: ImportBlock): string => {
    const defaultName = importBlock.imports.find(i => i.isDefault)?.name ?? ""
    const namedImports = importBlock.imports.filter(i => !i.isDefault)
        .map(i => i.name)
        .sort()
    const importsObject = namedImports.length > 0
        ? `{ ${namedImports.join(", ")} }`
        : ""
    const separator = defaultName !== "" && importsObject !== "" ? ", " : ""
    const fileName = importBlock.sourceFile

    return `import ${defaultName}${separator}${importsObject} from "${fileName}"`
}

export const createDefaultImports = (): string => {
    return 'import { render, screen } from "@testing-library/react"'
}