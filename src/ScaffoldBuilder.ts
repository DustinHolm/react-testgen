import { Export, ImportBlock } from "./types"

class ScaffoldBuilder{
    private exports: Export[]
    private imports: ImportBlock[]

    constructor() {
        this.exports = []
        this.imports = []
    }

    addExport(element: Export) {
        this.exports.push(element)
    }

    addImport(element: ImportBlock) {
        this.imports.push(element)
    }
    
    build() {
        console.log("this.exports")
        console.log(JSON.stringify(this.exports, undefined, 2))
        console.log("this.imports")
        console.log(JSON.stringify(this.imports, undefined, 2))
    }
}

export default ScaffoldBuilder