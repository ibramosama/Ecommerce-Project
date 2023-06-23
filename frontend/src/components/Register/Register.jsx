import style from './Register.module.css';
import { useState ,useRef ,useEffect} from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import {register} from '../../services/user.services';
function Register() {
    const navigate = useNavigate();
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    let [FormsValues ,setFormsValues] = useState({
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        image:null
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
        console.log(errors.email ,errors.password)
        if(errors.email || errors.password || errors.firstname || errors.lastname){
            setErrorsRun(true);
        }else{
            if(FormsValues){
                let formData = new FormData(); 
                formData.append('email',FormsValues.email)
                formData.append("first_name",FormsValues.firstname)
                formData.append("last_name",FormsValues.lastname)
                formData.append("password",FormsValues.password);
                formData.append('file',FormsValues.image)
                register(formData).then((result)=>{
                    console.log(result)
                    if(result == 201){
                        setTimeout(() => {
                            navigate('/home')
                        }, 2000);
                    }else{
                        setRegisterError(true)

                    }
                }).catch((error)=>{
                    setRegisterError(true)
                })
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
        if(e.target.name == "profile_image"){
          console.log(e.target.value)
          console.log(e.target.files[0])
          if(e.target.files[0]){  
            setFormsValues({...FormsValues,[e.target.name]:e.target.files[0]})
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
    

    return ( 
        <div className={`${style.register_from} container`}>
            <div className="row justify-content-center mt-5">

                <h1 className='text-center mt-5 mb-3 '>Register Now </h1>
                <div className={`${style.sign_form}`}>
                    <div className={`${style.form_content}`}>
                        <div className={`${style.header_from}`}>Sign Up Shofy</div>
                        
                        <div className='text-center'> already have an account ? <span className={`${style.sign_text}`}><Link to="/login" className={`${style.sign_text}`}>sign in</Link></span> </div>
                        <div>
                            <div className={`${style.register_icons} d-flex justify-content-center flex-wrap flex-shrink-0`}>
                                <div className={`${style.register_icon} d-flex align-items-center`}>

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
                                <div className={`${style.register_icon}`}>
                                    <i className={`bi bi-facebook ${style.facebook_icon}`}></i>
                                </div>
                                <div className={`${style.register_icon}`}>
                                    <i className={`bi bi-apple ${style.apple_icon}`}></i>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <hr className={`${style.break_line}`}></hr>
                                <div className={`text-center ${style.line_content}`}>or Sign up with Email</div>
                            </div>
                            { RegisterError ? (
                                    <div>
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <strong>Erorr</strong> email already exists ,please try another email !
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>
                                    
                                ):null}
                            <form onSubmit={handelsubmit}>
                                <div className="mb-2">
                                    <label htmlFor="exampleInputusername1" className={`${style.form_label}`}>First Name </label>
                                    <input type="text" 
                                    onChange={operationHandeler} 
                                    ref={Inputfirstname}
                                    name="firstname"
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
                                <div className="mb-2">
                                    <label for="formFile" class={`${style.form_label}`}>Upload Your image</label>
                                    <input accept="image/*" 
                                    onChange={operationHandeler} 
                                    class={`${style.form_input}`} 
                                    id="formFileLg" name="profile_image" type="file"></input>
                                    
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

export default Register;