"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const program = typescript_1.default.createProgram(["__test_resources__/BubbleSortAllInOne.tsx"], {});
const typeChecker = program.getTypeChecker();
const sourceFiles = program.getSourceFiles();
const sourceFile = program.getSourceFile("__test_resources__/BubbleSortAllInOne.tsx");
for (let file of sourceFiles) {
    if (!file.isDeclarationFile) {
        console.log(file === sourceFile);
    }
}
