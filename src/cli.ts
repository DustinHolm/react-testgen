import { existsSync } from "fs"
import { basename, dirname, extname, resolve } from "path"
import { generateFileFor } from "./generator"

export const cli = (args: string[]) => {
    if (args.length !== 1 || args.some(a => a.length === 0)) {
        console.error("You need to enter a filename!")
        process.exitCode = -1
        return
    }

    const sourcePath = resolve(args[0])
    if (!existsSync(sourcePath)) {
        console.error("File was not found!")
        process.exitCode = -1
        return
    }

    const directory = dirname(sourcePath)
    const extension = extname(sourcePath)
    if (extension !== ".tsx") {
        console.error("Target needs to be a .tsx file!")
        process.exitCode = -1
        return
    }

    const sourceName = basename(sourcePath, extension)
    const targetPath = resolve(directory, sourceName + ".test.tsx")
    if (existsSync(targetPath)) {
        console.error("Test already exists!")
        process.exitCode = -1
        return
    }

    console.log("Generating test...")
    try {
        generateFileFor(sourceName, sourcePath, targetPath)
    } catch (e) {
        console.error("Something went wrong while generating the test.")
        process.exitCode = -1
        return
    }
}
