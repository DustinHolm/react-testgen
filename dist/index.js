"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Parser_1 = __importDefault(require("./Parser"));
const directory = "__test_resources__";
(0, fs_1.readdir)(directory, parseFiles);
function parseFiles(err, files) {
    if (err !== null) {
        console.error(err);
        return;
    }
    for (let file of files) {
        console.log("FILE", file);
        if (!file.endsWith(".tsx") || file.endsWith(".test.tsx"))
            continue;
        try {
            const parser = new Parser_1.default(`${directory}/${file}`);
            parser.parseImports();
            parser.parseInterfaces();
            parser.parseClasses();
            parser.parseFunctions();
            parser.parseVariables();
            parser.parseExports();
        }
        catch (e) {
            console.error(e);
        }
        console.log("\n\n");
    }
}
