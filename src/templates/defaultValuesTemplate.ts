import { FunctionElement } from "../types"
import { getReturnForType } from "./common"

export const createJSXDefaults = (name: string): string => {
    return `\
    ${name}Return = <span data-testid={"${name}"} />
    ${name} = jest.fn(() => ${name}Return)\
`
}

export const createFunctionDefaults = (name: string, element: FunctionElement): string => {
    const returnValue = getReturnForType(element.returnType)

    return `\
    ${name}Return = ${returnValue}
    ${name} = jest.fn(() => ${name}Return)\
`
}
