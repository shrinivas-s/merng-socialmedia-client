import {useQuery, gql, useSubscription} from '@apollo/client';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {Card, Grid, Header, Transition} from 'semantic-ui-react';
import MenuBar from '../components/MenuBar';
import NewPost from '../components/NewPost';
import Post from '../components/Post';
import { UserContext } from '../userContext';
import { GET_POSTS_QUERY, SUBSCRIBE_POST_QUERY } from '../util/graphql';


export default function Home(){
    const [user] = useContext(UserContext);
    const {subscribeToMore,loading,error,data} = useQuery(GET_POSTS_QUERY);
    const history = useHistory();
    if(!user){
        history.push("/login")
    }
    
    return (
        <Grid columns={2}>
            <Grid.Row>
                
                {user && <Grid.Column><h2>Hi {user.username} !</h2><NewPost/></Grid.Column>}
                
                <Transition.Group animation='scale' duration={300}>
                    {data && 
                    data.getPosts.map(
                        post=>post.username==user.username && <Grid.Column key={post.id} style={{marginBottom:"20px"}}><Post {...post}  /></Grid.Column>
                        )
                    }
                </Transition.Group>
             </Grid.Row>
         </Grid>
    );
}

const evenNumberOfPosts=(posts)=>{
    return posts.length%2==0;
}