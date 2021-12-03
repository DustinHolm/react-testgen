export interface UtilityInterface {
    value: number
}

export const utilitySquareArrowFunction = (value: number) => {
    return value * value
}

export function utilitySquareFunction (value: number) {
    return value * value
}

export const utilitySquareCustomTypeArrowFunction = (value: UtilityInterface): UtilityInterface => {
    return {value: value.value * value.value}
}