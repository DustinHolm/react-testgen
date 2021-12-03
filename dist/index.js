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
    parseFunctions(sourceFile);
    parseVariables(sourceFile);
    parseExports(sourceFile);
}
function parseImports(sourceFile) {
    console.log("IMPORTS");
    const imports = sourceFile.getImportDeclarations();
    imports.forEach(i => {
        console.log("  ", i.getNamedImports().map(n => n.getName()));
        const def = i.getDefaultImport();
        if (def) {
            console.log("  ", def.getText());
        }
    });
}
function parseInterfaces(sourceFile) {
    console.log("INTERFACE");
    const interfaces = sourceFile.getInterfaces();
    interfaces.forEach(i => {
        console.log("  ", i.getName());
        i.getMembers().forEach(m => {
            let memberName = m.getName();
            const memberType = m.getType().getText();
            console.log("    ", memberName, ":", memberType);
        });
    });
}
function parseFunctions(sourceFile) {
    console.log("FUNCTIONS");
    const functions = sourceFile.getFunctions();
    functions.forEach(f => {
        console.log("  ", f.getName(), f.isExported() ? "[exported]" : "");
        console.log("    Returns:", f.getReturnType().getText());
        console.log("    Params:");
        f.getParameters().forEach(p => {
            const pName = p.getName();
            const pType = p.getType().getText();
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
            console.log("  ", v.getName(), ":", v.getType().getApparentType().getText());
        }
        const arrowFunction = v.getInitializerIfKind(ts_morph_1.SyntaxKind.ArrowFunction);
        if (arrowFunction) {
            arrowFunction.getParameters().forEach(p => {
                const pName = p.getName();
                const pType = p.getType().getText();
                console.log("      ", pName, ":", pType);
            });
        }
        const otherFunction = v.getInitializerIfKind(ts_morph_1.SyntaxKind.FunctionExpression);
        if (otherFunction) {
            otherFunction.getParameters().forEach(p => {
                const pName = p.getName();
                const pType = p.getType().getText();
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
