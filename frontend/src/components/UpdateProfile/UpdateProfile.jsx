import { UserContext } from '../../index';
import { useContext ,useEffect, useState ,useRef } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import style from '../Register/Register.module.css';
import {updateUserInfo} from '../../services/user.services'
import Notification from '../Notification/Notification';
function UpdateProfile() {
    const user = useContext(UserContext);
    let [userData,setUserData] = useState();
    let [toastSuccessMsq,SettoastSuccessMsq] = useState(false)
    let [toastfailureMsq,SettoastfailureMsq] = useState(false)
    var URL = "http://127.0.0.1:8000/api/"
    useEffect(() => {
        axios.get(URL+`users/${user.user_id}`)
        .then(res =>{
            if(res.status==200){
                console.log(res.data)
                setUserData(res.data)
            }
        })
        .catch(err => {
            console.error(err)
            return err.status
            }
        )
    },[])
    const navigate = useNavigate();
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    let [FormsValues ,setFormsValues] = useState({
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        image:null,
        id:null
    });

    let [RegisterError,setRegisterError] =useState(false) 
    const [disabled,setDisabled] = useState(true);
    let Inputemail =useRef(null)
    let Inputpassword =useRef(null)
    let Inputfirstname =useRef(null)
    let Inputlastname =useRef(null)
    //  errer msg if field have something wrong 
    let [errors ,setErrors] = useState({
        firstname:null,
        lastname:null,
        email:null,
        password:null
    })
    
    let [errorRun,setErrorsRun]=useState(false)
    const handelsubmit = (event)=>{
        setRegisterError(false)
        event.preventDefault();
        // console.log(errors.email ,errors.password)
        if(errors.email || errors.password || errors.firstname || errors.lastname){
            setErrorsRun(true);
        }else{
            if(FormsValues){
                FormsValues.id= userData.id
                FormsValues.email = FormsValues.email ? FormsValues.email :  event.target.email.value
                FormsValues.firstname =FormsValues.firstname ? FormsValues.firstname : event.target.firstname.value
                FormsValues.lastname =FormsValues.lastname ? FormsValues.lastname : event.target.lastname.value
                FormsValues.password = FormsValues.password ? FormsValues.password: event.target.password.value;
                updateUserInfo(FormsValues).then((res) =>{
                    console.log(res)
                    if(res == 200){
                        SettoastSuccessMsq(true);
                        setTimeout(() => {
                            navigate('/home')
                        }, 2000);
                    }
                });
                
                
            }
            setErrorsRun(false);
        }
        
        // console.log(FormsValues)
    }
    const operationHandeler = (e) =>{
        // eslint-disable-next-line
        // setErrorsRun(false)
        console.log(errors)
        if(e.target.name == "email"){
            let regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
            console.log(regex.test(e.target.value))
            console.log(e.target.value)
            if( regex.test(e.target.value) ){
                setErrors({...errors,email:null})
                setFormsValues({...FormsValues, [e.target.name]:e.target.value})
            }else{
                
                setErrors({...errors,email:'invalid email address ! , example formate mahmoud@example.com'});
            }
            console.log(errors)
        }
        if(e.target.name == "firstname"){
            

            if( e.target.value ){
                setErrors({...errors,firstname:null})
                setFormsValues({...FormsValues, [e.target.name]:e.target.value})
            }else{
                setErrors({...errors,firstname:'invalid username'});
            }
            console.log(errors)
            
        }
        if(e.target.name == "lastname"){
            

          if( e.target.value ){
              setErrors({...errors,lastname:null})
              setFormsValues({...FormsValues, [e.target.name]:e.target.value})
          }else{
              setErrors({...errors,lastname:'invalid username'});
          }
          console.log(errors)
          
        }
        // eslint-disable-next-line
        if(e.target.name == "password"){
            if(e.target.value.length >= 4){
                setFormsValues({...FormsValues, [e.target.name]:e.target.value})
                setErrors({...errors,password:null})
            }
            else{
                setErrors({...errors,password:'password must be at least 4 characters !'});
            }
        }
        

        // check disabled submit btn based on data
        console.log(Inputpassword.current.value.length)
        if(!Inputpassword.current.value.length  || 
           !Inputemail.current.value.length     ||  
           !Inputfirstname.current.value.length || 
           !Inputlastname.current.value.length ){
            setDisabled(true);
        }
        else{
            setDisabled(false);
        }
       
    }
    
    console.log(user)
    console.log(userData);
    return (    
    <div className={`${style.register_from} container`}>
            {toastSuccessMsq ? (
                <Notification msg={"information is updated  successfuly !"} context={true}></Notification>
            ):''}
            <div className="row justify-content-center mt-5">

                <h1 className='text-center mt-5 mb-3 '>Update Profile  </h1>
                <div className={`${style.sign_form}`}>
                    <div className={`${style.form_content}`}>
                       
                        <div>
                            
                            <form onSubmit={handelsubmit}>
                                <div className="mb-2">
                                    <label htmlFor="exampleInputusername1" className={`${style.form_label}`}>First Name </label>
                                    <input type="text" 
                                    // onChange={operationHandeler} 
                                    ref={Inputfirstname}
                                    name="firstname"
                                    defaultValue={userData?.first_name || ''}
                                    className={`${(errors.firstname && errorRun) ? style.error_input:style.form_input}`}
                                    id="exampleInputEmail1" 
                                    placeholder=' mahmoud  ' aria-describedby="emailHelp"/>
                                    {/* validation error msg  */}
                                    <div className={`${style.errorMsg}`}>
                                    {(errors.firstname && errorRun) ? errors.firstname : null}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="exampleInputusername1" className={`${style.form_label}`}>Last Name </label>
                                    <input type="text" 
                                    onChange={operationHandeler} 
                                    ref={Inputlastname}
                                    name="lastname"
                                    defaultValue={userData?.last_name || ''}
                                    className={`${(errors.firstname && errorRun) ? style.error_input:style.form_input}`}
                                    id="exampleInputEmail1" 
                                    placeholder=' ramadan  ' aria-describedby="emailHelp"/>
                                    {/* validation error msg  */}
                                    <div className={`${style.errorMsg}`}>
                                    {(errors.lastname && errorRun) ? errors.lastname : null}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="exampleInputEmail1" className={`${style.form_label}`}>Your Email </label>
                                    <input type="text" 
                                    onChange={operationHandeler} 
                                    ref={Inputemail}
                                    name="email"
                                    defaultValue={userData?.email || ''}
                                    className={`${(errors.email && errorRun) ? style.error_input:style.form_input}`}
                                    id="exampleInputEmail1" 
                                    placeholder=' shopfy@mail.com ' aria-describedby="emailHelp"/>
                                    {/* validation error msg  */}
                                    <div className={`${style.errorMsg}`}>
                                    {(errors.email && errorRun) ? errors.email : null}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="exampleInputPassword1" className={`${style.form_label}`}>Password</label>
                                    <input type="password"
                                    onChange={operationHandeler} 
                                    ref={Inputpassword}
                                    name="password"
                                    className={`${(errors.password && errorRun) ? style.error_input:style.form_input}`}
                                    placeholder=' Min. 6 character' 
                                    id="exampleInputPassword1"/>
                                    {/* validation error msg  */}
                                    <div className={`${style.errorMsg}`}>
                                    {(errors.password && errorRun) ? errors.password : null}
                                    </div>
                                </div>
                                
                             
          
                                <div>
                                    <button type="submit" disabled={disabled} className={`${style.form_submit_btn}`}>Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>         
    );
}

export default UpdateProfile;