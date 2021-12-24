import { existsSync } from "fs"
import { basename, dirname, extname, resolve } from "path"
import { generateFileFor } from "./generator"

export const cli = (args: string[]) => {
    if (args.length !== 1 || args.some(a => a.length === 0)) {
        console.error("%cYou need to enter a filename!", "color: red")
        process.exitCode = -1
        return
    }

    const sourcePath = resolve(args[0])
    if (!existsSync(sourcePath)) {
        console.error("%cFile was not found!", "color: red")
        process.exitCode = -1
        return
    }

    const directory = dirname(sourcePath)
    const extension = extname(sourcePath)
    if (extension !== ".tsx") {
        console.error("%cTarget needs to be a .tsx file!", "color: red")
        process.exitCode = -1
        return
    }

    const sourceName = basename(sourcePath, extension)
    const targetPath = resolve(directory, sourceName + ".test.tsx")
    if (existsSync(targetPath)) {
        console.error("%cTest already exists!", "color: red")
        process.exitCode = -1
        return
    }

    console.log("%cGenerating test...", "color: green")
    generateFileFor(sourceName, sourcePath, targetPath)
}
