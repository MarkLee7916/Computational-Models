type PDA = {
  startState: State;
  transitions: Transition[];
  acceptStates: State[];
};

type Transition = {
  triggeringState: State;
  triggeringChar: Character;
  triggeringStackHead: Character;
  charToPushToStack: Character;
  stateToMoveTo: State;
};

type RunState = {
  state: State;
  inputIndex: number;
  stack: Stack;
};

type State = string;

type Input = string;

type Stack = string;

type Character = string;

const EPSILON = "";

const EMPTY_STACK_MARKER = "$";

function getTransitions(
  pda: PDA,
  stack: Stack,
  state: State,
  char: Character
): Transition[] {
  return pda.transitions.filter(
    ({ triggeringState, triggeringChar, triggeringStackHead }) =>
      triggeringState === state &&
      (triggeringChar === char || triggeringChar === EPSILON) &&
      (triggeringStackHead === peek(stack) || triggeringStackHead === EPSILON)
  );
}

function peek(stack: Stack): Character {
  return stack[stack.length - 1];
}

function pop(stack: Stack): Stack {
  return stack.slice(0, stack.length - 1);
}

function simulatePDA(PDA: PDA, input: Input): boolean {
  const runStateQueue: RunState[] = [
    { state: PDA.startState, inputIndex: 0, stack: "" },
  ];

  while (runStateQueue.length > 0) {
    const { state, inputIndex, stack } = runStateQueue.shift() as RunState;
    const char = input[inputIndex];

    if (inputIndex === input.length && PDA.acceptStates.includes(state)) {
      console.log("Input used up and now in accept state, accept input");
      return true;
    }

    getTransitions(PDA, stack, state, char).forEach(transition => {
      const nextInputIndex =
        transition.triggeringChar === EPSILON ? inputIndex : inputIndex + 1;

      const poppedStack =
        transition.triggeringStackHead === EPSILON ? stack : pop(stack);

      runStateQueue.push({
        state: transition.stateToMoveTo,
        inputIndex: nextInputIndex,
        stack: poppedStack.concat(transition.charToPushToStack),
      });
    });
  }

  console.log("No path found ending in accept state, reject input");
  return false;
}

// Accepts input in form {(0^n)(1^n) | n => 0}
const examplePDA = {
  startState: "q1",
  acceptStates: ["q1", "q4"],
  transitions: [
    {
      triggeringState: "q1",
      triggeringChar: EPSILON,
      triggeringStackHead: EPSILON,
      charToPushToStack: EMPTY_STACK_MARKER,
      stateToMoveTo: "q2",
    },
    {
      triggeringState: "q2",
      triggeringChar: "0",
      triggeringStackHead: EPSILON,
      charToPushToStack: "0",
      stateToMoveTo: "q2",
    },
    {
      triggeringState: "q2",
      triggeringChar: "1",
      triggeringStackHead: "0",
      charToPushToStack: EPSILON,
      stateToMoveTo: "q3",
    },
    {
      triggeringState: "q3",
      triggeringChar: "1",
      triggeringStackHead: "0",
      charToPushToStack: EPSILON,
      stateToMoveTo: "q3",
    },
    {
      triggeringState: "q3",
      triggeringChar: EPSILON,
      triggeringStackHead: EMPTY_STACK_MARKER,
      charToPushToStack: EPSILON,
      stateToMoveTo: "q4",
    },
  ],
};

// Basic test cases
console.assert(simulatePDA(examplePDA, "0") === false);
console.assert(simulatePDA(examplePDA, "1") === false);
console.assert(simulatePDA(examplePDA, "1001") === false);
console.assert(simulatePDA(examplePDA, "1100") === false);
console.assert(simulatePDA(examplePDA, "0101") === false);
console.assert(simulatePDA(examplePDA, "1010") === false);

for (let i = 0; i < 100; i++) {
  console.assert(
    simulatePDA(examplePDA, "0".repeat(i).concat("1".repeat(i))) === true
  );
}
