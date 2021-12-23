import { existsSync, readdir, writeFileSync } from "fs"
import Parser from "./Parser"
import ScaffoldBuilder from "./ScaffoldBuilder"

const directory = "__test_resources__"
readdir(directory, parseFiles)

function parseFiles(err: NodeJS.ErrnoException | null, files: string[]) {
    if (err !== null) {
        console.error(err)
        return
    }

    for (let file of files) {
        if (!file.endsWith(".tsx") || file.endsWith(".test.tsx")) continue
        console.log("FILE", file)
        const testFilePath = directory + "/" + file.slice(0, -4) + ".test.tsx"
        if (existsSync(testFilePath)) {
            console.log("File exists")
        }
        try {
            const scaffold = new ScaffoldBuilder(file)
            const parser = new Parser(`${directory}/${file}`)
            parser.parse().imports.forEach(i => scaffold.addImport(i))
            parser.parse().exports.forEach(e => scaffold.addExport(e))
            
            const testAsString = scaffold.build()
            writeFileSync(testFilePath, testAsString)
        } catch (e) {
            console.error(e)
        }
    }
}
