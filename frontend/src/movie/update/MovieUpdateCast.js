import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../../api';
import { message, Grid, Spin, Typography, Avatar, Row, Col, Button, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import MovieCastModal from "./MovieCastModal";

const { useBreakpoint } = Grid
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieUpdateCast (props) {
    const screens = useBreakpoint()
    const [actors, setActors] = useState()
    const [cast, setCast] = useState()
    const [loading, setLoading] = useState()
    const [modal, setModal] = useState()
    const [actor, setActor] = useState()

    useEffect(() => {       
        getCast()        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getCast() {
        setLoading(true)
        var url = api.actors + "?film=" + props.movieID           
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
        setActor(undefined)
        setModal(true)
    }

    function onEdit (id) {
        let data = cast.find(x => x.artist.id === id)
        setActor(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = cast.filter(x => x.artist.id !== id)        
        setCast(arr)
    }

    function onReturn (values) {        
        setLoading(true)        
        let arr = cast
        let data = arr.find(x => x.artist.id === values.artist.id)
        if (data) {
            data.role_name = values.role_name
        } else {
            data = {
                artist: values.artist,
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
            let target = cast.find(x => x.artist.id === item.artist.id) 
            if (target === undefined) {
                // DELETE
                let data = {
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
            }
        })
        cast.forEach(item => {
            let target = actors.find(x => x.artist.id === item.artist.id)
            if (target === undefined) {
                // CREATE
                let data = {
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => onAdd()}>Жүжигчин нэмэх</Button>
                    { modal ? <MovieCastModal item={actor ? actor : undefined} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col xs={12} sm={12} md={6}>
                            <Typography.Title level={5}>Жүжигчин</Typography.Title>
                        </Col>
                        <Col xs={6} sm={6} md={3}>
                            <Typography.Title level={5}>Дүр</Typography.Title>
                        </Col>
                        <Col xs={6} sm={6} md={3}>
                            <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                        </Col>  
                        { screens.md ? (
                            <>
                                <Col xs={12} sm={12} md={6}>
                                    <Typography.Title level={5}>Жүжигчин</Typography.Title>
                                </Col>
                                <Col xs={6} sm={6} md={3}>
                                    <Typography.Title level={5}>Дүр</Typography.Title>
                                </Col>
                                <Col xs={6} sm={6} md={3}>
                                    <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                                </Col>
                            </>
                        ) : (
                            <></>
                        )}
                                               
                        {cast.map(item => {
                            return (
                                <>
                                    <Col xs={12} sm={12} md={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>      
                                        <Avatar shape="square" size={50} src={item.artist.avatar} style={{ marginRight: '8px' }} />                                                                          
                                        <Typography.Text>{item.artist.name}</Typography.Text>
                                    </Col>    
                                    <Col xs={6} sm={6} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{item.role_name}</Typography.Text>
                                    </Col>
                                    <Col xs={6} sm={6} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Засах">
                                            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }} onClick={() => onEdit(item.artist.id)} />
                                        </Tooltip>                                        
                                        <Tooltip title="Устгах">
                                            <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => onDelete(item.artist.id)} />
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

export default MovieUpdateCast