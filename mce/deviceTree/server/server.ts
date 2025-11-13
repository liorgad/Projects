import { HttpServer } from './src/server/httpServer'
import {IServer} from './src/server/interface/serverIfc'


export class Program {

    
    static server: IServer

    static main(): void {

        // usually we write a factory design pattern or DI for the IServer
        Program.server = new HttpServer()

        console.log("Initializing Server");
        Program.server.init()

        console.log("Starting Server...");
        Program.server.start()        
    }
}

Program.main()





