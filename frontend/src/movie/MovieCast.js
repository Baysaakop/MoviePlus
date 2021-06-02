import { List, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../api';
import { Link } from "react-router-dom";

function MovieCast (props) {    
    const [actors, setActors] = useState();

    useEffect(() => {
        getActors()
    }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function getActors() {
        var url = api.actors + "?film=" + props.id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                        
            let data = res.data.results                 
            setActors(data)
        }).catch(err => {
            console.log(err.message)
        });        
    } 

    return (
        <div>
            <List                                                                                                        
                grid={{
                    gutter: 16,
                    xs: 3,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 8,
                }}                              
                dataSource={actors ? actors : undefined}
                renderItem={item => (
                <List.Item>                                                        
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/artists/${item.artist.id}`}>
                            {/* <Avatar shape="circle" size={88} src={item.artist.avatar} /> */}
                            <img alt={item.artist.name} src={item.artist.avatar} style={{ width: '100%', height: 'auto', objectFit: 'scale-down', borderRadius: '4px' }} />
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.artist.name}</Typography.Text>
                            <Typography.Text style={{ display: 'block' }}>- {item.role_name}</Typography.Text>
                        </Link>
                    </div>
                </List.Item>
                )}
            />  
        </div>
    )
}

export default MovieCast;