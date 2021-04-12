import { List, Typography, Avatar } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios'
import api from '../api'

function MovieMembers (props) {

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
                    if (role.id !== 1 && !result.includes(member)) {
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

    function getMembers (data) {        
        const result = []        
        data.forEach(member => {
            member.role.forEach(role => {
                if (role.id !== 1 && !result.includes(member)) {
                    result.push(member)
                }
            })
        })
        return result
    }

    function getRoles (data) {        
        const result = []
        data.forEach(role => {
            if (role.id !== 1) {
                result.push(role.name)
            }
        })    
        return result.toString()
    }

    return (
        <div>
            <List                                                                                                        
                itemLayout="horizontal"                                                    
                dataSource={members ? members : undefined}
                renderItem={item => (
                <List.Item>                                                        
                    <List.Item.Meta
                        avatar={
                            <a href={`/artists/${item.artist.id}`}>
                                <Avatar size="large" src={item.artist.avatar} />
                            </a>
                        }
                        title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                        description={item.artist.occupation.map(occupation => {
                            return (
                                <span>{occupation.name} | </span>
                            )
                        })}
                    />
                    <Typography.Text>
                        {getRoles(item.role)}
                    </Typography.Text>                                                        
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;