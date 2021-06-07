import { List, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../api';
import { Link } from "react-router-dom";

function MovieMembers (props) {    
    const [members, setMembers] = useState();

    useEffect(() => {
        getMembers()
    }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMembers() {
        var url = api.members + "?film=" + props.id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                   
            let data = res.data.results                    
            console.log(data)                      
            setMembers(data)
        }).catch(err => {
            console.log(err.message)
        });        
    } 

    function getRoles (roles) {
        let arr = []
        roles.forEach(role => {
            arr.push(role.name)
        })
        return arr.toString()
    }   

    return (
        <div>
            <List                                                                                                        
                grid={{
                    gutter: 16,
                    xs: 3,
                    sm: 3,
                    md: 4,
                    lg: 6,
                    xl: 8,
                    xxl: 8,
                }}                                                
                dataSource={members ? members : undefined}
                renderItem={item => (
                <List.Item>                                                        
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/artists/${item.artist.id}`}>
                            <img alt={item.artist.name} src={item.artist.avatar} style={{ width: '100%', height: 'auto', objectFit: 'scale-down', borderRadius: '4px' }} />
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.artist.name}</Typography.Text>
                            <Typography.Text>
                                {getRoles(item.role)}
                            </Typography.Text>   
                        </Link>
                    </div>
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;