import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notification.css'
function Notification(props) {
    useEffect(() => {
        console.log("asdasd");
        if(props.context){
            toast.success(props.msg, {
                position: toast.POSITION.TOP_RIGHT
            })
        }else{
            toast.error(props.msg, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        
    },[])
    return ( 
        <div>
            <ToastContainer className={"toast-position"} />
        </div>
     );
}

export default Notification;