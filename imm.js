const obj1 = { a: 10 };
const obj2 = obj1;

const arr = [];
const arr2 = arr;

console.log(arr === arr2); // true

obj2.b = 'B';

const objArr = [
  { a: 10 },
  { a: 20 },
];

let objArrCopy = { ...objArr };

objArrCopy[1].a = 100;

// console.log(obj1 === obj2); // true
// console.log(obj1); // { a: 10, b: 'B' }

console.log(objArr);
console.log(objArrCopy);
