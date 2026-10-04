export type SeatStatus = 'available' | 'assigned' | 'reserved';

export interface Seat {
  id: string;
  blockId: string;
  row: number;
  col: number;
  posX: number | null;
  posY: number | null;
  name: string;
  status: SeatStatus;
  price: number;
}

export interface Block {
  id: string;
  sectionId: string;
  title: string;
  sortOrder: number;
  seats: Seat[];
}

export interface Section {
  id: string;
  title: string;
  sortOrder: number;
  blocks: Block[];
}

export interface SeatRow {
  id: string;
  block_id: string;
  row_num: number;
  col_num: number;
  pos_x: number | null;
  pos_y: number | null;
  name: string;
  status: SeatStatus;
  price: number;
}

export interface BlockRow {
  id: string;
  section_id: string;
  title: string;
  sort_order: number;
}

export interface SectionRow {
  id: string;
  title: string;
  sort_order: number;
}

export function mapSeat(row: SeatRow): Seat {
  return {
    id: row.id,
    blockId: row.block_id,
    row: row.row_num,
    col: row.col_num,
    posX: row.pos_x,
    posY: row.pos_y,
    name: row.name,
    status: row.status,
    price: row.price,
  };
}
