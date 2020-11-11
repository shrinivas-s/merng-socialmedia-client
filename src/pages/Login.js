import { gql, useMutation, useQuery } from '@apollo/client';
import React,{useContext, useState} from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Form, Input, Message } from 'semantic-ui-react'
import { UserContext } from '../userContext';
import { useForm } from '../util/hooks/useForm';

const LOGIN_USER_QUERY=gql`
    mutation login($username:String!,$password:String!){
        login(username:$username password:$password){
            username
            avatar
            email
            token
        }
    }
`
function Login() {
    const history = useHistory();
    const [user,setUser]=useContext(UserContext);
    const initialState={
        username:'',
        password:'',
    }
    const {values,errors,setErrors,onChange} = useForm(initialState);
    const [login] = useMutation(LOGIN_USER_QUERY);
    const [loading, setLoading] = useState(false); 
   
    const addUser=(event)=>{
        event.preventDefault();
        setLoading(true);
        login({variables:{...values}})
        .then(
        ({ data : {login} }) => {
            setLoading(false);
            setErrors({});
            if(login){
                setUser(login);
                window.localStorage.setItem('iam',JSON.stringify(login));
                history.replace("/");
            }
        }, 
        error => {
            const gqlErrors=error.graphQLErrors[0];
            setErrors({...gqlErrors.extensions.exception,stacktrace:undefined});    
            setLoading(false);
        }) 
    }
    
    return (
        <div style={{width:"400px",margin:"auto"}}>
            <Container>
                <Form onSubmit={addUser} 
                noValidate 
                className={loading ? "loading" : ""}
                error={Object.keys(errors).length>0 ? true : false}>
                <Form.Input
                        id='form-input-control-error-username'
                        typ='text'
                        label='Username'
                        name='username'
                        placeholder='iamjoe'
                        value={values.username}
                        onChange={onChange}
                        error={errors.username ? true : false}
                    />
                    <Form.Input
                        id='form-input-control-error-password'
                        name='password'
                        type='password'
                        label='Password'
                        value={values.password}
                        onChange={onChange}
                        error={errors.password ? true : false}
                    />
                    <Button disabled={loading} type='submit' primary>Login</Button>
                    {<Message error list={Object.values(errors)}/>}
                </Form>
            </Container>
        </div>
    )
}

export default Login
