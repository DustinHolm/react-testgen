import { Attribute, ClassElement, Export, ExportType, FunctionElement } from "./types"

export const createModulePath = (directory: string, module: string): string => {
    const splitImportPath = module.split("../")
    const stepsBack = splitImportPath.length - 1
    const importPath = stepsBack === 0
        ? module.slice(2)
        : module.slice(stepsBack * 3)
    const tokenizedDirectory = directory.split("/").slice(1)
    const directoryPath = stepsBack === 0
        ? "/" + tokenizedDirectory.join("/")
        : "/" + tokenizedDirectory.slice(0, -stepsBack).join("/");
    
    return directoryPath  + "/" + importPath
}

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