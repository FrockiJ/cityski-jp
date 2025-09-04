export function getEnumKeyByEnumValue<T extends {[index: string]: string}>(myEnum: T, enumValue: string): keyof T | undefined {
    return Object.keys(myEnum).find(key => myEnum[key] === enumValue);
}