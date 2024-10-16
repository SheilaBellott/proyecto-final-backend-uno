// app.js
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import session from "express-session";
import methodOverride from "method-override"; // Opcional
import { __dirname } from "./utils.js";
import path from "path";

const app = express();
const PORT = 8080;

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para method-override (Opcional)
app.use(methodOverride('_method'));

// Configurar sesiones
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configurar Handlebars como motor de vistas
app.engine("handlebars", handlebars.engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "/views/layouts") // Asegúrate de que este es el directorio correcto
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// Conexión a MongoDB
mongoose.connect("mongodb+srv://sheilabellott:V4kWiHkd222QDYvS@cluster0.ok8sv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log("Error en la conexión a la base de datos", error));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
