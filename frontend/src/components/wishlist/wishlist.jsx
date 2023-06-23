import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './wishlist.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../index';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const Wishlist = () => {
  const user = useContext(UserContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wishlist items from the API
    const fetchWishlistItems = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/wishlist-items/get_user_wishlist/?user_id=${user.user_id}`);
          const itemsWithProductDetails = await Promise.all(
            response.data.map(async (item) => {
              const product = await getProductDetails(item.product);
              return { ...item, product };
            })
          );
          setWishlistItems(itemsWithProductDetails);
        } catch (error) {
          console.error('Error fetching wishlist items:', error);
        }
      };
      
    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/wishlist-items/${itemId}/`);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const getProductDetails = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
      const product = response.data;
      return product;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  return (
    <div>
      <h2>Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div>
          <ul className="cart-items"> {/* Use the same class as in the Cart component */}
            {wishlistItems.map((item) => (
              <li key={item.id} className="cart-item"> {/* Use the same class as in the Cart component */}
                <div className="product-details">
                  <img className="product-image" src={item.product.image_url} alt={item.product.title} /> {/* Use the same class as in the Cart component */}
                  <div className="product-info">
                    <h3>{item.product.title}</h3>
                    <p className="price">Price: {item.product.price}</p>
                    <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button> {/* Use the same class as in the Cart component */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
