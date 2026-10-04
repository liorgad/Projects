import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><div class="container" style="width:800px;height:600px;"></div>', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.SVGElement = dom.window.SVGElement || function(){};
global.getComputedStyle = dom.window.getComputedStyle;

const { SeatMapCanvas } = await import('@alisaitteke/seatmap-canvas');

try {
  const seatmap = new SeatMapCanvas('.container', { legend: true });
  console.log('instance keys:', Object.keys(seatmap));
  console.log('data keys:', Object.keys(seatmap.data));
  console.log('data proto methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(seatmap.data)));
  console.log('has setData on instance?', typeof seatmap.setData);
  const blocks = [{
    id: 'b1', title: 'Test Block', seats: [
      { id: 's1', x: 0, y: 0, title: '1', salable: true, color: '#cccccc' },
      { id: 's2', x: 30, y: 0, title: '2', salable: true, color: '#cccccc' },
    ]
  }];
  seatmap.data.replaceData(blocks);
  console.log('after replaceData, blocks:', seatmap.data.getBlocks().map(b => b.id));
  console.log("seat:", seatmap.data.getSeat("s1","b1")); process.exit(0);
} catch (e) {
  console.error('ERROR', e);
}
