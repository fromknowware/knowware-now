// Chapters 1–9 plus the capstone, which closes the loop and is numbered "X".
export const CAPSTONE_N = 10;
export const isCapstone = (n: number) => n === CAPSTONE_N;
export const chapterNum = (n: number) => (isCapstone(n) ? 'X' : String(n).padStart(2, '0'));
