// src/routes/views.router.js
import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();

// Middleware para asegurarse de que el usuario tenga un carrito
router.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = new Cart();
    await newCart.save();
    req.session.cartId = newCart._id;
  }
  next();
});

// Ruta para la raíz (`/`)
router.get("/", (req, res) => {
  res.render("index", { title: "Página Principal" });
});

// Ruta para mostrar todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("products/index", { products, cartId: req.session.cartId });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
});
// Ruta para mostrar un producto específico
router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await Product.findById(pid).lean();
      if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.render("products/product", { product, cartId: req.session.cartId });
  } catch (error) {
      res.status(500).json({ message: "Error al obtener el producto", error });
  }
});


// Ruta para mostrar el carrito
router.get("/carts", async (req, res) => {
  const cartId = req.session.cartId;
  try {
    const cart = await Cart.findById(cartId).populate("products.product").lean();
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Calcular el precio total de los productos en el carrito
    let totalPrice = 0;
    cart.products.forEach(item => {
      totalPrice += item.product.price * item.quantity;
    });

    // Cambiar "carts" a "carts/carts" para incluir la subcarpeta
    res.render("carts/carts", { products: cart.products, totalPrice, cartId });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error });
  }
});

// Exportar el router
export default router;
