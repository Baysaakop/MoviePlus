import { useEffect, useState } from "react";
import axios from 'axios'
import api from "../api";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "antd";

function HomeArtists (props) {

    const [artists, setArtists] = useState()

    useEffect(() => {             
        axios({
            method: 'GET',
            url: `${api.artists}`
        }).then(res => {                         
            let data = res.data.results                                                                         
            setArtists(data.slice(0, 10))             
        }).catch(err => {
            console.log(err.message)
        });
    }, [props]) 

    return (
        <div>
            {artists ? artists.map(item => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <Link to={`/artists/${item.id}`}>
                                <Avatar size={100} src={item.avatar} />                                                        
                            </Link>
                        </div>
                        <div style={{ marginLeft: '16px' }}>
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.name}</Typography.Text>    
                            {item.occupation.map(o => {
                                return (
                                    <Typography.Text>{o.name}, </Typography.Text>
                                )
                            })}                               
                        </div>
                    </div>
                )
            }) : <></>}
        </div>
    )
}

export default HomeArtists