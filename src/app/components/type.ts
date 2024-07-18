// types.ts
export interface Subtitle {
    tag: string;
    text: string;
}

export interface Config {
    tag: string;
    text: string;
    subtitles: Subtitle[];
}