import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import { BrowserRouter } from 'react-router-dom';
import { createContext } from 'react';
import jwt_decode from "jwt-decode";
const getUser =()=>{
  const token = localStorage.getItem('token')
  var user;
  if(token){
    var user = jwt_decode(token);
    console.log(user);
    return user;
  }else{
    user=null;
  }
}
let userData = getUser();
console.log(userData);
export const UserContext = createContext(null);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
<UserContext.Provider value={userData} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
</UserContext.Provider>
  
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();