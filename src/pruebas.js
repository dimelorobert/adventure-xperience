'use strict';

let daysName = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

let numbers = [1, 2, 3, 4, 5, 6, 7];
let numbers1 = [1, 232, 45, 56, 45, 2];

/*function processDaysName(x, y) {
  console.log(x + y) ;
}*/
/*function processDaysName(...c) {
  const reductor = (acc, current) => acc + current;
  const hola = c.reduce(reductor, 0);
  console.log(hola);
  return hola;
}
processDaysName(1, 2, 3, 4, 5, 6);*/

let hi = numbers.push(...daysName);
console.log(hi);
console.log(numbers);

function showName() {
  const h = () => {
    console.log('::::::::::::', arguments[2]);
  };
  h();
}

const maxNumber = Math.max(...numbers1);
console.log('max number: ', maxNumber);

// muestra: 2, Julio, Cesar
showName('hola', 'que', 'tal');
console.log(numbers1);

const arrayNumbers = [1, 23, 45, 65, 43, 32, 21];
const h = [...arrayNumbers];
const mapee = (hcito) => hcito * 2;
const newarray = h.map(mapee);

console.log('arraynumbers:', arrayNumbers);
console.log('copia', h);
console.log('hola:::', newarray);

let dateYear = new Date('1970-01-01 00:00:00').getFullYear() - 70;

const currentYear = new Date().getFullYear();

let count = [];

for (let i = 0; i <= currentYear - dateYear; i++) {
  count.push(dateYear + i);
  console.log('Año::::>', count);
}
console.log('array', count);

console.log('Fecha::::::::::::::::::::::', dateYear);
console.log('Fecha::::::::::::::::::::::', currentYear);



