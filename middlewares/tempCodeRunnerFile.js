const validateSaleQuantity = async (req, res, next) => {
  const body = req.body;
  const index = 0;
  const bad_code = 404;

  for (let i = index; i < body.length; i += 1) {
    const validation = await ProducSchema
      .validateQuantity(body[i].quantity, body[i].productId);

    if (validation.message) {
      const code = validation.code === bad_code ? 'stock_problem' : 'invalid_data';
      return res.status(validation.code).json({
        err: {
          code,
          message: validation.message,
        },
      });
    }
  }
  next();
};