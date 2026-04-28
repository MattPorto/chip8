import { instructionMap } from "./instructionMap";

export class CPU {
  // Sets the CPU core and initial states
  constructor() {
    // 4096 bytes RAM Memory (4KB).
    // UintArray ensures that each position has exaclty 8 bits (0-255)
    this.memory = new Uint8Array(4096);

    // 16 Registers of general use (V0 to VF).
    // They're like hardwarew global variables where data is processed
    this.v = new Uint8Array(16);

    // Program Counter (PC)
    // Stores the address of the next execution instruction
    // Almost all the CHIP-8 ROMs starts at 0x200
    this.pc = 0x200;

    // Index register (I)
    // Stores memory addresses, usually to point to sprites 
    this.i = 0;

    // Stack and Stack Pointre (SP)
    // Sub-routines (functions) manager
    // The original CHIP-8 allows up to 16 nesting levels
    this.stack = new Uint16Array(16)
    this.sp = 0

    // Timers (Delay and Sound)
    // Decreases in a 60Hz rate. When soundTimer is greater than 0, the interpreter "buzzes"
    this.delayTimer = 0;
    this.soundTimer = 0;

    // The instructions "schema"
    // First nibble (0-F) mapped for specific methods
    this.instructionMap = instructionMap;
  }

  execute(opcode) {
    // Add 2 bytes to pc to move it to the next instruction
    this.pc += 2;

    // Takes the first digit (ex: 0x6A02 -> 6)
    const identifier = (opcode & 0xF000) >> 12;
    const instruction = this.instructionMap[identifier];

    if (!instruction) {
      console.warn(`Instruction 0x${opcode.toString(16)} not mapped.`);
      return;
    }

    instruction(this, opcode);
  }
}