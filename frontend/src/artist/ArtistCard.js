import { Button, Card, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import '../movie/MovieCard.css';
import { EyeOutlined, UserAddOutlined, HeartOutlined } from '@ant-design/icons';
import blank from '../movie/blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Meta } = Card;

function ArtistCard (props) {

    const [user, setUser] = useState();

    useEffect(() => {              
        getUser()        
    }, []);

    function getUser() {        
        if (props.token && props.token !== null) {
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            }).then(res => {            
                setUser(res.data)
            }).catch(err => {
                console.log(err)
            })
        } else {
            setUser(undefined)
        }        
    }

    function like () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                like: true
            }            
            axios({
                method: 'PUT',
                url: `${api.artists}/${props.artist.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })           
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }   
    }

    function follow () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                follow: true
            }            
            axios({
                method: 'PUT',
                url: `${api.artists}/${props.artist.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })           
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }
    }

    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
    }

    return (
        <div>
            <Card             
                size="small"
                hoverable                 
                style={{ width: '100%', height: 'auto', border: '0' }}
                actions={[
                    <Tooltip title={formatCount(props.artist.views)}>
                        <EyeOutlined key="views" />
                    </Tooltip>,
                    <Tooltip title={formatCount(props.artist.likes)}>
                        <HeartOutlined key="likes" />
                    </Tooltip>,
                    <Tooltip title={formatCount(props.artist.followers)}>
                        <UserAddOutlined key="watched" />
                    </Tooltip>,                      
                ]}
                cover={
                    <div className="cover-container" style={{ paddingBottom: '100%', overflow: 'hidden' }}>
                        <a href={`/artists/${props.artist.id}`}>
                            <img src={props.artist.avatar ? props.artist.avatar : blank} alt="poster" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                        </a>
                        <div className="cover-overlay-top-left">
                            {/* <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                99
                            </Avatar>                                 */}
                        </div>
                        <div className="cover-overlay-bot-right">         
                            { user && user.profile.artist_likes.find(x => x.id === props.artist.id) !== null && user.profile.artist_likes.find(x => x.id === props.artist.id) !== undefined ? (
                                <Tooltip title="Таалагдсан">
                                    <Button size="large" type="primary" shape="circle" icon={<HeartOutlined />} onClick={like} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Таалагдсан">
                                    <Button size="large" type="ghost" shape="circle" icon={<HeartOutlined />} onClick={like} />
                                </Tooltip>
                            )} 
                            { user && user.profile.artist_followed.find(x => x.id === props.artist.id) !== null && user.profile.artist_followed.find(x => x.id === props.artist.id) !== undefined ? (
                                <Tooltip title="Дагах">
                                    <Button size="large" type="primary" shape="circle" icon={<UserAddOutlined style={{ marginLeft: '2px' }} />} onClick={follow} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Дагах">
                                    <Button size="large" type="ghost" shape="circle" icon={<UserAddOutlined style={{ marginLeft: '2px' }} />} onClick={follow} />
                                </Tooltip>
                            )}                                                                                   
                        </div>
                    </div>
                }
            >
                <a href={`/artists/${props.artist.id}`}>
                    <Meta title={<Tooltip title={props.artist.name}>{props.artist.name}</Tooltip>} description={props.artist.birthday ? props.artist.birthday.toString().slice(0, 4) : '----'} />
                </a>                     
            </Card>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistCard);