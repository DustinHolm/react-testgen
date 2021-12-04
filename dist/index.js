"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts_morph_1 = require("ts-morph");
const directory = "__test_resources__";
(0, fs_1.readdir)(directory, parseFiles);
function parseFiles(err, files) {
    if (err !== null) {
        console.error(err);
        return;
    }
    for (let file of files) {
        console.log("FILE", file);
        const project = new ts_morph_1.Project();
        project.addSourceFileAtPath(`${directory}/${file}`);
        const source = project.getSourceFile(`${directory}/${file}`);
        if (source !== undefined) {
            parse(source);
        }
        console.log("\n\n");
    }
}
function parse(sourceFile) {
    parseImports(sourceFile);
    parseInterfaces(sourceFile);
    parseClasses(sourceFile);
    parseFunctions(sourceFile);
    parseVariables(sourceFile);
    parseExports(sourceFile);
}
function parseImports(sourceFile) {
    console.log("IMPORTS");
    const imports = sourceFile.getImportDeclarations();
    imports.forEach(i => {
        var _a;
        const importModule = i.getModuleSpecifier().getText();
        const namedImports = i.getNamedImports().map(n => n.getName());
        const defaultImport = (_a = i.getDefaultImport()) === null || _a === void 0 ? void 0 : _a.getText();
        i.getNamedImports().forEach(ni => {
            console.log(ni.getSourceFile());
        });
        if (namedImports.length > 0) {
            console.log("  ", namedImports, "from", importModule);
        }
        if (defaultImport !== undefined) {
            console.log("  ", defaultImport, "from", importModule);
        }
    });
}
function parseInterfaces(sourceFile) {
    console.log("INTERFACES");
    const interfaces = sourceFile.getInterfaces();
    interfaces.forEach(i => {
        console.log("  ", i.getName());
        i.getMembers().forEach(m => {
            let memberName = m.getName();
            const memberType = m.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias);
            console.log("    ", memberName, ":", memberType);
        });
    });
}
function parseClasses(sourceFile) {
    console.log("CLASSES");
    const classes = sourceFile.getClasses();
    classes.forEach(c => {
        console.log("  ", c.getName());
        console.log("  ", "constructors");
        c.getConstructors().forEach(con => {
            const cParams = con.getParameters();
            cParams.forEach(param => {
                const name = param.getName();
                const type = param.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias);
                console.log("    ", name, ":", type);
            });
        });
    });
}
function parseFunctions(sourceFile) {
    console.log("FUNCTIONS");
    const functions = sourceFile.getFunctions();
    functions.forEach(f => {
        console.log("  ", f.getName(), f.isExported() ? "[exported]" : "");
        console.log("    Returns:", f.getReturnType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias));
        console.log("    Params:");
        f.getParameters().forEach(p => {
            const pName = p.getName();
            const pType = p.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias);
            console.log("      ", pName, ":", pType);
        });
    });
}
function parseVariables(sourceFile) {
    console.log("VARIABLES");
    const variables = sourceFile.getVariableDeclarations();
    variables.forEach(v => {
        const aliasTypes = v.getChildrenOfKind(ts_morph_1.SyntaxKind.TypeReference)
            .map(typeRef => typeRef.getText());
        if (aliasTypes.length > 0) {
            console.log("  ", v.getName(), ":", aliasTypes[0]);
        }
        else {
            console.log("  ", v.getName(), ":", v.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias));
        }
        const arrowFunction = v.getInitializerIfKind(ts_morph_1.SyntaxKind.ArrowFunction);
        if (arrowFunction) {
            arrowFunction.getParameters().forEach(p => {
                const pName = p.getName();
                const pType = p.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias);
                console.log("      ", pName, ":", pType);
            });
        }
        const otherFunction = v.getInitializerIfKind(ts_morph_1.SyntaxKind.FunctionExpression);
        if (otherFunction) {
            otherFunction.getParameters().forEach(p => {
                const pName = p.getName();
                const pType = p.getType().getText(undefined, ts_morph_1.TypeFormatFlags.InTypeAlias);
                console.log("      ", pName, ":", pType);
            });
        }
    });
}
function parseExports(sourceFile) {
    console.log("EXPORTS");
    const defaultExports = sourceFile.getExportAssignments();
    const exports = sourceFile.getExportSymbols();
    defaultExports.forEach(e => {
        console.log("  ", e.getExpression().getText());
    });
    exports.forEach(e => {
        console.log("  ", e.getName());
    });
}
