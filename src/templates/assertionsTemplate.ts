import { Export, ExportType, FunctionElement } from "../types";
import { getMockName, toPascalCase } from "./common";

export const createAssertion = (mock: Export): string => {
    if (mock.element?.returnsJSX === true) {
        return createJSXAssertion(mock)
    } else if (mock.element?.type === ExportType.Function) {
        return createFunctionAssertion(mock)
    } else {
      return ""
    }
}

const createJSXAssertion = (mock: Export): string => {
    const name = toPascalCase(mock.name)
    const mockName = getMockName(mock.name)
    const testId = mockName

    return `\
function then${name}IsRendered(expected: boolean) {
    if (expected) {
        expect(screen.getByTestId("${testId}")).toBeInTheDocument()
    } else {
        expect(screen.queryByTestId("${testId}")).toBeNull()
    }
}

function then${name}WasCalledWith(props: any) {
    expect(${mockName}).toHaveBeenCalledWith([props])
}
`
}

const createFunctionAssertion = (mock: Export): string => {
    const name = toPascalCase(mock.name)
    const mockName = getMockName(mock.name)
    const parameters = (mock.element as FunctionElement).parameters

    if (parameters.length === 0) {
        return `
function then${name}WasCalled(expected: boolean) {
    if (expected) {
        expect(${mockName}).toHaveBeenCalled()
    } else {
        expect(${mockName}).not.toHaveBeenCalled()
    }
}
`
    }

    const parameterString = parameters.map(p => 
      `${p.name}: ${p.type}`
      ).join(", ")
    const parameterCallString = parameters.map(p => p.name).join(", ")

    return `\
function then${name}WasCalledWith(${parameterString}) {
    expect(${mockName}).toHaveBeenCalledWith([${parameterCallString}])
}
`
}
