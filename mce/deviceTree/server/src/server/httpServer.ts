
import express = require("express");
import * as path from "path";
import * as bodyParser from "body-parser";
import * as  http from "http";
import { IServer } from "./interface/serverIfc";
import { Usb } from './controllers/usb';
import { UV_UDP_REUSEADDR } from "constants";
const router = express.Router();
const cors = require('cors');

export class HttpServer implements IServer {

    // Create Express server
    private app: express.Application
    private port: number
    private httpServer : http.Server    

    constructor() {
        this.app = express();        
    }

    init(): void {
        // Express configuration
        this.port =   +process.env.PORT || 3000
        this.app.set("port",this.port);        
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
         
         // CORS Middleware
         this.app.use(cors());

        this.app.use(
            express.static(path.join(__dirname, "../../public"), { maxAge: 31557600000 })
        );

        this.app.use('/api',router.get('/devices',this.getUsbDevices))
        this.app.use('/api',router.get('/devicesByType',this.getUsbDevicesByTypes))

        // Send all other requests to the Angular app
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });

        //refreshing the device tree on attachment/detachment
        Usb.Instance.on(Usb.CHANGE_EVENT,()=>{
            Usb.Instance.refreshDeviceList()
        })

        this.httpServer = http.createServer(this.app);
    }
    start(): void {
        this.httpServer.listen(this.port, () => console.log(`Running on localhost:${this.port}`));
    }
    stop(): void {        
        this.httpServer.close()
    }

    getUsbDevices(req,res) : void {
        let usb = Usb.Instance        
        let devices = usb.getDevies() 
        res.status(200).json(devices)
    }

    getUsbDevicesByTypes(req,res) : void{
        let usb = Usb.Instance        
        let devices = usb.getDevicesByType() 
        res.status(200).json(devices)
    }
}

