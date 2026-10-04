import { describe, it, expect } from 'vitest';
import { DEFAULT_PRICE, buildInitialLayout } from './seatLayout';

describe('DEFAULT_PRICE', () => {
  it('is 0, so that a price of zero means "not yet priced"', () => {
    expect(DEFAULT_PRICE).toBe(0);
  });
});

describe('buildInitialLayout', () => {
  it('builds all 256 demo seats with no price set', () => {
    const seats = buildInitialLayout().flatMap((section) =>
      section.blocks.flatMap((block) => block.seats),
    );
    expect(seats.length).toBe(256);
    expect(seats.every((seat) => seat.price === DEFAULT_PRICE)).toBe(true);
  });
});
