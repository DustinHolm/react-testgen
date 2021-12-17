export const toPascalCase = (input: string): string => {
    
    const firstLetter = input.slice(0, 1).toUpperCase()
    const otherLetters = input.slice(1)

    return firstLetter + otherLetters
}