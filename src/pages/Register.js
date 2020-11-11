import { gql, useMutation, useQuery } from '@apollo/client';
import React,{useContext, useState} from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Form, Input, Message, Image, Dropdown } from 'semantic-ui-react'
import { UserContext } from '../userContext';
import { AVATARS } from '../util/Avatar';
import { useForm } from '../util/hooks/useForm';

const REGISTER_USER_QUERY=gql`
    mutation register($username:String!,$avatar:String!,$email:String!,$password:String!,$confirmPassword:String!){
        register(
            registerInput:{
                username:$username
                avatar:$avatar
                email:$email
                password:$password
                confirmPassword:$confirmPassword
        }){
            username
            avatar
            email
            token
        }
    }
`
function Register() {
    
    const initialState={
        username:'',
        avatar:AVATARS[0].value,
        email:'',
        password:'',
        confirmPassword:''
    }
    const [user,setUser] = useContext(UserContext);
    const {values,setValues,errors,setErrors,onChange} = useForm(initialState);
    const [loading, setLoading] = useState(false);
    const [register] = useMutation(REGISTER_USER_QUERY)
    
    const history = useHistory();
   
    const addUser=(event)=>{
        event.preventDefault();
        setLoading(true);
        register({variables:{...values}}).then(
        ({ data : {register} }) => {
            setLoading(false);
            setErrors({});
            if(register){
                setUser(register);
                window.localStorage.setItem('iam',JSON.stringify(register));
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
                    
                    <Form.Group >
                        <Form.Input
                            id='form-input-control-error-username'
                            typ='text'
                            label='Username'
                            name='username'
                            placeholder='iamjoe'
                            value={values.username}
                            onChange={onChange}
                            error={errors.username ? true : false}
                            width={14}
                        />
                        <Form.Field width={2} style={{marginTop:"33px"}}>
                            <Dropdown
                                placeholder='Select Avatar'
                                inline
                                options={AVATARS}
                                value={values.avatar}
                                onChange={(_,{value})=>setValues({...values,avatar:value})}
                                pointing="left"
                            />
                        </Form.Field>
                    </Form.Group>
                    
                    <Form.Input
                    
                        id='form-input-control-error-email'
                        name='email'
                        type='text'
                        label='Email'
                        placeholder='joe@schmoe.com'
                        value={values.email}
                        onChange={onChange}
                        error={errors.email ? true : false}
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
                    <Form.Input
                        id='form-input-control-error-confirmpassword'
                        name='confirmPassword'
                        type='password'
                        label='Confirm Password'
                        value={values.confirmPassword}
                        onChange={onChange}
                        error={errors.password ? true : false}
                    />
                    <Button disabled={loading} type='submit' primary>Register</Button>
                    {<Message error list={Object.values(errors)}/>}
                </Form>
            </Container>
        </div>
    )
}

export default Register
