import { Driver } from "tgrid/components/Driver";
import { HashMap } from "tstl/container/HashMap";

import { IChatService } from "../controllers/IChatService";
import { IChatPrinter } from "../controllers/IChatPrinter";

export class ChatService implements IChatService
{
    private participants_: HashMap<string, Driver<IChatPrinter>>;
    private printer_: Driver<IChatPrinter>;
    private name_?: string;

    /* ----------------------------------------------------------------
        CONSTRUCTORS
    ---------------------------------------------------------------- */
    public constructor
        (
            participants: HashMap<string, Driver<IChatPrinter>>, 
            printer: Driver<IChatPrinter>
        )
    {
        this.participants_ = participants;
        this.printer_ = printer;
    }

    public destructor(): void
    {
        if (this.name_ === undefined)
            return;

        // ERASE FROM PARTICIPANTS
        this.participants_.erase(this.name_);

        // INFORM TO OTHERS
        for (let it of this.participants_)
        {
            let p: Promise<void> = it.second.erase(this.name_);
            p.catch(() => {});
        }
    }

    /* ----------------------------------------------------------------
        INTERACTIONS
    ---------------------------------------------------------------- */
    public setName(name: string): string[] | false
    {
        if (this.participants_.has(name))
            return false;

        // ASSIGN MEMBER
        this.name_ = name;
        this.participants_.emplace(name, this.printer_);

        // INFORM TO PARTICIPANTS
        for (let it of this.participants_)
        {
            let printer: Driver<IChatPrinter> = it.second;
            if (printer === this.printer_)
                continue;

            let promise: Promise<void> = printer.insert(name);
            promise.catch(() => {});
        }
        return [...this.participants_].map(it => it.first);
    }

    public talk(content: string): void
    {
        // MUST BE NAMED
        if (this.name_ === undefined)
            throw new Error("Name is not specified yet.");

        // INFORM TO PARTICIPANTS
        for (let it of this.participants_)
        {
            let p: Promise<void> = it.second.talk(this.name_, content);
            p.catch(() => {});
        }
    }

    public async whisper(to: string, content: string): Promise<void>
    {
        // MUST BE NAMED
        if (this.name_ === undefined)
            throw new Error("Name is not specified yet.");
        else if (this.participants_.has(to) === false)
            throw new Error("Unable to find the matched name");

        //----
        // INFORM TO PARTICIPANTS
        //----
        // TO SPEAKER
        let from: string = this.name_;
        this.printer_.whisper(from, to, content).catch(() => {});
        
        // TO LISTENER
        if (from !== to)
        {
            let target: Driver<IChatPrinter> = this.participants_.get(to);
            target.whisper(from, to, content).catch(() => {});
        }
    }
}