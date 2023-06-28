import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, IsAuthenticated } from '../../services/user.services';
import axios from 'axios';
import style from './NavigationBar.module.css';


function NavigationBar() {
  const [auth, setAuth] = useState(false);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0); 
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 1) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleLogout = () => {
    logout();
    window.location.reload();
  };


  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/products?search=${searchQuery}`);
    }
  };
  
  
  const handleAddToCart = () => {
    setCartCount(cartCount= + 1);
  };
  
  
  return (
    <div className={`${style.main_header}`}>
      <div
        className={`${style.header_higth} 
        d-flex mt-1 
        justify-content-between 
        align-items-center 
        container`}
      >
        <div className="logo mt-0">
          <img
            src="https://weblearnbd.net/tphtml/shofy-prv/shofy/assets/img/logo/logo.svg"
            alt="logo"
          ></img>
        </div>
        <div
          className={`${style.search_product} flex-fill d-none d-lg-flex d-md-flex flex-shrink justify-content-center`}
        >
              <input
      type="text"
      placeholder="Search for products"
      className={`${style.search}`}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    ></input>

        <button className={style.search_btn} onClick={handleSearch}>
          <i className="bi bi-search"></i>
        </button>

        </div>

        <div className="account-section d-flex align-items-center ">
          {IsAuthenticated() ? (
            <div className="" onClick={handleLogout}>
              logout
            </div>
          ) : (
            <a href="/login" className="d-flex align-items-center">
              <div className="m-1">
                <i className={`bi bi-person-circle ${style.account_logo}`}></i>
              </div>
              <div className="d-none d-lg-block lh-1">
                <div>Hello, sign in </div>
                <div>Your Account </div>
              </div>
              <div className=" d-block d-lg-none">Sign in</div>
            </a>
          )}

          <div className="ms-4">
          <i className="bi bi-arrow-down-up me-4 fs-5"></i>
          <Link to="/wishlist">
          <i className="bi bi-suit-heart me-4 fs-5" onClick={() => navigate("/wishlist")}></i>
          </Link> 
          <Link to="/Cart" className={style.cart_link}>
  <i className="bi bi-bag-check fs-5" onClick={() => navigate('/cart')}></i>
  {cartCount > 0 && <span className={style.cart_count}>{cartCount}</span>}
</Link>

        </div>
      </div>
      </div>
      <hr className={`${style.line_header} mt-1 m-0 `}></hr>
      <div
        className={`d-flex container justify-content-between ${
          show ? 'd-flex' : 'd-none'
        } ${style.second_header}`}
      >
        <div className="m-0">
          <nav className={`${style.navbar}`}>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarToggleExternalContent"
              aria-controls="navbarToggleExternalContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list fs-4 p-2"></i>
              <span className="fs-5 ms-2 d-none d-lg-inline d-md-inline ">
                All Department
              </span>
              <i className="bi bi-chevron-down fs-5 p-2 ms-2 d-none d-lg-inline d-md-inline"></i>
            </button>
          </nav>
          <div className="collapse " id="navbarToggleExternalContent">
            <div className={`${style.collapsed_content}`}>
              <h5 className="text-body-emphasis h4">Collapsed content</h5>
              <span className="text-body-secondary">
                Toggleable via the navbar brand.
              </span>
            </div>
          </div>
        </div>
        <div
          className={`${style.navbar_center} d-flex justify-content-center align-items-center mt-2 d-none d-lg-flex`}
        >
          <div className="flex-shrink-0">
             <Link to={`/home`}>Home</Link>
            
          </div>
          <div className="flex-shrink-0 ms-3">
               <Link to={`/Products`}>Products</Link>          

          </div>
  <div className="flex-shrink-0 ms-3">
            <Link to={`/profile`}>Profile</Link>          
          </div>

        </div>
        <div
          className={`${style.navbar_right} d-flex align-items- justify-content-end d-none d-lg-flex`}
        >
          <div className={`mt-2 me-3 `}>
            <i className={`bi bi-telephone-x fs-5 ${style.contact} `}></i>
          </div>
          <div className="lh-1 mt-2 ">
            <div> hotline:</div>
            <div className="fs-5 "> +(402) 763 282 46</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
