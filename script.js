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
    bar.innerText = values[i];
    visual.appendChild(bar);
  }
})
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const sort = document.querySelector('#sort');
sort.addEventListener('click', async () => {
  const bars = document.querySelectorAll('.bar');
  for(let i = 0; i < bars.length; i++) {
    for(let j = 0; j < bars.length - 1; j++) {
        if(values[i] < values[j]) {
          bars[i].style.backgroundColor = 'red';
          bars[j].style.backgroundColor = 'red';
          let temp = values[i];
          values[i] = values[j];
          values[j] = temp;
          bars[i].style.height = `${values[i]}px`;
          bars[j].style.height = `${values[j]}px`;
          await sleep(300);
          bars[i].style.backgroundColor = 'green';
          bars[i].innerText = values[i];
          bars[j].style.backgroundColor = 'green';
          bars[j].innerText = values[j];
        }
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