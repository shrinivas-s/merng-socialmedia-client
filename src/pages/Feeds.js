import { useQuery } from '@apollo/client'
import React, { useContext, useEffect } from 'react'
import { Dimmer, Feed, Loader } from 'semantic-ui-react'
import { GET_POSTS_QUERY, SUBSCRIBE_POST_QUERY } from '../util/graphql'
import FeedItem from '../components/FeedItem';
import { UserContext } from '../userContext';
import NewPost from '../components/NewPost';

function Feeds() {
    const [user] = useContext(UserContext);
    const {loading,data,subscribeToMore} = useQuery(GET_POSTS_QUERY);
    useEffect(async () => {
        try{
        if(data && subscribeToMore){
            await subscribeToMore({
                document: SUBSCRIBE_POST_QUERY,
                variables: {},
                updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.newPost;
                return {getPosts:[newFeedItem,...prev.getPosts]}
                }
            });
        }
     }catch(e){
            console.log(e);
        }
    }, [subscribeToMore]);
    return (
        <Feed>
            {loading && <Dimmer active inverted><Loader inverted /></Dimmer>}
            
            {!loading && user && 
            <div style={{marginBottom:"50px",width:"500px"}}>
                <NewPost marginBottom/>
            </div>
            }
            {data && data.getPosts.map(post=><FeedItem {...post} key={post.id}/>)}
            {data && data.getPosts.length==0 && <h2>Seems nobody has any updates :(</h2>}
        </Feed>
    )
}

export default Feeds
