import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Button, Tooltip, Popconfirm, message } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../../api';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment'
import ArtistCastModal from './ArtistCastModal';

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistUpdateCast (props) {    
    const [actors, setActors] = useState()
    const [cast, setCast] = useState()
    const [loading, setLoading] = useState(false)    
    const [modal, setModal] = useState()
    const [movie, setMovie] = useState()

    useEffect(() => {       
        getCast()        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getCast() {
        setLoading(true)
        var url = api.actors + "?artist=" + props.artistID           
        axios({
            method: 'GET',
            url: url
        }).then(res => {                      
            let data = res.data.results                                     
            setCast(data)       
            let clone = JSON.parse(JSON.stringify(data))
            setActors(clone)
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
        let data = cast.find(x => x.film.id === id)
        setMovie(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = cast.filter(x => x.film.id !== id)      
        setCast(arr)
    }

    function onReturn (values) {              
        setLoading(true)        
        let arr = cast
        let data = arr.find(x => x.film.id === values.film.id)
        if (data) {
            data.role_name = values.role_name
        } else {
            data = {
                film: values.film,
                role_name: values.role_name
            }
            arr.push(data)
        }
        setCast(arr)        
        setModal(false)
        setLoading(false)            
    }

    function onSave () {
        setLoading(true) 
        actors.forEach(item => {
            let target = cast.find(x => x.film.id === item.film.id) 
            if (target === undefined) {
                // DELETE
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role_name': item.role_name,
                    'delete': true,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempactors}/`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.token}`
                    }
                })
            } else if (target.role_name !== item.role_name) {
                // UPDATE
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role_name': target.role_name,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempactors}/`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.token}`
                    }
                })
            } else {                
                // NOTHING
            }
        })
        cast.forEach(item => {
            let target = actors.find(x => x.film.id === item.film.id)
            if (target === undefined) {                
                // CREATE
                let data = {
                    'artist': props.artistID,
                    'film': item.film.id,
                    'role_name': item.role_name,
                    'token': props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.tempactors}/`,
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

    return (
        <div>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : cast ? (
                <>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => onAdd()}>Уран бүтээл нэмэх</Button>
                    { modal ? <ArtistCastModal item={movie} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col span={4}>
                            <Typography.Title level={5}>Он</Typography.Title>
                        </Col>
                        <Col span={10}>
                            <Typography.Title level={5}>Кино</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={5}>Дүр</Typography.Title>
                        </Col>
                        <Col span={4}>
                            <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                        </Col>                       
                        {cast.map(item => {
                            return (
                                <>
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{moment(item.film.movie.releasedate).format("YYYY")}</Typography.Text>
                                    </Col>
                                    <Col span={10} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>                                                                                
                                        <Typography.Text>{item.film.movie.name}</Typography.Text>
                                    </Col>    
                                    <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{item.role_name}</Typography.Text>
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

export default connect(mapStateToProps)(ArtistUpdateCast);