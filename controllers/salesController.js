const { createSale,
  getAllSales,
  findSaleById,
  updateSale,
  removeSale } = require('../services/salesService');

const STATUS_CREATED_SUCCESS = 201;
const STATUS_SUCCESS = 200;
const BAD_REQUEST = 422;

const create = async (req, res) => {
  const bodySales = req.body;

  const sales = await createSale(bodySales);
  res.status(STATUS_SUCCESS).json(sales);
};

const getAll = async (req, res) => {
  const sales = await getAllSales();
  res.status(STATUS_SUCCESS).json(sales);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const sales = await findSaleById(id);
  res.status(STATUS_SUCCESS).json(sales);
};

const update = async (req, res) => {
  const body = req.body[0];
  const {id} = req.params;
  const { productId, quantity } = body;

  const sales = await updateSale(id, productId, quantity);
  return res.status(STATUS_SUCCESS).json(sales);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const sale = await removeSale(id);

  res.status(STATUS_SUCCESS).json(sale);

};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
