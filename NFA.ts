type NFA = {
  startState: State;
  transitions: Transition[];
  acceptStates: State[];
};

type Transition = {
  triggeringState: State;
  triggeringChar: Character;
  stateToMoveTo: State;
};

type RunState = {
  state: State;
  inputIndex: number;
};

type State = string;

type Input = string;

type Character = string;

const EPSILON = "";

function getTransitions(
  transitions: Transition[],
  state: State,
  char: Character
): Transition[] {
  return transitions.filter(
    ({ triggeringState, triggeringChar }) =>
      triggeringState === state &&
      (triggeringChar === char || triggeringChar === EPSILON)
  );
}

function simulateNFA(nfa: NFA, input: Input): boolean {
  const runStateQueue: RunState[] = [{ state: nfa.startState, inputIndex: 0 }];

  while (runStateQueue.length > 0) {
    const { state, inputIndex } = runStateQueue.shift() as RunState;
    const char = input[inputIndex];

    if (inputIndex === input.length && nfa.acceptStates.includes(state)) {
      console.log("Input used up and now in accept state, accept input");
      return true;
    }

    getTransitions(nfa.transitions, state, char).forEach(transition => {
      const nextInputIndex =
        transition.triggeringChar === EPSILON ? inputIndex : inputIndex + 1;

      runStateQueue.push({
        state: transition.stateToMoveTo,
        inputIndex: nextInputIndex,
      });
    });
  }

  console.log("No path found ending in accept state, reject input");
  return false;
}

// Accepts input where either 101 or 11 is a substring
const exampleNFA = {
  startState: "q1",
  acceptStates: ["q4"],
  transitions: [
    {
      triggeringState: "q1",
      triggeringChar: "0",
      stateToMoveTo: "q1",
    },
    {
      triggeringState: "q1",
      triggeringChar: "1",
      stateToMoveTo: "q1",
    },
    {
      triggeringState: "q1",
      triggeringChar: "1",
      stateToMoveTo: "q2",
    },
    {
      triggeringState: "q2",
      triggeringChar: "0",
      stateToMoveTo: "q3",
    },
    {
      triggeringState: "q2",
      triggeringChar: EPSILON,
      stateToMoveTo: "q3",
    },
    {
      triggeringState: "q3",
      triggeringChar: "1",
      stateToMoveTo: "q4",
    },
    {
      triggeringState: "q4",
      triggeringChar: "0",
      stateToMoveTo: "q4",
    },
    {
      triggeringState: "q4",
      triggeringChar: "1",
      stateToMoveTo: "q4",
    },
  ],
};

// Basic test cases
console.assert(simulateNFA(exampleNFA, "010110") === true);
console.assert(simulateNFA(exampleNFA, "0") === false);
console.assert(simulateNFA(exampleNFA, "1") === false);
console.assert(simulateNFA(exampleNFA, "11") === true);
console.assert(simulateNFA(exampleNFA, "101") === true);
console.assert(simulateNFA(exampleNFA, "100") === false);
console.assert(simulateNFA(exampleNFA, "010") === false);
console.assert(simulateNFA(exampleNFA, "") === false);
console.assert(simulateNFA(exampleNFA, "00011000") === true);
