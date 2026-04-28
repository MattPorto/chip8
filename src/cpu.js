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
    this.instructionMap = {
      0x0: (opcode) => { this.handleType0(opcode) }, // Instructions that starts with 0
      0x1: (opcode) => { this.jp(opcode) },          // 1NNN
      0x6: (opcode) => { this.ldByte(opcode) },      // 6XKK
      0x7: (opcode) => { this.addByte(opcode) },     // 7XKK
      0xA: (opcode) => { this.ldI(opcode) },         // ANNN
    }
  }


  execute(opcode) {
    // Add 2 bytes to pc to move it to the next instruction
    this.pc += 2;

    // Takes the first digit (ex: 0x6A02 -> 6)
    const identifier = (opcode & 0xF000) >> 12;
    const instruction = this.instructionMap[identifier];

    if (!instruction) {
      console.warn(`Instruction 0x${opcode.toString(16)} not mapped.`);
    }

    instruction(opcode);
  }

  // --- Isolated Instruction Methods ---

  // 1NNN -> Jump to location nnn.
  // The interpreter sets the program counter to nnn.
  jp(opcode) {
    this.pc = opcode & 0x0FFF;
  }

  // 6XKK -> Set Vx to kk.
  // The interpreter puts the value kk into register Vx.
  ldByte(opcode) {
    const x = (opcode & 0x0F00) >> 8;
    const kk = opcode & 0x00FF;
    this.v[x] = kk;
  }

  // 7XKK -> Set Vx = Vx + kk.
  // Adds the value kk to the value of register Vx, then stores the result in Vx.
  addByte(opcode) {
    const x = (opcode & 0x0F00) >> 8;
    const kk = opcode & 0x00FF;
    this.v[x] += kk;
  }

  // ANNN -> Set I = nnn.
  // The value of register I is set to nnn.
  ldI(opcode) {
    this.i = opcode & 0x0FFF;
  }

  // Type 0
  handleType0(opcode) {
    switch (opcode) {
      case 0x00E0: // CLS: clear screen
        this.display.clear();
        break;

      case 0x00EE: // RET: Return from a subroutine
        this.sp--;
        this.pc = this.stack[this.sp];
        break;

      default:
        // The original CHIP-8 had the instruction 0NNN (SYS addr)
        // Which called programs in machine code of RCA 1802
        console.warn(`System instruction ignored: ${opcode.toString(16)}`);
    }
  }
}