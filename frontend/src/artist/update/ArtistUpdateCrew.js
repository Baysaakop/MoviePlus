import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Button, Tooltip, Popconfirm, message } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../../api';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment'
import ArtistCrewModal from './ArtistCrewModal';

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistUpdateCrew (props) {
    const [members, setMembers] = useState()
    const [crew, setCrew] = useState()
    const [loading, setLoading] = useState(false)    
    const [modal, setModal] = useState()
    const [movie, setMovie] = useState()

    useEffect(() => {       
        getCast()        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getCast() {
        setLoading(true)
        var url = api.members + "?artist=" + props.artistID           
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                                    
            let data = res.data.results                                              
            setCrew(data)
            let clone = JSON.parse(JSON.stringify(data))
            setMembers(clone)          
            setLoading(false)
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
        });        
    }

    function onAdd() {
        setMovie(undefined)
        setModal(true)
    }

    function onEdit (id) {
        let data = crew.find(x => x.film.id === id)
        setMovie(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = crew.filter(x => x.film.id !== id)      
        setCrew(arr)
    }

    function onReturn (values) {       
        console.log(values)
        setLoading(true)        
        let arr = crew
        let data = arr.find(x => x.film.id === values.film.id)
        if (data) {
            data.role = values.role
        } else {
            data = {
                film: values.film,
                role: values.role
            }
            arr.push(data)
        }
        setCrew(arr)
        setModal(false)
        setLoading(false)            
    }

    function onSave () {        
        setLoading(true) 
        members.forEach(item => {
            let target = crew.find(x => x.film.id === item.film.id) 
            if (target === undefined) {
                // Delete
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role': item.role,
                    'delete': true,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempmembers}/`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.token}`
                    }
                })
            } else if (!compareRole(target.role, item.role)) {
                // Update
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role': target.role,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempmembers}/`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.token}`
                    }
                })
            } else {                
                // Nothing
            }
        })
        crew.forEach(item => {
            let target = members.find(x => x.film.id === item.film.id)
            if (target === undefined) {                
                // Create
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role': item.role,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempmembers}/`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.token}`
                    }
                })
            }
        })       
        message.info("Хүсэлтийг хүлээж авлаа.")              
        setLoading(false)        
    }

    function compareRole (role1, role2) {
        if (role1.length === role2.length) {
            let count = 0
            let i = 0
            for (i = 0; i < role1.length; i++) {
                if (role1[i].id === role2[i].id) {
                    count++
                }
            }
            if (count === role1.length) {
                return true
            }
        }
        return false
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
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : crew ? (
                <>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => onAdd()}>Уран бүтээл нэмэх</Button>
                    { modal ? <ArtistCrewModal item={movie} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col span={4}>
                            <Typography.Title level={5}>Он</Typography.Title>
                        </Col>
                        <Col span={10}>
                            <Typography.Title level={5}>Кино</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={5}>Үүрэг</Typography.Title>
                        </Col>
                        <Col span={4}>
                            <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                        </Col>                       
                        {crew.map(item => {
                            return (
                                <>
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{moment(item.film.movie.releasedate).year()}</Typography.Text>
                                    </Col>
                                    <Col span={10} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>                                                                                
                                        <Typography.Text>{item.film.movie.name}</Typography.Text>
                                    </Col>    
                                    <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{getRoles(item.role)}</Typography.Text>
                                    </Col>
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Засах">
                                            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }} onClick={() => onEdit(item.film.id)} />
                                        </Tooltip>                                        
                                        <Tooltip title="Устгах">
                                            <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => onDelete(item.film.id)} />
                                        </Tooltip>
                                    </Col>
                                </>
                            )
                        })}                        
                    </Row> 
                    <Popconfirm title="Хадгалах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={onSave}>
                        <Button type="primary" icon={<SaveOutlined />} style={{ marginTop: '16px' }}>Хадгалах</Button>    
                    </Popconfirm>                                                                
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistUpdateCrew);