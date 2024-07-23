// eslint-disable-next-line import/prefer-default-export
export const filterDistinct = <T>(arr: T[]): T[] => arr.filter((item, index) => arr.indexOf(item) === index);
