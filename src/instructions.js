// --- Isolated Instruction Methods ---
export const Instructions = {
  // 1NNN -> Jump to location nnn.
  // The interpreter sets the program counter to nnn.
  jp: (cpu, opcode) => {
    cpu.pc = opcode & 0x0FFF;
  },

  // 6XKK -> Set Vx to kk.
  // The interpreter puts the value kk into register Vx.
  ldByte: (cpu, opcode) => {
    const x = (opcode & 0x0F00) >> 8;
    const kk = opcode & 0x00FF;
    cpu.v[x] = kk;
  },

  // 7XKK -> Set Vx = Vx + kk.
  // Adds the value kk to the value of register Vx, then stores the result in Vx.
  addByte: (cpu, opcode) => {
    const x = (opcode & 0x0F00) >> 8;
    const kk = opcode & 0x00FF;
    cpu.v[x] += kk;
  },

  // ANNN -> Set I = nnn.
  // The value of register I is set to nnn.
  ldI: (cpu, opcode) => {
    cpu.i = opcode & 0x0FFF;
  },

  // Type 0
  handleType0: (cpu, opcode) => {
    switch (opcode) {
      case 0x00E0: // CLS: clear screen
        cpu.display.clear();
        break;

      case 0x00EE: // RET: Return from a subroutine
        cpu.sp--;
        cpu.pc = cpu.stack[cpu.sp];
        break;

      default:
        // The original CHIP-8 had the instruction 0NNN (SYS addr)
        // Which called programs in machine code of RCA 1802
        console.warn(`System instruction ignored: ${opcode.toString(16)}`);
    }
  }
};
