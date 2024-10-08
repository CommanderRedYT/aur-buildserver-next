const stringToColor = (str: string): string => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export type StringAvatar = (name?: string | null) => {
    sx?: {
        bgcolor: string;
    };
    children?: string;
};

const stringAvatar: StringAvatar = name => {
    if (!name) return {};

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children:
            name.split(' ').length === 2
                ? `${name.split(' ')[0]?.[0]}${name.split(' ')[1]?.[0]}`
                : name[0] ?? '',
    };
};

export default stringAvatar;
