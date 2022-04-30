type DFA = {
  startState: State;
  transitions: Transition[];
  acceptStates: State[];
};

type Transition = {
  triggeringState: State;
  triggeringChar: Character;
  stateToMoveTo: State;
};

type State = string;

type Input = string;

type Character = string;

function getTransition(
  transitions: Transition[],
  state: State,
  char: Character
): Transition | undefined {
  return transitions.find(
    ({ triggeringState, triggeringChar }) =>
      triggeringState === state && triggeringChar === char
  );
}

function simulateDFA(dfa: DFA, input: Input): boolean {
  let state = dfa.startState;

  for (const char of input) {
    const transition = getTransition(dfa.transitions, state, char);

    if (transition === undefined) {
      console.log(`no transition at state: ${state}, char: ${char}, reject`);
      return false;
    } else {
      state = transition.stateToMoveTo;
    }
  }

  if (dfa.acceptStates.includes(state)) {
    console.log("Input used up and now in accept state, accept");
    return true;
  } else {
    console.log("Input used up and not in accept state, reject");
    return false;
  }
}

// Accepts input where 101 is a substring
const exampleDFA = {
  startState: "q1",
  acceptStates: ["q4"],
  transitions: [
    {
      triggeringState: "q1",
      triggeringChar: "0",
      stateToMoveTo: "q2",
    },
    {
      triggeringState: "q1",
      triggeringChar: "1",
      stateToMoveTo: "q1",
    },
    {
      triggeringState: "q2",
      triggeringChar: "0",
      stateToMoveTo: "q3",
    },
    {
      triggeringState: "q2",
      triggeringChar: "1",
      stateToMoveTo: "q1",
    },
    {
      triggeringState: "q3",
      triggeringChar: "0",
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
console.assert(simulateDFA(exampleDFA, "010110") === false);
console.assert(simulateDFA(exampleDFA, "0") === false);
console.assert(simulateDFA(exampleDFA, "1") === false);
console.assert(simulateDFA(exampleDFA, "11") === false);
console.assert(simulateDFA(exampleDFA, "101") === false);
console.assert(simulateDFA(exampleDFA, "100") === false);
console.assert(simulateDFA(exampleDFA, "010") === false);
console.assert(simulateDFA(exampleDFA, "") === false);
console.assert(simulateDFA(exampleDFA, "00011000") === true);
console.assert(simulateDFA(exampleDFA, "001") === true);
console.assert(simulateDFA(exampleDFA, "0001") === true);
console.assert(simulateDFA(exampleDFA, "1001") === true);
console.assert(simulateDFA(exampleDFA, "0011") === true);
console.assert(simulateDFA(exampleDFA, "0010") === true);
console.assert(simulateDFA(exampleDFA, "010101000101010") === true);
