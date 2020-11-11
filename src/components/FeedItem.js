import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Feed, Icon, Popup } from 'semantic-ui-react'
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { UserContext } from '../userContext';
import { LIKE_POST_QUERY } from '../util/graphql';
import { getAvatarImg } from '../util/Avatar';


function FeedItem({id,username,avatar,body,createdAt,likes,likeCount,commentCount}) {
  const [user,setUser] = useContext(UserContext);
  const [liked,setLiked]=useState(user ? likes.findIndex(liked=>liked.username==user.username)!=-1 : false);
  const [likePostMutation] = useMutation(LIKE_POST_QUERY);
  const history=useHistory();
  const likePost=()=>{
    if(user){
        likePostMutation({variables:{'postId':id}})
        .then(
            ({ data : {likePost} }) =>{
                setLiked(likePost.likes.findIndex(liked=>liked.username==user.username)!=-1)
            }
        ).catch(e=>{})
    }else{
      history.push("/login");
    }
  }
  
  const likedBy=()=>{
    let likedByUser=false;
    let likeStr = likes.reduce((str,{username})=>{
        if(user?.username==username){
            likedByUser=true;
            return str;
        }
        str+=str.length>0 ? "," : "";
        return str + (user?.username==username ? 'You' : username);
    },"");
    likeStr = likedByUser ? likeStr.length>0 ? "You,"+likeStr : "You" : likeStr
    return likeStr+' liked this';
  }
    return (
    <Feed.Event>
      <Feed.Label image={getAvatarImg(avatar)} />
      <Feed.Content>
        <Feed.Summary>
          {user?.username==username 
          ? <Link to="/home">You</Link> 
          : <a>{username}</a>} posted an update
          
          <Feed.Date as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
        {body}
        </Feed.Extra>
        <Feed.Meta>
          <Feed.Like onClick={likePost}>
            <Icon color={liked ? "red" : "grey"} name='like' />
            {likeCount>0 
                 ? <Popup content={likedBy()} trigger={<span>{likeCount} Likes</span>}  mouseEnterDelay={300}/>
                 : <span>{likeCount} Likes</span>}
          </Feed.Like>
          <Link to={user ? `/posts/${id}` : `/login`}>
          <Icon name="comment"/>{commentCount} Comments
          </Link>
          
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
    )
}

export default FeedItem
