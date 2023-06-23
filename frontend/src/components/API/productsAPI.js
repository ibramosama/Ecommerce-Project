import axios from "axios";

const baseURL = "http://localhost:8000/api/products/";

const getAllProduct = () => axios.get(baseURL);

const getProduct = (productId) => axios.get(`${baseURL}/${productId}`);

const addProduct = (product) => axios.post(baseURL, product);

const deleteProduct = (productId) => axios.delete(`${baseURL}/${productId}`);

const editProduct = (productId, product) =>
  axios.put(`${baseURL}/${productId}`, product);

export const productAPI = {
  getAllProduct,
  addProduct,
  deleteProduct,
  editProduct,
  getProduct,
};
