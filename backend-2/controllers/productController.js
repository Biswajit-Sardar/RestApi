const Product = require("../models/productModel");

const {ensureDatabase}= require('../config/db.mongo');


//get /api/products
const getAllProducts = async (req, res ,next) => {};
//post /api/products
const createProduct = async (req, res ,next) => {};
//get /api/products/:id
const getProductById = async (req, res ,next) => {};
//put /api/products/:id
const updateProductById = async (req, res ,next) => {};
//delete /api/products/:id
const deleteProductById = async (req, res ,next) => {};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById
};

