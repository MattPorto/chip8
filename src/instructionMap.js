import { Instructions } from './instructions.js';

export const instructionMap = {
  0x0: Instructions.handleType0,
  0x1: Instructions.jp,
  0x6: Instructions.ldByte,
  0x7: Instructions.addByte,
  0xA: Instructions.ldI,
};
