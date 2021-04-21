import { List, Typography, Avatar } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios'
import api from '../api'

function MovieCast (props) {    

    const [members, setMembers] = useState()

    useEffect(() => {
        axios({
            method: 'GET',
            url: api.members + "?movie=" + props.id
        })
        .then(res => {                   
            let data = res.data.results;                 
            const result = []        
            data.forEach(member => {
                member.role.forEach(role => {
                    if (role.id === 1 && !result.includes(member)) {
                        result.push(member)
                    }
                })
            })
            setMembers(result);        
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }, [props.id])


    return (
        <div>
            <List                                                                                                        
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                }}                                              
                dataSource={members ? members : undefined}
                renderItem={item => (
                <List.Item>                                                        
                    <List.Item.Meta
                        avatar={
                            <a href={`/artists/${item.artist.id}`}>
                                <Avatar size={48} src={item.artist.avatar} />
                            </a>
                        }
                        title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                        description={item.artist.occupation.map(occupation => {
                            return (
                                <span>{occupation.name} </span>
                            )
                        })}
                    />
                    <Typography.Text>
                        {item.role_name}
                    </Typography.Text>                                                        
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieCast;