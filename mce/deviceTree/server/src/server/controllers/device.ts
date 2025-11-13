export class Device
{    
    addr : number
    vendorId :string
    productId : string
    parent : number
    isDevice:boolean = true    
    children = []
    //TODO: device string

    constructor(addr:number,vid:string,pid:string,parent:number,isDevice:boolean = true){
        this.addr = addr
        this.vendorId = vid
        this.productId = pid
        this.parent = parent
        this.isDevice = isDevice
    }
}