type Tape = string[];

type State = string;

type DirectionToMove = number;

type TM = {
  startState: State;
  acceptState: State;
  rejectState: State;
  transitions: Transition[];
};

type Transition = {
  triggeringSymbol: string;
  triggeringState: State;
  stateToMoveTo: State;
  symbolToWrite: string | null;
  directionToMove: DirectionToMove;
};

const R = 1;

const L = -1;

const BLANK_TAPE_CELL = " ";

let isLoggingMachineBehaviour = false;

function getTransition(
  transitions: Transition[],
  symbol: string,
  state: State
): Transition | undefined {
  return transitions.find(
    ({ triggeringSymbol, triggeringState }) =>
      triggeringSymbol === symbol && triggeringState === state
  );
}

function simulateTM(tm: TM, input: string): boolean {
  const tape = input.split("");
  let tapeIndex = 0;
  let state = tm.startState;

  log("Initial Configuration:");
  log(`tape: ${tape.join("")}`);
  log(`tape index: ${tapeIndex}`);
  log(`state: ${state}`);
  log("");

  for (let iter = 1; true; iter++) {
    const symbol = tape[tapeIndex];
    const transition = getTransition(tm.transitions, symbol, state);

    if (state === tm.acceptState) {
      log("Machine has entered accept state, accept input and halt");
      return true;
    }

    if (state === tm.rejectState) {
      log("Machine has entered reject state, reject input and halt");
      return false;
    }

    if (transition === undefined) {
      log(`no transition at state-${state}, symbol-${symbol}, reject`);
      return false;
    }

    if (transition.symbolToWrite !== null) {
      tape[tapeIndex] = transition.symbolToWrite;
    }
    tapeIndex += transition.directionToMove;
    state = transition.stateToMoveTo;

    if (tapeIndex === -1) {
      tapeIndex = 0;
    }

    if (tapeIndex === tape.length) {
      tape.push(BLANK_TAPE_CELL);
    }

    log(`After Iteration ${iter}:`);
    log(`tape: ${tape.join("")}`);
    log(`tape index: ${tapeIndex}`);
    log(`state: ${state}`);
    log("");
  }
}

const exampleTM = {
  startState: "q1",
  acceptState: "qacc",
  rejectState: "qrej",
  transitions: [
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q1",
      stateToMoveTo: "qrej",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: "x",
      triggeringState: "q1",
      stateToMoveTo: "qrej",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: "0",
      triggeringState: "q1",
      stateToMoveTo: "q2",
      symbolToWrite: BLANK_TAPE_CELL,
      directionToMove: R,
    },
    {
      triggeringSymbol: "x",
      triggeringState: "q2",
      stateToMoveTo: "q2",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q2",
      stateToMoveTo: "qacc",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: "0",
      triggeringState: "q2",
      stateToMoveTo: "q3",
      symbolToWrite: "x",
      directionToMove: R,
    },
    {
      triggeringSymbol: "x",
      triggeringState: "q3",
      stateToMoveTo: "q3",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: "0",
      triggeringState: "q3",
      stateToMoveTo: "q4",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q3",
      stateToMoveTo: "q5",
      symbolToWrite: null,
      directionToMove: L,
    },
    {
      triggeringSymbol: "0",
      triggeringState: "q4",
      stateToMoveTo: "q3",
      symbolToWrite: "x",
      directionToMove: R,
    },
    {
      triggeringSymbol: "x",
      triggeringState: "q4",
      stateToMoveTo: "q4",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q4",
      stateToMoveTo: "qrej",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q5",
      stateToMoveTo: "q2",
      symbolToWrite: null,
      directionToMove: R,
    },
    {
      triggeringSymbol: "0",
      triggeringState: "q5",
      stateToMoveTo: "q5",
      symbolToWrite: null,
      directionToMove: L,
    },
    {
      triggeringSymbol: "x",
      triggeringState: "q5",
      stateToMoveTo: "q5",
      symbolToWrite: null,
      directionToMove: L,
    },
  ],
};

function log(str: string): void {
  if (isLoggingMachineBehaviour) {
    console.log(str);
  }
}

function hasLog2Integer(num: number): boolean {
  return Number.isInteger(Math.log2(num));
}

for (let n = 1; n < 1000; n++) {
  const input = "0".repeat(n);

  console.assert(simulateTM(exampleTM, input) === hasLog2Integer(n));
}
