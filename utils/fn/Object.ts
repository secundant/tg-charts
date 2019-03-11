export const keys = <T extends {}>(value: T): Array<keyof T> => Object.keys(value) as any;
