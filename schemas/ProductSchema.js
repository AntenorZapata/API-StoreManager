const errors = {
  name_length
}


// const blank = (value) => !value;
const isNotString = (value) => typeof value !== 'string';
const nameLength = (value, min) => value.length < min;

const validateData = (name, quantity) => {
  const code = 422;

  switch (true) {
    case blank(name): return {code, message:}
      break;

    default:
      break;
  }
};
