import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CategoryList.css'; // Import CSS file for styling
import Products from '../Products/Products'; // Import the Products component

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Add state for selected category ID

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      console.log('Response:', response.data);

      const updatedCategories = response.data.map((category) => {
        return {
          ...category,
          products: [],
        };
      });

      const fetchProductsPromises = updatedCategories.map((category) => {
        return axios
          .get(`http://localhost:8000/api/categories/${category.id}/products/`)
          .then((response) => {
            const updatedCategory = {
              ...category,
              products: response.data,
            };
            return updatedCategory;
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
            return category; // Return the original category if fetching products fails
          });
      });

      Promise.all(fetchProductsPromises).then((updatedCategories) => {
        setCategories(updatedCategories);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryImage = (category) => {
    if (category.products && category.products.length > 0) {
      return category.products[0].image_url;
    }
    return ''; // Return a fallback image URL or an empty string
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId); // Update the selected category ID
  };

  return (
    <div>
      <h1>Categories</h1>
      <div className="category-list">
        {categories.map((category) => (
          <div className="product-category" key={category.id}>
            <Link
              to={`/Home`}
              className="category-link"
              onClick={() => handleCategoryClick(category.id)} // Add onClick event handler
            >
              <div className="category-image-container">
                <img className="category-image" src={getCategoryImage(category)} alt={category.title} />
              </div>
              <div className="category-details">
                <span className="category-title">{category.title}</span>
                <br></br>
                <span className="category-product-count">
                  {category.products ? category.products.length : 0} Product
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
<Products selectedCategoryId={selectedCategoryId} categoryId={selectedCategoryId} />
    </div>
  );
};

export default CategoryList;
