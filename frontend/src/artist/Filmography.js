import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Typography } from 'antd'
import FilmTimeline from './FilmTimeline';
import moment from 'moment'

function Filmography (props) {    
    const [members, setMembers] = useState();
    const [actors, setActors] = useState();

    useEffect(() => {
        getMembers()
        getActors()
    }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMembers() {
        var url = api.members + "?artist=" + props.id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                   
            let data = res.data.results                                
            setMembers(data.sort((a, b) => moment(a.film.movie.releasedate) - moment(b.film.movie.releasedate)))
        }).catch(err => {
            console.log(err.message)
        });        
    } 
    
    function getActors() {
        var url = api.actors + "?artist=" + props.id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                        
            let data = res.data.results                 
            setActors(data.sort((a, b) => moment(a.film.movie.releasedate) - moment(b.film.movie.releasedate)))
        }).catch(err => {
            console.log(err.message)
        });        
    } 
    
    return (
        <div>        
            <Typography.Title level={4}>Filmography</Typography.Title>                    
            <FilmTimeline list={members ? members : undefined} />      
            <Typography.Title level={4}>Filmography (as actor)</Typography.Title>                    
            <FilmTimeline list={actors ? actors : undefined} />                  
        </div>
    )
}

export default Filmography;