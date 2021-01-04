import path from "path";

export const projectRoot = path.dirname(new URL(import.meta.url).pathname);
