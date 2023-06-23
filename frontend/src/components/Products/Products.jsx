import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaCartPlus, FaEye, FaHeart, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Products.css';
import { UserContext } from '../../index';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const accessToken =  localStorage.getItem('token');

const Products = ({ selectedCategoryId, categoryId }) => {
  const user = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');
  const navigate = useNavigate();
  const is_admin = user.is_admin || false; 

  useEffect(() => {
    fetchProducts(selectedCategoryId || categoryId, searchQuery);
  }, [selectedCategoryId, categoryId, searchQuery]);

  const fetchProducts = async (categoryId, query) => {
    try {
      let url = 'http://localhost:8000/api/products/';
      if (categoryId) {
        url = `http://localhost:8000/api/categories/${categoryId}/products/`;
      }
      if (query) {
        url += `${categoryId ? '&' : '?'}q=${query}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const response = await axios.post('http://localhost:8000/add/', {
        user: user.user_id,
        product: productId,
        quantity: quantity,
      });

      console.log(quantity);
      if (response.status === 200) {
        setCartCount((prevCount) => prevCount + quantity);
        console.log(`Added ${quantity} quantity of product to the cart`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateClick = (productId) => {
    if (is_admin) {
      navigate(`/products/${productId}/update`); // Navigate to the UpdateProduct component
    } else {
      console.log('Only admin users can update products.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (is_admin) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/products/${productId}/`, 
       {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('Product deleted successfully:', response.data);
        fetchProducts(selectedCategoryId || categoryId, searchQuery);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Only admin users can delete products.');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await axios.post('http://localhost:8000/api/wishlist-items/', {
        user: user.user_id,
        product: productId
      });
  
      if (response.status === 201) {
        const addedProduct = response.data;
        setWishlistItems([...wishlistItems, addedProduct]);
        console.log('Product added to wishlist:', addedProduct);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = () => {
    if (user.is_admin) {
      navigate('/products/update');
    } else {
      console.log('Only admin users can create posts.');
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image-container">
              <img className="product-image" src={product.image_url} alt={product.title} />
              <div className="overlay">
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product.id, quantity)}>
                  <FaCartPlus className="icon" />
                  Add to Cart
                </button>
                <button className="quick-view-btn" onClick={() => handleQuickView(product)}>
                  <FaEye className="icon" />
                  Quick View
                </button>
                <button className="wishlist-btn" onClick={() => handleAddToWishlist(product.id)}>
                  <FaHeart className="icon" />
                  Add to Wishlist
                </button>
              </div>
            </div>
            <div className="product-details">
              <div>
                <h3>{product.title}</h3>
                <p className="price">${product.price}</p>
                <p className="details">{product.details}</p>
              </div>
              <div className="product-actions">
                {is_admin && (
                  <>
                    <Link
                      to={`/products/${product.id}/update`}
                      className="update-link"
                      onClick={() => handleUpdateClick(product.id)}
                    >
                      Update
                    </Link>
                    <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                      <FaTrash className="delete-icon" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="quick-view-modal">
          <div className="quick-view-content">
            <button className="close-btn" onClick={handleCloseQuickView}>
              Close
            </button>
            <div className="quick-view-details">
              <div className="quick-view-image-container">
                <img
                  className="quick-view-image"
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title}
                />
              </div>
              <div className="quick-view-info">
                <h3>{selectedProduct.title}</h3>
                <p className="price">${selectedProduct.price}</p>
                <p className="details">{selectedProduct.description}</p>
                <div className="quick-view-actions">
                  <div className="quantity-container">
                    <button className="quantity-btn" onClick={handleQuantityDecrease}>
                      <FaMinus className="quantity-icon" />
                    </button>
                    <input className="quantity-input" type="text" value={quantity} readOnly />
                    <button className="quantity-btn" onClick={handleQuantityIncrease}>
                      <FaPlus className="quantity-icon" />
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct.id, quantity)}
                  >
                    <FaCartPlus className="icon" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {is_admin && (
        <button className="create-post-btn" onClick={handleCreatePost}>
          Create New Post
        </button>
      )}
    </div>
  );
};

export default Products;
