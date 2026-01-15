import { Token } from "./Token";

export function tokenize(input: string): ReadonlyArray<Token> {
  let currentIndex: number = 0;
  const tokens: Token[] = [];

  while (currentIndex < input.length) {
    let currentCharacter: string = input[currentIndex];

    if (/\s/.test(currentCharacter)) {
      currentIndex++;
      continue;
    }

    if (currentCharacter === "(" || currentCharacter === ")") {
      tokens.push({ type: "PAREN", value: currentCharacter });
    }
  }

  return [];
}
