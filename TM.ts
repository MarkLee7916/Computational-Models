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
  symbolToWrite: string;
  directionToMove: DirectionToMove;
};

const R = 1;

const L = -1;

const BLANK_TAPE_CELL = " ";

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

function simulateTM(tm: TM, input: string): void {
  const tape = input.split("");
  let tapeIndex = 0;
  let state = tm.startState;

  console.log("Initial Configuration:");
  console.log(`tape: ${tape.join("")}`);
  console.log(`tape index: ${tapeIndex}`);
  console.log(`state: ${state}`);
  console.log("");

  for (let iter = 1; true; iter++) {
    const symbol = tape[tapeIndex];
    const transition = getTransition(tm.transitions, symbol, state);

    if (state === tm.acceptState) {
      console.log("Machine has entered accept state, accept input and halt");
      break;
    }

    if (state === tm.rejectState) {
      console.log("Machine has entered reject state, reject input and halt");
      break;
    }

    if (transition === undefined) {
      console.log(
        `no transition has been defined for state: ${state}, symbol: ${symbol}, reject input and halt`
      );
      break;
    }

    tape[tapeIndex] = transition.symbolToWrite;
    tapeIndex += transition.directionToMove;
    state = transition.stateToMoveTo;

    if (tapeIndex === -1) {
      tapeIndex = 0;
    }

    if (tapeIndex === tape.length) {
      tape.push(BLANK_TAPE_CELL);
    }

    console.log(`After Iteration ${iter}:`);
    console.log(`tape: ${tape.join("")}`);
    console.log(`tape index: ${tapeIndex}`);
    console.log(`state: ${state}`);
    console.log("");
  }
}

const exampleTM = {
  startState: "q0",
  acceptState: "qacc",
  rejectState: "qrej",
  transitions: [
    {
      triggeringSymbol: "a",
      triggeringState: "q0",
      stateToMoveTo: "q1",
      symbolToWrite: "b",
      directionToMove: R,
    },
    {
      triggeringSymbol: "a",
      triggeringState: "q1",
      stateToMoveTo: "q1",
      symbolToWrite: "b",
      directionToMove: R,
    },
    {
      triggeringSymbol: "b",
      triggeringState: "q1",
      stateToMoveTo: "qacc",
      symbolToWrite: "a",
      directionToMove: L,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q0",
      stateToMoveTo: "qrej",
      symbolToWrite: BLANK_TAPE_CELL,
      directionToMove: L,
    },
    {
      triggeringSymbol: BLANK_TAPE_CELL,
      triggeringState: "q1",
      stateToMoveTo: "qrej",
      symbolToWrite: "b",
      directionToMove: R,
    },
  ],
};

simulateTM(exampleTM, "abba");
