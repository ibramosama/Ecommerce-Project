import axios from "axios"

var URL = "http://127.0.0.1:8000/api/"

const login = async (loginData)=>{
   
    console.log(loginData)
    return await axios.post(URL+'login/',loginData)
    .then(res =>{

        let token = res.data.access;
        localStorage.setItem('token',token);
        return res.status;
    })
    .catch(err => {
        console.error(err)
        return err.status
        }
    )
}
const register = async(registerData)=>{
    console.log(registerData)
    return await axios.post(URL+'register/', registerData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then(res =>{
        return res.status;
    })
    .catch(err => {
        console.error(err)
        return err.status
        }
    )
}
const updateUserInfo = async(data)=>{
    console.log(data.id)
    let request = {
        first_name: data.firstname,
        last_name: data.lastname,
        password: data.password,
        email: data.email
    }
    let token =localStorage.getItem('access');
    const auth = {
        headers:{Authorization:`Bearer ${token}`}
    }
    console.log(request)
    return axios.put(`http://127.0.0.1:8000/users/${data.id}/`, request )
    .then(res =>{
        return res.status;
    })
    .catch(err => {
        console.error(err)
        return err.status
    })
}
const getUser =(id) =>{

}
const logout =( ) =>{
    localStorage.clear();
    window.location.reload();
}
const IsAuthenticated =() =>{
    let token = localStorage.getItem('token')
    return token ? true : false
}
export {
    login,
    register,
    getUser,
    logout,IsAuthenticated,
    updateUserInfo
}