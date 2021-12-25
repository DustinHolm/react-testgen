import { ExportType } from "../types"

export const supportedTypes = [ExportType.Function]

export const defaultReturnValue = "undefined //TODO: Set this manually"
export const getReturnForType = (type: string): string => {
    switch (type) {
        case "number": return "1234"
        case "string": return '"abcd"'
        case "boolean": return "true"
        case "undefined": return "undefined"
        case "any": return "undefined //TODO: If this is not explicitly 'any', you should check your type annotations."
        default: return defaultReturnValue
    }
}

export const toPascalCase = (input: string): string => {
    const firstLetter = input.slice(0, 1).toUpperCase()
    const otherLetters = input.slice(1)

    return firstLetter + otherLetters
}