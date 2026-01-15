// import { ... everything in the library one by one ... } from 'tsvari-std'

print$("hello"); // in std

println$("hello"); // in std

repeat$(5, () => {
  return print$("1");
}); // in std

let i = 0; // defvar = let

repeatWhile$(
  () => {
    // in std

    return lessThan$(1, 10); // in std
  },
  () => {
    println$(i);

    i = add$(1, i); // setf does this
  }
);

const s = "5"; // let = const

var n = strToInt$(s); // in std

var incremented = add$(n, 1); // in std

n = incremented;

function decrement(n) {
  return minus$(n, 1);
}

print(decrement(1));

export class ExampleClass {
  field;

  constructor(field) {
    this.field = field;
  }

  getField() {
    return this.field;
  }

  setField(field) {
    this.field = field;
  }
}

const doubled = (x) => {
  return multiply$(x, 2);
};

print(doubled(5));
