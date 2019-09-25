import { WebServer, WebAcceptor } from "tgrid/protocols/web";
import { Driver } from "tgrid/components/Driver";
import { HashMap } from "tstl/container/HashMap";

import { IChatPrinter } from "./controllers/IChatPrinter";
import { ChatService } from "./providers/ChatService";
import { Global } from "./Global";

async function main(): Promise<void>
{
    let server: WebServer<ChatService> = new WebServer();
    let participants: HashMap<string, Driver<IChatPrinter>> = new HashMap();

    await server.open(Global.PORT, async (acceptor: WebAcceptor<ChatService>) =>
    {
        // PROVIDE SERVICE
        let driver: Driver<IChatPrinter> = acceptor.getDriver<IChatPrinter>();
        let service: ChatService = new ChatService(participants, driver);

        await acceptor.accept(service);

        // DESTRUCTOR
        await acceptor.join();
        service.destructor();
    });
}
main();