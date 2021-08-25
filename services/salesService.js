

const createSale = async (name, quantity) => {
  const nameValidation = await validateName(name);

  if(!nameValidation) {
    const product = await createProd(name, quantity);
    return product;
  } else {
    return { err: {
      code: 'invalid_data',
      message: 'Product already exists'
    } };
  }

};


module.exports = {
  createSale
};
