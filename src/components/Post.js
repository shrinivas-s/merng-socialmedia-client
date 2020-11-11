import React,{useContext, useState} from 'react'
import { Icon, Label, Card, Button, Image } from 'semantic-ui-react'
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { UserContext } from '../userContext';
import { DELETE_POST_QUERY, GET_POSTS_QUERY, LIKE_POST_QUERY } from '../util/graphql';
import { getAvatarImg } from '../util/Avatar';

function Post({id,username,avatar,body,createdAt,likes,likeCount,commentCount}) {
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
            }
        ).catch(e=>{})
    }
    return (
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
                 <Label basic color='teal' as='a' basic pointing='left'>
                {likeCount}
                </Label>
            </Button>
            <Link to={`/posts/${id}`}>
            <Button as='div' labelPosition='right'>
                <Button  basic color="blue">    
                    <Icon name='comment' />
                </Button>
                 <Label basic color="blue" pointing='left'>
                {commentCount}
                </Label>
            </Button>
            </Link>
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
    )
}



export default Post
