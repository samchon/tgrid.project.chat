export interface IChatPrinter
{
    /**
     * Insert a new participant.
     * 
     * @param name A new name
     */
    insert(name: string): void;

    /**
     * Erase ordinary participant.
     * 
     * @param name The name to erase
     */
    erase(name: string): void;

    /**
     * Print talking to everyone.
     * 
     * @param from speaker
     * @param content content to print
     */
    talk(from: string, content: string): void;

    /**
     * Print whispering.
     * 
     * @param from speaker
     * @param to listener
     * @param content content to print
     */
    whisper(from: string, to: string, content: string): void;
}