const ob1 = {name: 1}
console.log(ob1.name)
const name2 = 2;
const name3 = {name3: 3};
console.log({...ob1,name2, ...name3})