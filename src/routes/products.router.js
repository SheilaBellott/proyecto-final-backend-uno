import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const filter = query ? { category: query } : {};
  const sortOrder = sort === "asc" ? { price: 1 } : { price: -1 };

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? sortOrder : {}
  };

  // Utiliza .lean() aquí
  const result = await Product.paginate(filter, options).lean();

  res.json({
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null
  });
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

export default router;
