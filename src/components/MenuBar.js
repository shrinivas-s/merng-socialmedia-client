import React, { useContext, useEffect, useState } from 'react';
import { Menu, Segment, Image, Icon } from 'semantic-ui-react';
import {Link,useHistory, useLocation} from 'react-router-dom';
import { UserContext } from '../userContext';

export default function MenuBar(){
  const [user,setUser]=useContext(UserContext);
  const history = useHistory();

  let pathName = window.location.pathname;
  let tab = pathName==='/' ? 'feeds' : pathName.substr(1);
  tab = tab=='home' && user?.username ? user.username : tab;
  const [activeItem,setActiveItem] = useState(tab);

  let location = useLocation();

  useEffect(() => {
    let tab = location.pathname==='/' ? 'feeds' : location.pathname.substr(1);
    tab = user && (tab=='login' || tab=='register') ? 'feeds' : tab;
    console.log(tab);
    setActiveItem(tab)
  }, [location])

  useEffect(() => {
    if(user && (activeItem=='login' || activeItem=='register')){
      setActiveItem("feeds")
    }
  }, [user])

  const handleItemClick = (e, { name }) => {
    if(name=='logout'){
      window.localStorage.removeItem('iam');
      setUser();
      setActiveItem("login");
      history.replace("/login");
    }else{
        setActiveItem(name);
    }
  }
    return (
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name='feeds'
            active={activeItem === 'feeds'}
            onClick={handleItemClick}
            as={Link}
            to="/"
          ><Icon name='home'></Icon></Menu.Item>
          <Menu.Menu position='right'>
            {
            (user?
              <>
              <Menu.Item
               name='home'
               active={activeItem === 'home'}
               onClick={handleItemClick}
               as={Link}
               to="/home"
             ><Icon name='user'></Icon></Menu.Item>
              <Menu.Item
                name='logout'
                onClick={handleItemClick}
              />
              </>
              :
              <>
              <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={handleItemClick}
              as={Link}
              to="/login"
              />
              <Menu.Item
                name='register'
                active={activeItem === 'register'}
                onClick={handleItemClick}
                as={Link}
                to="/register"
              />
            </>)
          }
          </Menu.Menu>
        </Menu>
    )
  
}