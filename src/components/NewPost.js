import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import { GET_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks/useForm'

function NewPost({marginBottom}) {
    const initalState={
        body:''
    }
    const {values,setValues,errors,onChange} = useForm(initalState);
    const [addPost,{client}] = useMutation(ADD_POST_QUERY);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const onSubmit=()=>{
        setLoading(true);
        addPost({variables:values})
        .then(
            ({data:{createPost}})=>{
                if(createPost && createPost.id){
                    const {getPosts}=client.readQuery({query:GET_POSTS_QUERY});
                    client.writeQuery({
                                    query:GET_POSTS_QUERY,
                                    data:{getPosts:[createPost,...getPosts]}
                                });
                }
                setValues(initalState);
                setLoading(false);
            },
            error=>setLoading(false)
        ).catch(e=>setLoading(false))
        
    }
    return (
        <Form onSubmit={onSubmit} 
                noValidate 
                className={loading ? "loading" : ""}
                error={Object.keys(errors).length>0 ? true : false}>
                    {/* <h2>Create Post:</h2> */}
                    <div style={marginBottom ? {marginBottom:"40px"} : {}}></div>
                <Form.Input
                        id='form-input-control-error-username'
                        typ='text'
                        name='body'
                        placeholder="What's on your mind ? "
                        value={values.body}
                        onChange={onChange}
                        error={errors.body ? true : false}
                        autoComplete="off"
                    />
                    <Button color="teal" disabled={loading || values.body.trim().length==0} type='submit'>Post</Button>
                    {<Message error list={Object.values(errors)}/>}
        </Form>
    )
}

const ADD_POST_QUERY=gql`
mutation createPost($body:String!){
    createPost(body:$body){
        id username body createdAt likeCount commentCount
            likes{
                username
            }
            comments{
                id username body createdAt
            }
    }
}
`

export default NewPost
