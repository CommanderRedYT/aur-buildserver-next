// function generateColor should take a baseColor and a seed. With this, it should create a shade of the baseColor. with the same seed, the same shade should be generated. The function should return a string in the format of #RRGGBB.

import getContrastColor from '@/lib/getContrastColor';

const generateColor = (baseColor: string, seed: number): string => {
    const base = baseColor.slice(1);
    const r = parseInt(base.slice(0, 2), 16);
    const g = parseInt(base.slice(2, 4), 16);
    const b = parseInt(base.slice(4, 6), 16);

    const rand = Math.sin(seed) * 10000;
    const newR = Math.round(Math.abs((r + rand) % 256));
    const newG = Math.round(Math.abs((g + rand) % 256));
    const newB = Math.round(Math.abs((b + rand) % 256));

    const rHex = newR.toString(16).padStart(2, '0').substring(0, 2);
    const gHex = newG.toString(16).padStart(2, '0').substring(0, 2);
    const bHex = newB.toString(16).padStart(2, '0').substring(0, 2);

    return `#${rHex}${gHex}${bHex}`;
};

export const generateColorFromString = (
    baseColor: string,
    seed: string,
): string => {
    // compute the sum of the ASCII values of the seed
    const seedSum = seed
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return generateColor(baseColor, seedSum);
};

type Mode = 'normal' | 'contrast';

export interface AvailableProps {
    color?: Mode;
    backgroundColor?: Mode;
    borderColor?: Mode;
}

type GenerateColorPropsFromStringResponse = Record<
    keyof AvailableProps,
    string | undefined
>;

export const generateColorPropsFromString = (
    baseColor: string,
    seed: string,
    props: AvailableProps,
): GenerateColorPropsFromStringResponse => ({
    color:
        // eslint-disable-next-line no-nested-ternary
        typeof props.color !== 'undefined'
            ? props.color === 'normal'
                ? generateColorFromString(baseColor, seed)
                : getContrastColor(generateColorFromString(baseColor, seed))
            : undefined,
    backgroundColor:
        // eslint-disable-next-line no-nested-ternary
        typeof props.backgroundColor !== 'undefined'
            ? props.backgroundColor === 'normal'
                ? generateColorFromString(baseColor, seed)
                : getContrastColor(generateColorFromString(baseColor, seed))
            : undefined,
    borderColor:
        // eslint-disable-next-line no-nested-ternary
        typeof props.borderColor !== 'undefined'
            ? props.borderColor === 'normal'
                ? generateColorFromString(baseColor, seed)
                : getContrastColor(generateColorFromString(baseColor, seed))
            : undefined,
});

export default generateColor;
