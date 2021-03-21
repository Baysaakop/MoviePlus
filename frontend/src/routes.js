import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './account/Login';
import Signup from './account/Signup';
import Profile from './account/Profile';
import ItemList from './item/ItemList';
import ItemDetail from './item/ItemDetail';
import ItemCreate from './item/ItemCreate';
import ItemUpdate from './item/ItemUpdate';
import Logout from './account/Logout';
import PasswordReset from './account/PasswordReset';
import PasswordResetConfirm from './account/PasswordResetConfirm';
import PostCreate from './posts/PostCreate';

function BaseRouter () {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            {/* Item urls */}
            <Route exact path="/items" component={ItemList} />
            <Route exact path="/items/:itemID" component={ItemDetail} />
            <Route exact path="/newitem" component={ItemCreate} />
            <Route exact path="/updateitem/:itemID" component={ItemUpdate} />
            {/* Posts urls */}
            <Route exact path="/newpost" component={PostCreate} />
            {/* User urls */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/password/reset" component={PasswordReset} />         
            <Route exact path="/rest-auth/password/reset/confirm/:uid/:token" component={PasswordResetConfirm} />            
            <Route exact path="/profile" component={Profile} />                        
        </Switch>
    )    
}
export default BaseRouter;