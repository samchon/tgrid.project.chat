import { IChatPrinter } from "../controllers/IChatPrinter";

import { HashSet } from "tstl/container/HashSet";

export class ChatPrinter implements IChatPrinter
{
    private listener_?: ()=>void;

    public readonly name: string;
    public readonly participants: HashSet<string>;
    public readonly messages: ChatPrinter.IMessage[];

    /* ----------------------------------------------------------------
        CONSTRUCTOR
    ---------------------------------------------------------------- */
    public constructor(name: string, participants: string[])
    {
        this.name = name;
        this.participants = new HashSet(participants);
        this.messages = [];
    }

    public assign(listener: ()=>void): void
    {
        this.listener_ = listener;
    }

    private _Inform(): void
    {
        if (this.listener_)
            this.listener_();
    }

    /* ----------------------------------------------------------------
        METHODS FOR REMOTE FUNCTION CALL
    ---------------------------------------------------------------- */
    public insert(name: string): void
    {
        this.participants.insert(name);
        this._Inform();
    }

    public erase(name: string): void
    {
        this.participants.erase(name);
        this._Inform();
    }

    public talk(from: string, content: string): void
    {
        this.messages.push({ 
            from: from, 
            content: content 
        });
        this._Inform();
    }

    public whisper(from: string, to: string, content: string): void
    {
        this.messages.push({ 
            from: from, 
            to: to,
            content: content 
        });
        this._Inform();
    }
}

export namespace ChatPrinter
{
    export interface IMessage
    {
        from: string;
        content: string;
        to?: string;
    }
}