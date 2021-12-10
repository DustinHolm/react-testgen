import { readdir } from "fs"
import Parser from "./Parser"

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
            const parser = new Parser(`${directory}/${file}`)
            parser.parseImports()
            parser.parseInterfaces()
            parser.parseClasses()
            parser.parseFunctions()
            parser.parseVariables()
            parser.parseExports()
        } catch (e) {
            console.error(e)
        }

        console.log("\n\n")
    }
}
