import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Cart.css';
import { UserContext } from '../../index';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const Cart = () => {
  const user = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user-cart/?user_id=${user.user_id}`);
      const itemsWithProductDetails = await Promise.all(
        response.data.map(async (item) => {
          const product = await fetchProductDetails(item.product);
          return { ...item, product };
        })
      );
      setCartItems(itemsWithProductDetails);
      calculateTotalPrice(itemsWithProductDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/delete/${itemId}/`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      calculateTotalPrice(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Start shopping now!</p>
      ) : (
        <div>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="product-details">
                  <img className="product-image" src={item.product.image_url} alt={item.product.title} />
                  <div className="product-info">
                    <h3>{item.product.title}</h3>
                    <p className="price">${item.product.price}</p>
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="total-price">
            <p>Total: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
