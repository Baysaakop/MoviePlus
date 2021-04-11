import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './account/Login';
import Signup from './account/Signup';
import Profile from './account/Profile';
import Logout from './account/Logout';
import PasswordReset from './account/PasswordReset';
import PasswordResetConfirm from './account/PasswordResetConfirm';
import MovieList from './movie/MovieList';
import MovieDetail from './movie/MovieDetail';
import ArtistList from './artist/ArtistList';
import ArtistDetail from './artist/ArtistDetail';
import PostCreate from './reviews/ReviewCreate';
import PostList from './reviews/ReviewList';
import PostDetail from './reviews/ReviewDetail';
import About from './containers/About';
import SeriesList from './series/SeriesList';

function BaseRouter () {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/movies" component={MovieList} />
            <Route exact path="/movies/:movieID" component={MovieDetail} />
            <Route exact path="/artists" component={ArtistList} />
            <Route exact path="/artists/:artistID" component={ArtistDetail} />
            <Route exact path="/series" component={SeriesList} />
            {/* Posts urls */}
            <Route exact path="/posts" component={PostList} />
            <Route exact path="/posts/:postID" component={PostDetail} />
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