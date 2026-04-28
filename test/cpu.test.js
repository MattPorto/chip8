import { CPU } from "../src/cpu";
import { jest } from "@jest/globals";


describe('CHIP-8 CPU', () => {
  
  let cpu;
  beforeEach(() => { cpu = new CPU(); });

  describe('Instruction Decoding', () => {
    test('should stop execution if opcode is not mapped', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      cpu.execute('not mapped instruction');

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('not mapped'));
      spy.mockRestore();
    })
  })

  describe('Arithmetic and Logic (6XKK, 7XKK)', () => {
    test('6XKK: LD Vx, byte - should load 0x44 into V1', () => {
      cpu.execute(0x6144);
      expect(cpu.v[1]).toBe(0x44);
    });

    test('7XKK: ADD Vx, byte - should add 0x01 to V2', () => {
      cpu.v[2] = 0x10;
      cpu.execute(0x7201);
      expect(cpu.v[2]).toBe(0x11);
    });

    test('7XKK: ADD Vx, byte - should handle overflow (Uint8Array behavior)', () => {
      cpu.v[2] = 0xFF; // 255
      cpu.execute(0x7201); // 255 + 1 = 256
      expect(cpu.v[2]).toBe(0x00); // Overflow natural do Uint8Array
    });
  });

  describe('Flow Control (1NNN, 00EE)', () => {
    test('1NNN: JP addr - should set PC to 0xABC', () => {
      cpu.execute(0x1ABC);
      expect(cpu.pc).toBe(0xABC);
    });

    test('00EE: RET - should pop PC from stack', () => {
      cpu.stack[0] = 0x300;
      cpu.sp = 1;
      cpu.execute(0x00EE);
      expect(cpu.pc).toBe(0x300);
      expect(cpu.sp).toBe(0);
    });
  });

  describe('Memory and Index (ANNN)', () => {
    test('ANNN: LD I, addr - should set register I to 0xFFA', () => {
      cpu.execute(0xAFFA);
      expect(cpu.i).toBe(0xFFA);
    });
  });
});