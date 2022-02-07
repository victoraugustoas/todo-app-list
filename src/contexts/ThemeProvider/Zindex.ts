export interface ZIndex {
  snackBarArea: number;
}

export type ZIndexOptions = Partial<ZIndex>;

export const createZindex = (zIndexOptions?: ZIndexOptions): ZIndex => {
  return {
    snackBarArea: 1000,
    ...zIndexOptions,
  };
};
