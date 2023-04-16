import express from "express";
import ProductManager from "../productManager.js";

const app = express();

const manager = new ProductManager();
const products = manager.getProducts();

app.get(`/products`, async (req, res) => {
  const limit = req.query.limit;
  const allProducts = await products;
  if (limit) {
    const limitProduct = allProducts.slice(0, limit);
    res.send(limitProduct);
  } else {
    res.send(allProducts);
  }
});

app.get(`/products/:pid`, async (req, res) => {
    const idProducts = req.params.pid;
    const allProducts = await products;
    const selected = allProducts.find((p) => p.id == idProducts);
    res.send(selected);
  });

app.listen(8080, () => {
    console.log("Server listening on Port: 8080");
  });