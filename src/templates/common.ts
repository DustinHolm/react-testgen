import { ExportType } from "../types"

export const supportedTypes = [ExportType.Function]

export const defaultReturnValue = "undefined"

export const getReturnForType = (type: string): string => {
    if (type.endsWith("[]")) {
        return "[]"
    }

    if (type.includes(" => ")) {
        const returnType = type.split(" => ").pop()
        if (returnType === undefined || returnType === "void") {
            return "jest.fn()"
        } else {
            const returnDefault = getReturnForType(returnType)
            return `jest.fn(${returnDefault})`
        }
    }

    switch (type) {
        case "number": return "1234"
        case "string": return '"abcd"'
        case "boolean": return "true"
        case "undefined": return "undefined"
        default: return defaultReturnValue
    }
}

export const toPascalCase = (input: string): string => {
    const firstLetter = input.slice(0, 1).toUpperCase()
    const otherLetters = input.slice(1)

    return firstLetter + otherLetters
}

export const getMockName = (name: string): string => {
    return "mock" + toPascalCase(name)
}

export const getPropName = (name: string): string => {
    return "prop" + toPascalCase(name)
}