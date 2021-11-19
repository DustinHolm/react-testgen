import ts from "typescript";

const program = ts.createProgram(["__test_resources__/BubbleSortAllInOne.tsx"], {});
const sourceFile = program.getSourceFile("__test_resources__/BubbleSortAllInOne.tsx");


