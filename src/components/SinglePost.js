import React,{useContext, useRef, useState} from 'react'
import { Icon, Label, Card, Button, Image, CommentGroup, Comment, Form, Ref, Popup } from 'semantic-ui-react'
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { UserContext } from '../userContext';
import PostComment from '../components/PostComment';
import { GET_POST_QUERY, LIKE_POST_QUERY, CREATE_COMMENT_QUERY, DELETE_POST_QUERY, GET_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks/useForm';
import { getAvatarImg } from '../util/Avatar';

function SinglePost(props) {

    const postId = props.match.params.postId;
    const history = useHistory();
    const commentInput = useRef();
    
    const {loading,error,
           data:{getPost:{id,username,avatar,body,createdAt,
          likes=[],comments=[],likeCount,commentCount}={}}={}} = useQuery(GET_POST_QUERY,
                                                                         {variables:{postId}}); 
    const [user,setUser] = useContext(UserContext);
    const [liked,setLiked]=useState(user ? likes.findIndex(liked=>liked.username==user.username)!=-1 : false);
    
    const [likePostMutation] = useMutation(LIKE_POST_QUERY);
   
    const likePost=()=>{
        likePostMutation({variables:{'postId':id}})
        .then(
            ({ data : {likePost} }) =>{
                setLiked(likePost.likes.findIndex(liked=>liked.username==user.username)!=-1)
            }
        ).catch(e=>{})
    }

    const likedBy=()=>{
        let likedByUser=false;
        let likeStr = likes.reduce((str,{username})=>{
            if(user.username==username){
                likedByUser=true;
                return str;
            }
            str+=str.length>0 ? "," : "";
            return str + (user.username==username ? 'You' : username);
        },"");
        return (likedByUser ? "You," : "")+likeStr+' liked this';
    }
    
    const intialState={body:''};
    const {values,setValues,onChange} = useForm(intialState);

    const [commentPostMutation,{loading:loadingNewComment}] = useMutation(CREATE_COMMENT_QUERY);

    const commentOnPost=()=>{
        commentPostMutation({variables:{postId,body:values.body}})
        .then(result=>{setValues(intialState)},
              error => console.log(error))
        .catch(e=>{console.log(e)});
    }

    const [deletePostMutation,{client}] = useMutation(DELETE_POST_QUERY);
    
    const deletePost=()=>{
        deletePostMutation({variables:{'postId':id}})
        .then(
            ()=>{
                const {getPosts}=client.readQuery({query:GET_POSTS_QUERY});
                client.writeQuery({
                    query:GET_POSTS_QUERY,
                    data:{getPosts:getPosts.filter(post=>post.id!=id)}
                });
                history.replace("/home");
            }
        ).catch(e=>{})
    }
    return (
    <div>
        {error && <h2>Post not found</h2>}
        {loading && <h2>Loading...</h2>}
        
        {!error && !loading &&
        <>
        <Card fluid>
        <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={getAvatarImg(avatar)}
        />
            <Card.Header>{username}</Card.Header>
            <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
            <Card.Description>
                {body}
            </Card.Description>
        </Card.Content>

        {user && 
        <Card.Content extra>
            <Button as='div' labelPosition='right'>
                <Button basic={liked ? false : true} color='teal' onClick={likePost}>
                    <Icon name='heart'/> 
                </Button>
                 {likeCount>0 ? 
                 <Popup content={likedBy()} 
                        trigger={<Label basic color='teal' as='a' basic pointing='left'>{likeCount}</Label>}
                />
                :
                <Label basic color='teal' as='a' basic pointing='left'>{likeCount}</Label>
                }
                
            </Button>
            <Button as='div' labelPosition='right' onClick={()=>commentInput.current.children[0].focus()}>
                <Button  basic color="blue">    
                    <Icon name='comment' />
                </Button>
                 <Label as='a' basic color="blue" pointing='left'>
                {commentCount}
                </Label>
            </Button>
            {user.username==username && 
            <Button as='div' labelPosition='right' floated="right" onClick={deletePost}>
                <Button color="red" >
                <Icon name='trash' style={{margin:"auto"}}/>
                </Button>
            </Button>
            }
        </Card.Content>
        }
    </Card>
    <CommentGroup size='large' style={{marginBottom:"20px"}}>
        {comments && comments.map(comment=><PostComment {...comment} key={comment.id}/>)}
        {user && 
        <Form reply fluid>
            
            <Form.Group>
            <Comment>
                <Form.Field width={1}>
                    <Comment.Avatar as='a' src={getAvatarImg(user.avatar)} />
                </Form.Field>
            </Comment>
            <Ref innerRef={commentInput}>
                <Form.TextArea width={10} name="body" style={{height:"5em"}} value={values.body} onChange={onChange} autoFocus/>
            </Ref>
         </Form.Group>
        <Button disabled={loadingNewComment} content='Add Comment' labelPosition='left' icon='edit' primary onClick={commentOnPost} />
         </Form>}
    </CommentGroup>
    </>
    }
    </div>
    )
}



export default SinglePost
