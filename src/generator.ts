import { writeFileSync } from "fs"
import Parser from "./Parser"
import ScaffoldBuilder from "./ScaffoldBuilder"

export const generateFileFor = (fileName: string, inputPath: string, outputPath: string) => {
    const scaffold = new ScaffoldBuilder(fileName)
    const parser = new Parser(inputPath)
    parser.parse().imports.forEach(i => scaffold.addImport(i))
    parser.parse().exports.forEach(e => scaffold.addExport(e))

    const testAsString = scaffold.build()
    writeFileSync(outputPath, testAsString)
}