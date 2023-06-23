import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { productAPI } from "../API/productsAPI";
import { categoriesAPI } from "../API/categoriesAPI";

export default function UpdateProduct() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  let [product, setProduct] = useState({});
  let [formValues, setFormValues] = useState({
    title: "",
    price: "",
    description: "",
    image_url: "",
    category: ""
  });

  const accessToken =  localStorage.getItem('token');

  let formOperation = (e) => {
    e.preventDefault();

    if (!id) {
      console.log(formValues);
      axios
        .post("http://localhost:8000/api/products/", formValues, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then((response) => {
          navigate("/products");
        });
    } else {
      axios
        .put(`http://localhost:8000/api/products/${id}/`, formValues, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(() => {
          navigate("/products");
        });
    }
  };

  let OperationHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  let deleteProduct = async () => {
    try {
      await productAPI.deleteProduct(id);
      navigate("/products");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  let getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${id}/`,
      );
      setProduct(response.data);
      setFormValues(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (id !== "0") {
      getProduct();
    }
  }, []);

  return (
    <div className='container mt-5 alert alert-secondary p-5'>
      <Form onSubmit={formOperation}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            onChange={OperationHandler}
            name='title'
            type='text'
            placeholder='Enter Product Name'
            defaultValue={product.title}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            onChange={OperationHandler}
            name='price'
            type='number'
            placeholder='Enter Product Price'
            defaultValue={product.price}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={OperationHandler}
            name='description'
            type='text'
            placeholder='Enter Product description'
            defaultValue={product.description}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
  <Form.Label>Image</Form.Label>
  <Form.Control
    onChange={OperationHandler}
    name='image_url'
    type='text'
    placeholder='Enter Product Image URL'
    defaultValue={product.image_url}
  />
</Form.Group>

<Form.Group className='mb-3' controlId='category'>
  <Form.Label>Category</Form.Label>
  <Form.Control
    as='select'
    onChange={OperationHandler}
    name='category'
    value={formValues.category}
    defaultValue={product.category}
  >
    <option value=''>Select a category</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.title}
      </option>
    ))}
  </Form.Control>
</Form.Group>


        <Button variant='dark' type='submit'>
          {id == 0 ? "Add Product" : "Edit Product"}
        </Button>

      </Form>
    </div>
  );
}