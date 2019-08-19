// A simple tester
// TODO: create unit test for this module

const hashHelper = require('./hash.helper');

const pass1 = '123456';
const pass2 = '654321';
const pass3 = '';
const fakeCB = 1;
//TEST hash with callback
// hashHelper.hashPassword(pass1, (err, hashedPassword) => {
//   console.log('Generating password using Callback:');
//   if(err) {
//     console.log('Error hashing with callback:');
//     console.log(err.message);
//     return;
//   }
//   console.log(hashedPassword);
//   hashHelper.isPasswordCorrect(pass1, hashedPassword, (err, result) => {
//     console.log('Testing password using Callback:');
//     if(err) {
//       console.log('Error testing with callback:');
//       console.log(err.message);
//       return;
//     }
//     console.log(result);
//   });
// });

//TEST hash with .then()
hashHelper.hashPassword(pass1)
  .then((hashedPassword) => {
    console.log('Generated Password with then():');
    console.log(hashedPassword);
    hashHelper.isPasswordCorrect(pass2, hashedPassword)
      .then((result) => {
        console.log('Tested password with then():')
        console.log(result);
      })
      .catch((error) => {
        console.log('Error testing with then():');
        console.log(error.message);
      });
  })
  .catch((err) => {
    console.log('Error hashing with then():');
    console.log(err.message);
  });

// TEST hash with async/await
const test = async (cb) => {
  if(!cb) {
    try {
      const hashed = await hashHelper.hashPassword(pass2);
      console.log('Generated password using async/await:');
      console.log(hashed);
      const isCorrect = await hashHelper.isPasswordCorrect(hashed);
      console.log('Tested password with async/await');
      console.log(isCorrect);
    } catch(error) {
      console.log('Error using async/await:');
      console.log(error.message);
    }
  } else {
    try {
      hashHelper.hashPassword(pass1, cb)
    } catch(e) {
      console.log(e.message);
    }
  }
}

// test single run
//test();
// console.log('FakeCB:');
// test(fakeCB);
//test lots of runs
// const runs = 1000;
// for(let i = 0; i < runs; i++) {
//   test();
// }
