import { Component, Inject, OnInit } from '@angular/core';

import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { UsbMgrHttpService } from './services/usb-mgr-http.service';
import { IUsbMgr } from './interfaces/usb-mgr';
import { timer } from 'rxjs'



export class UsbNode {
  children: UsbNode[];
  deviceName: string;
  type: any;
}
export class UsbFlatNode {
  constructor(
    public expandable: boolean, public deviceName: string, public level: number, public type: any) { }
}

@Injectable()
export class UsbTree {

  dataChange = new BehaviorSubject<UsbNode[]>([]);
  get data(): UsbNode[] { return this.dataChange.value; }

  constructor() {
    //this.initialize();
  }

  initialize(devicesData) {
    const dataObject = devicesData;//JSON.parse(devicesData);
    const data = this.buildUsbTree(dataObject, 0);
    this.dataChange.next(data);
  }

  buildUsbTree(obj: { [key: string]: any }, level: number): UsbNode[] {
    return Object.keys(obj).reduce<UsbNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new UsbNode();
      node.deviceName = key;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildUsbTree(value, level + 1);
        } else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [UsbTree, { provide: 'IUsbMgr', useClass: UsbMgrHttpService }]
})
export class AppComponent implements OnInit {

  title = 'client';
  devices: any = null;
  treeView: boolean = true

  treeControl: FlatTreeControl<UsbFlatNode>;
  treeFlattener: MatTreeFlattener<UsbNode, UsbFlatNode>;
  dataSource: MatTreeFlatDataSource<UsbNode, UsbFlatNode>;

  constructor(@Inject('IUsbMgr') private usbMgr: IUsbMgr, private usbDevices: UsbTree) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<UsbFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    usbDevices.dataChange.subscribe(data => this.dataSource.data = data);
  }


  ngOnInit(): void {
    this.usbMgr.getDevices().subscribe((devices: any) => {
      console.log(JSON.stringify(devices));
      this.usbDevices.initialize(devices)
      this.devices = devices
    })

    timer(5000, 5000)
      .subscribe(() => {
        //console.log('polling')
        if (this.treeView) {
          this.usbMgr.getDevices().subscribe((devices: any) => {
            if (devices.signature != this.devices.signature) {
              console.log(JSON.stringify(devices));
              this.usbDevices.initialize(devices)
              this.devices = devices
            }
          })
        } else {
          this.usbMgr.getDeviceByType().subscribe((devices: any) => {
            if (devices.signature != this.devices.signature) {
              console.log(JSON.stringify(devices));
              this.usbDevices.initialize(devices)
              this.devices = devices
            }
          })
        }

      })
  }

  transformer = (node: UsbNode, level: number) => {
    return new UsbFlatNode(!!node.children, node.deviceName, level, node.type);
  }
  private _getLevel = (node: UsbFlatNode) => node.level;
  private _isExpandable = (node: UsbFlatNode) => node.expandable;
  private _getChildren = (node: UsbNode): Observable<UsbNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: UsbFlatNode) => _nodeData.expandable;

  onChangeView() {
    this.treeView = !this.treeView
    if (this.treeView) {
      this.usbMgr.getDevices().subscribe((devices: any) => {

        console.log(JSON.stringify(devices));
        this.usbDevices.initialize(devices)
        this.devices = devices

      })
    } else {
      this.usbMgr.getDeviceByType().subscribe((devices: any) => {

        console.log(JSON.stringify(devices));
        this.usbDevices.initialize(devices)
        this.devices = devices

      })
    }
  }
}
