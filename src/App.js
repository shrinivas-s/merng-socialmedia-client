
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Container} from 'semantic-ui-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { UserContext } from './userContext.js';
import { useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import PrivateRoute from './util/PrivateRoute';
import SinglePost from './pages/SinglePost';
import { iam } from './util/iam';
import Feeds from './pages/Feeds';



function App() {

  const [user,setUser] = useState(iam());
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <Container style={{width:"900px"}}>
          <MenuBar/>
          <Switch>
          <Route exact path="/" component={Feeds}/>
          <Route exact path="/home" component={Home}/>
          <PrivateRoute exact path="/login" component={Login}/>
          <PrivateRoute exact path="/register" component={Register}/>
          <Route exact path="/posts/:postId" component={SinglePost}/>
          <Route exact path="/*" component={Feeds}/>
          </Switch>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
