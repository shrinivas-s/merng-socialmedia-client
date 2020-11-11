import React, { useState } from 'react'

export const useForm=(initalState={})=>{
    const [values,setValues]=useState(initalState);
    const [errors,setErrors]=useState({});
    const onChange=(event)=>{
        setValues(val=>{return {...val,[event.target.name]:event.target.value}});
    }
    return {values,setValues,errors,setErrors,onChange}
}
