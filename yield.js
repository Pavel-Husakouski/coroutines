function * demo() {
    let a = 0;

    while(true) {
        console.log(yield {a: a++});
    }
}

const co = demo();
let x = null;

for(let i = 0; i<= 5; i++) {
    x = co.next(x && x.value && x.value.a);
}