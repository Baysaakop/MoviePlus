import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import About from './containers/About';
import Login from './account/Login';
import Profile from './account/Profile';
// import Signup from './account/Signup';
// import Logout from './account/Logout';
// import PasswordReset from './account/PasswordReset';
// import PasswordResetConfirm from './account/PasswordResetConfirm';
import MovieList from './movie/MovieList';
import MovieDetail from './movie/MovieDetail';
import MovieAdd from './movie/MovieAdd';
import MovieUpdate from './movie/MovieUpdate';
import MovieAddRequests from './movie/MovieAddRequests';
import MovieUpdateRequests from './movie/MovieUpdateRequests';
import ArtistList from './artist/ArtistList';
import ArtistDetail from './artist/ArtistDetail';
import ArtistAdd from './artist/ArtistAdd';
import ArtistUpdate from './artist/ArtistUpdate';
import ArtistAddRequests from './artist/ArtistAddRequests';
import ArtistUpdateRequests from './artist/ArtistUpdateRequests';
import SeriesList from './series/SeriesList';
import ReviewList from './reviews/ReviewList';
import ReviewDetail from './reviews/ReviewDetail';
import Page404 from './components/Page404';
import Add from './containers/Add';
// import ReviewAdd from './reviews/ReviewAdd';

function BaseRouter () {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/add" component={Add} />
            <Route exact path="/about" component={About} />
            {/* Movie urls */}
            <Route exact path="/movies" component={MovieList} />
            <Route exact path="/movies/:movieID" component={MovieDetail} />
            <Route exact path="/newmovie" component={MovieAdd} />
            <Route exact path="/updatemovie/:movieID" component={MovieUpdate} />
            <Route exact path="/movieaddrequests" component={MovieAddRequests} />
            <Route exact path="/movieupdaterequests" component={MovieUpdateRequests} />
            {/* Artist urls */}
            <Route exact path="/artists" component={ArtistList} />
            <Route exact path="/artists/:artistID" component={ArtistDetail} />
            <Route exact path="/newartist" component={ArtistAdd} />
            <Route exact path="/updateartist/:artistID" component={ArtistUpdate} />
            <Route exact path="/artistaddrequests" component={ArtistAddRequests} />            
            <Route exact path="/artistupdaterequests" component={ArtistUpdateRequests} />
            {/* Series urls */}
            <Route exact path="/series" component={SeriesList} />
            {/* Reviews urls */}
            <Route exact path="/reviews" component={ReviewList} />
            <Route exact path="/reviews/:reviewID" component={ReviewDetail} />    
            {/* <Route exact path="/newreview" component={ReviewAdd} /> */}
            {/* User urls */}
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/logout" component={Logout} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/password/reset" component={PasswordReset} />         
            <Route exact path="/rest-auth/password/reset/confirm/:uid/:token" component={PasswordResetConfirm} />             */}
            <Route exact path="/profile" component={Profile} />                        
            <Route component={Page404} />
        </Switch>
    )    
}
export default BaseRouter;