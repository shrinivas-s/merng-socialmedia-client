import { gql } from "@apollo/client";

export const GET_POSTS_QUERY=gql`
    { 
        getPosts{
            id username avatar body createdAt likeCount commentCount
            likes{
                username createdAt
            }
        }
    }
`

export const SUBSCRIBE_POST_QUERY=gql`
subscription {
  newPost{
    id username avatar body createdAt 
    likes{
        username
    }
    comments{
        id username body createdAt
    }
  }
}
`

export const GET_POST_QUERY=gql`
    query getPost($postId:ID!){ 
        getPost(postId:$postId){
            id username avatar body createdAt likeCount commentCount
            likes{
                username
            }
            comments{
                id username avatar body createdAt
            }
        }
    }
`

export const LIKE_POST_QUERY=gql`
    mutation likePost($postId:ID!){
        likePost(postId:$postId){
            id
            likes{
                username
            }
            likeCount
        }
    }
`

export const DELETE_POST_QUERY=gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`

export const CREATE_COMMENT_QUERY=gql`
    mutation createComment($postId:ID!,$body:String!){
        createComment(postId:$postId,body:$body){
            id
            comments{
                id username avatar body createdAt
            }
            commentCount
        }
    }
`