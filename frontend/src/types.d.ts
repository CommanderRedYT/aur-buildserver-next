export type TypeOfArrayItem<T> = T extends (infer U)[] ? U : never;

export interface CommonModalProps {
    open: boolean;
    onClose: () => void;
}

export type ListViewModes = 'list' | 'grid';
