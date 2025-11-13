import { EventEmitter } from 'events'
import * as USB from 'usb'
const myusb = require('usb')
import { Device } from './device'


export class Usb extends EventEmitter {
  private static _instance: Usb;

  public static readonly CHANGE_EVENT = 'change'
  private readonly _close: () => void

  private devices: any;
  private devicesMock: any

  private constructor() {
    super()

    this.devicesMock = {
      //"signature": Date.now(),
      "signature": "123456789",
      "devices": [
        {
          "HUB1": {
            "bus": 3,
            "addr": 31,
            "vendorId": "8086",
            "productId": "8c2d",
            "parent": 0,
            "isDevice": false,
            "children": [
              {
                "bus": 3,
                "addr": 32,
                "vendorId": "8087",
                "productId": "8008",
                "parent": 31,
                "isDevice": true,
                "children": [],
                "payload": "8087:8008"
              }
            ],
            "payload": "8086:8c2d"
          }
        },
        {
          "HUB2": {
            "bus": 2,
            "addr": 21,
            "vendorId": "8086",
            "productId": "8c26",
            "parent": 0,
            "isDevice": false,
            "children": [
              {
                "bus": 2,
                "addr": 22,
                "vendorId": "8087",
                "productId": "8000",
                "parent": 21,
                "isDevice": true,
                "children": [],
                "payload": "8087:8000"
              }
            ],
            "payload": "8086:8c26"
          }
        },
        {
          "HUB3": {
            "bus": 1,
            "addr": 11,
            "vendorId": "8086",
            "productId": "8c31",
            "parent": 0,
            "isDevice": false,
            "children": [
              {
                "bus": 1,
                "addr": 13,
                "vendorId": "46d",
                "productId": "c52b",
                "parent": 11,
                "isDevice": true,
                "children": [],
                "payload": "46d:c52b"
              },
              {
                "bus": 1,
                "addr": 14,
                "vendorId": "a12",
                "productId": "1",
                "parent": 11,
                "isDevice": true,
                "children": [],
                "payload": "a12:1"
              },
              {
                "bus": 1,
                "addr": 12,
                "vendorId": "424",
                "productId": "2514",
                "parent": 11,
                "isDevice": false,
                "children": [
                  {
                    "bus": 1,
                    "addr": 16,
                    "vendorId": "781",
                    "productId": "558a",
                    "parent": 12,
                    "isDevice": true,
                    "children": [],
                    "payload": "781:558a"
                  }
                ],
                "payload": "424:2514"
              }
            ],
            "payload": "8086:8c31"
          }
        }
      ]
    }

    this.refreshDeviceList()

    let timer: any
    const emitChange = (device: USB.Device) => {

      // debounce
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        timer = undefined
        this.emit(Usb.CHANGE_EVENT)
      }, 500)
    }

    USB.on('attach', emitChange)
    USB.on('detach', emitChange)

    this._close = () => {
      USB.removeListener('attach', emitChange)
      USB.removeListener('detach', emitChange)
    }

  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public close() { this._close() }

  public getDevies() {
    return this.devicesMock
    //return this.devices
  }

  public refreshDeviceList() {

    try {
      let deviceList: USB.Device[] = USB.getDeviceList();

      let list = []
      for (var i = 0; i < deviceList.length; i++) {
        let device = deviceList[i];

        let deviceIndex = device.deviceDescriptor.iSerialNumber

        //device.open()

        let deviceName ="HUB"

        // device.getStringDescriptor(deviceIndex,(err,data) =>{
        //   if(err){
        //     console.log(err)
        //     return
        //   }
        //   deviceName = String(data)
        // })

        list.push(new Device(
          device.busNumber * 10 + device.deviceAddress,
          device.deviceDescriptor.idVendor.toString(16),
          device.deviceDescriptor.idProduct.toString(16),
          device.parent == null ? 0 : device.parent.busNumber * 10 + device.parent.deviceAddress))
      }

      let tree = this.list_to_tree(list)
      this.devices = {
        "signature": Date.now(),
        "devices": tree
      }

    }
    catch (e) {
      console.log(e)
    }

  }

  // turn a list of devices to tree according to parent
  private list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].addr] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent !== 0) {
        list[map[node.parent]].children.push(node);
        list[map[node.parent]].isDevice = false;
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  private flattenTree(tree: Device[], flattenList: Device[]):Device[] {

    if (tree.length == 0) {
      return null
    }

    for (let i = 0; i < tree.length; i++) {
      if (tree[i].isDevice) {
        flattenList.push(tree[i])
      }
      else {
        flattenList.push(new Device(tree[i].addr,tree[i].vendorId,tree[i].productId,tree[i].parent,false))
        this.flattenTree(tree[i].children, flattenList)
      }
    }
  }

  public getDevicesByType() {
    let flattenList:Device[] = []
    if(this.devices.devices.length == 0){
      this.refreshDeviceList()
    }
    this.flattenTree(this.devices.devices, flattenList)

    let devByType = {
      //"signature": Date.now(),
      "signature": "123456789",
      "devices": {"Device" : [], "Hub": []}}

    for(let i=0;i < flattenList.length ; i++){
      if(flattenList[i].isDevice){
        devByType.devices.Device.push(flattenList[i])
      }else{
        devByType.devices.Hub.push(flattenList[i])
      }
    }
    
    return devByType
  }
}



