import { useState ,useEffect ,useRef } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import {login} from '../../services/user.services';
import Notification from '../Notification/Notification';
import styleLogin from './login.module.css';
function Login() {
    const navigate = useNavigate();
    let [FormsValues ,setFormsValues] = useState({
        email:'',
        password:''
    });
    let [LoginError,setLoginError] =useState(false) 
    const [disabled,setDisabled] = useState(true);
    let Inputemail =useRef(null)
    let Inputpassword =useRef(null)
    let [errors ,setErrors] = useState({
        email:null,
        password:null
    })
    let [errorRun,setErrorsRun]=useState(false)
    let [toastSuccessMsq,SettoastSuccessMsq] = useState(false)
    let [toastfailureMsq,SettoastfailureMsq] = useState(false)
    const handelsubmit = (event)=>{
        SettoastSuccessMsq(false)
        SettoastfailureMsq(false)
        setLoginError(false);
        event.preventDefault();
        if(errors.email || errors.password){
            setErrorsRun(true);
        }else{
            if(FormsValues){
                login(FormsValues)
                .then(result => {
                    console.log(result)
                    if(result == 200){
                        SettoastSuccessMsq(true);
                        setTimeout(() => {
                            
                            window.location.replace('/home')
                            
                        }, 2000);
                    }else{
                        SettoastfailureMsq(true);
                        setLoginError(true);
                    }
                })
                // console.log(result)
            }
            setErrorsRun(false);
        }
        
        // console.log(FormsValues)
    }
    const operationHandeler = (e) =>{
        // eslint-disable-next-line
        setErrorsRun(false)
        if(e.target.name == "email"){
            let regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
            if( regex.test(e.target.value)){
                setErrors({email:null})
                setFormsValues({...FormsValues, [e.target.name]:e.target.value})
            }else{
                setErrors({...errors,email:'invalid email , email should as mahmoud@email.com '});
            }
            console.log(errors)
            
        }
        // eslint-disable-next-line
        if(e.target.name == "password"){
            if(e.target.value.length >= 4){
                setFormsValues({...FormsValues, [e.target.name]:e.target.value})
                setErrors({password:null})
            }
            else{
                setErrors({...errors,password:'password must be at least 4 characters !'});
            }
        }

        // check disabled submit btn based on data
        console.log(Inputpassword.current.value.length)
        if(!Inputpassword.current.value.length || !Inputemail.current.value.length){
            setDisabled(true);
        }
        else{
            setDisabled(false);
        }
       
    }

    return ( 
        
        <div className={`container`}>
            {toastSuccessMsq ? (
            <Notification msg={"login successfuly !"} context={true}></Notification>
            ):''}
            {toastfailureMsq ? (
            <Notification msg={"loin failed  !"} context={false}></Notification>
            ):''}
            
            <div className="row justify-content-center mt-5">
                <h1 className='text-center mt-5 mb-3 '>My account  </h1>
                <div className={`${styleLogin.sign_form}`}>
                    <div className={`${styleLogin.form_content}`}>
                        <div className={`${styleLogin.header_from}`}>Login to Shofy</div>
                        
                        <div className='text-center'>
                             Don’t have an account? 
                             <span className={`${styleLogin.sign_text}`}><Link to="/register" className={`${styleLogin.sign_text}`}> Create a free account</Link> </span> </div>
                        <div>
                            <div className={`${styleLogin.login_icons} d-flex flex-wrap justify-content-center`}>
                                <div className={`${styleLogin.login_icon} d-flex  align-items-center flex-shrink-0`}>

                                    <div>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48" width="40px" height="40px">
                                    <path fill="#FFC107" 
                                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627
                                    ,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268
                                    ,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,
                                    3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" 
                                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087
                                    ,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg></div> 
                                    <div className='ms-3'>sign with google</div>
                                </div>
                                <div className={`${styleLogin.login_icon}`}>
                                    <i className={`bi bi-facebook ${styleLogin.facebook_icon}`}></i>
                                </div>
                                <div className={`${styleLogin.login_icon}`}>
                                    <i className={`bi bi-apple ${styleLogin.apple_icon}`}></i>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <hr className={`${styleLogin.break_line}`}></hr>
                                <div className={`text-center ${styleLogin.line_content}`}> or Sign in with username</div>
                            </div>
                            



                            <form onSubmit={handelsubmit}>
                                {LoginError ? (
                                    <div>
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <strong>Erorr</strong> email or password is incorrect. please try again.
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>
                                    
                                ):null}
                                


                                <div className="mb-2">
                                    <label htmlFor="InputEmail1" className={`${styleLogin.form_label}`}>Your email </label>
                                    <input name="email" ref={Inputemail} onChange={operationHandeler} 
                                    className={`${(errors.username && errorRun) ? styleLogin.error_input:styleLogin.form_input}`} 
                                     id="InputEmail1" placeholder=' shopfy@mail.com ' aria-describedby="emailHelp"/>

                                    {/* validation error msg  */}
                                    <div className={`${styleLogin.errorMsg}`}>
                                    {(errors.username && errorRun) ? errors.email : null}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="InputPassword1" className={`${styleLogin.form_label }`}>Password</label>
                                    <input type="password" ref={Inputpassword} name="password" onChange={operationHandeler} 
                                    className={`${(errors.password && errorRun) ? styleLogin.error_input:styleLogin.form_input}`} 
                                    placeholder=' Min. 6 character' id="InputPassword1"/>

                                    {/* validation error msg  */}
                                    <div className={`${styleLogin.errorMsg}`}>
                                        {(errors.password && errorRun) ? errors.password : null}
                                    </div>
                                </div>
                                <div>
                                    <button type="submit"  
                                    className={`${styleLogin.form_submit_btn}`}
                                    disabled={disabled}
                                    >Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;