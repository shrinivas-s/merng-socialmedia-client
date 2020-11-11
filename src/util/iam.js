import jwtDecode from "jwt-decode";

export const iam=()=>{
    if(localStorage.getItem('iam')){
      try{
        const decodeToken = jwtDecode(JSON.parse(localStorage.getItem('iam')).token);
        if(decodeToken.exp*1000 >Date.now()){
          return JSON.parse(window.localStorage.getItem('iam'));
        }else{
          localStorage.removeItem('iam');
        }
      }catch(e){
        console.log(e);
      }
    }
  }