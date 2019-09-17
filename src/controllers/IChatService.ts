export interface IChatService
{
    setName(name: string): string[] | false;
    talk(content: string): void;
    whisper(name: string, content: string): void;
}