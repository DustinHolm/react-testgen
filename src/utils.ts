import { Attribute, ClassElement, Export, ExportType, FunctionElement } from "./types"


export const getPropsForExport = (givenExport: Export): Attribute[] => {
    switch (givenExport.element?.type) {
        case ExportType.Function: {
            return (givenExport.element as FunctionElement).parameters
        }
        case ExportType.Class: {
            return (givenExport.element as ClassElement).constructors.flatMap(c => c.parameters)
        }
        default: return []
    }
}