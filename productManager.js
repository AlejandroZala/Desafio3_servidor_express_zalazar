import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./products.json";
    this.last_id = 1;
  }

  //--Lee archivo productos.json y devuelve todos sus elementos como array
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const cart = JSON.parse(data);
        return cart;
      }
      return this.products;
    } catch (error) {
      console.log(error);
    }
  }

  //--Recibe un id, lee productos.json y busca el producto segun id y lo devuelve como objeto
  getProductById = async (_id) => {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    const cart = JSON.parse(data);
    const product = cart.find(p => p.id === _id);
    if (product) {
      return product;
    } else {
      console.error("Not found");
      return null;
    }
  }

  //--Actualiza producto, recibe:id, campo, nuevo valor
  updateProduct = async (_id, atribute, value) => {
    const id_buscado = this.products.findIndex(p => p.id === _id);

    if (id_buscado < 0) {
      console.info(`No existe producto con id: ${_id}`);
      return null;
    }

    const selectedItem = this.products[id_buscado];
    selectedItem[atribute] = value;
    this.products[id_buscado] = selectedItem;

    const cartJson = JSON.stringify(this.products, null, '\t');
    await fs.promises.writeFile(this.path, cartJson);
  }

  //--Borra producto según id ingresado
  deleteProduct = async (_id) => {
    const res = this.products.filter(p => p.id !== _id);

    const cartJson = JSON.stringify(res, null, '\t');
    await fs.promises.writeFile(this.path, cartJson);

    this.products = res;
    return;
  }

  //--Valida y agrega productos como array de objetos a productos.josn
  addProduct = async (newProduct) => {
    try {
      //--Verifico el ingreso completo de todos los datos
      if (!newProduct.title ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.thumbnail ||
        !newProduct.code ||
        !newProduct.stock
      ) {
        console.log("Datos ingresados incompletos");
        return null;
      }

      //--Verifico que code no exista previamente
      const exists = this.products.find(p => p.code === newProduct.code);

      if (exists) {
        return null;
      }

      // Asigna id al nuevo producto
      newProduct.id = this.last_id;
      // Actualizo el last_id
      this.last_id = this.last_id + 1;
      this.products.push(newProduct);

      const dataJson = JSON.stringify(this.products, null, '\t');
      const data = await fs.promises.writeFile(this.path, dataJson);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
class Product {
  constructor(title, description, price, thumbnail, code, stock) {

    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}
