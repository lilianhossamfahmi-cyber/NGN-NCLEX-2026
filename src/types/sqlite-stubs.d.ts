declare module 'sqlite3' {
    export class Database {
        constructor(filename: string, callback?: (err: Error | null) => void);
    }
}

declare module 'sqlite' {
    export function open(config: { filename: string; driver: any }): Promise<any>;
}
