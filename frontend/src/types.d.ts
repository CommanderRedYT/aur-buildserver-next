import type {
    CssVarsPalette,
    CssVarsTheme,
    PaletteActionChannel,
    PaletteBackgroundChannel,
    PaletteColorChannel,
    PaletteCommonChannel,
    PaletteTextChannel,
} from '@mui/material/styles/experimental_extendTheme';

export type TypeOfArrayItem<T> = T extends (infer U)[] ? U : never;

export interface CommonModalProps {
    open: boolean;
    onClose: () => void;
}

export type ListViewModes = 'list' | 'grid';

/**
 * Enhance the theme types to include new properties from the CssVarsProvider.
 * The theme is typed with CSS variables in `styled`, `sx`, `useTheme`, etc.
 */
declare module '@mui/material/styles' {
    // The palette must be extended in each node.
    interface Theme extends Omit<CssVarsTheme, 'palette'> {}

    // Extend the type that will be used in palette
    interface CommonColors extends PaletteCommonChannel {}
    interface PaletteColor extends PaletteColorChannel {}
    interface TypeBackground extends PaletteBackgroundChannel {}
    interface TypeText extends PaletteTextChannel {}
    interface TypeAction extends PaletteActionChannel {}

    // The extended Palette should be in sync with `extendTheme`
    interface Palette extends CssVarsPalette {}
}

export declare interface PageFetchError {
    error: Error | string | unknown;
}

export declare type PageFetchType<T> = [T | null, PageFetchError | null];
