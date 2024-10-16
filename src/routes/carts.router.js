// src/routes/carts.router.js
import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// Middleware para obtener el cartId desde la sesión
router.use((req, res, next) => {
  if (!req.session.cartId) {
    const newCart = new Cart();
    newCart.save()
      .then(cart => {
        req.session.cartId = cart._id;
        next();
      })
      .catch(err => res.status(500).json({ status: "error", message: "Error creando carrito", error: err }));
  } else {
    next();
  }
});

// POST /api/carts/products/:pid
router.post("/products/:pid", async (req, res) => {
  const cartId = req.session.cartId;
  const { pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json({ status: "success", message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar producto al carrito", error });
  }
});

// DELETE /api/carts/products/:pid
router.delete("/products/:pid", async (req, res) => {
  const cartId = req.session.cartId;
  const { pid } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar producto del carrito", error });
  }
});

// Otras rutas (PUT, GET, DELETE carrito) se mantienen igual
// ...

export default router;

