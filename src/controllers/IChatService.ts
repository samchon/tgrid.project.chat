export interface IChatService
{
    setName(name: string): boolean;
    talk(content: string): void;
    whisper(name: string, content: string): void;
}