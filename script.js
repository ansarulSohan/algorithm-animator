const generate = document.querySelector('#generate');
const visual = document.querySelector('.visual');
let values = []
generate.addEventListener('click', () => {
  visual.innerHTML = '';
  let arr = [];
  for(let i = 0; i < 20; i++) {
    arr.push(Math.random().toFixed(2) * 300 + 51);
  }
  values = [...arr];
  arr = [];

  for(let i = 0; i < values.length; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${values[i]}px`;
    visual.appendChild(bar);
  }
})

const sort = document.querySelector('#sort');
sort.addEventListener('click', () => {
  const bars = document.querySelectorAll('.bar');
  for(let i = 0; i < bars.length; i++) {
    for(let j = 0; j < bars.length - 1; j++) {
      if(values[i] < values[j]) {
        let temp = values[i];
        values[i] = values[j];
        values[j] = temp;
        bars[i].style.height = `${values[i]}px`;
        bars[j].style.height = `${values[j]}px`;
        
      }
      // if(bars[i].style.height < bars[j].style.height) {
      //   let temp = bars[i].style.height;
      //   console.log(temp);
      //   bars[i].style.height = bars[j].style.height;
      //   bars[j].style.height = temp;
      // }
    }
  }
})



// Random generation


// console.log(arr);
// for(let i = 0; i < 10; i++) {
//   for(let j = 0; j < 9; j++) {
//     if(arr[i] < arr[j]) {
//       let temp = arr[i];
//       arr[i] = arr[j];
//       arr[j] = temp;
//     }
//   }
// }

// console.log(arr);