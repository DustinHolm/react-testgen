import { readdir } from "fs"
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
        console.log("FILE", file)
        if (!file.endsWith(".tsx") || file.endsWith(".test.tsx")) continue
        try {
            const scaffold = new ScaffoldBuilder()
            const parser = new Parser(`${directory}/${file}`)
            parser.parseImports().forEach(i => scaffold.addImport(i))
            parser.parseExports().forEach(e => scaffold.addExport(e))

            scaffold.build()
        } catch (e) {
            console.error(e)
        }

        console.log("\n\n")
    }
}
