export interface IChatService
{
    /**
     * Set name and get participants.
     * 
     * @param name Value to set
     * @return List of participants, if duplicated name exists then returns false
     */
    setName(name: string): string[] | false;

    /**
     * Talk to everyone.
     * 
     * @param content Content to say
     */
    talk(content: string): void;

    /**
     * Whisper to someone.
     * 
     * @param to Someone to listen
     * @param content Content to whisper
     */
    whisper(to: string, content: string): void;
}