import { jest } from '@jest/globals';
import { Instructions } from '../src/instructions.js';

describe('Instructions Unit Tests', () => {
  let cpuDouble;

  beforeEach(() => {
    cpuDouble = {
      v: new Uint8Array(16),
      pc: 0x200,
      i: 0,
      display: { clear: jest.fn() },
      stack: new Uint16Array(16),
      sp: 0
    };
  });

  test('jp (1NNN): should set pc to nnn', () => {
    Instructions.jp(cpuDouble, 0x1ABC);
    expect(cpuDouble.pc).toBe(0xABC);
  });

  test('ldByte (6XKK): should set Vx to kk', () => {
    Instructions.ldByte(cpuDouble, 0x61FF);
    expect(cpuDouble.v[1]).toBe(0xFF);
  });
});
