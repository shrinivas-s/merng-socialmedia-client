import React from 'react'
import moment from 'moment';
import { Comment } from 'semantic-ui-react';
import { getAvatarImg } from '../util/Avatar';

function PostComment({username,avatar,body,createdAt}) {
    return (       
    <Comment>
      <Comment.Avatar as='a' src={getAvatarImg(avatar)} />
      <Comment.Content>
        <Comment.Author>{username}</Comment.Author>
        <Comment.Metadata>
            <div>{moment(createdAt).fromNow()}</div>
        </Comment.Metadata>
        <Comment.Text>
        {body}
        </Comment.Text>
      </Comment.Content>
    </Comment>
  
    )
}

export default PostComment
