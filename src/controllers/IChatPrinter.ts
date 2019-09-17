export interface IChatPrinter
{
    insert(name: string): void;
    erase(name: string): void;

    talk(from: string, content: string): void;
    whisper(from: string, to: string, content: string): void;
}