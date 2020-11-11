import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../userContext'

function PrivateRoute({component:Component,...rest}) {
    const [user] = useContext(UserContext);
    return (
        <Route 
        {...rest}
        render={(props)=>user ? <Redirect to='/' /> : <Component {...props} /> }
        />
    )
}

export default PrivateRoute
