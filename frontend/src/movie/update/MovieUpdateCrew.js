import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../../api';
import { message, Grid, Spin, Typography, Avatar, Row, Col, Button, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import MovieCrewModal from "./MovieCrewModal";

const { useBreakpoint } = Grid
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieUpdateCrew (props) {
    const screens = useBreakpoint()
    const [members, setMembers] = useState()
    const [crew, setCrew] = useState()
    const [loading, setLoading] = useState()
    const [modal, setModal] = useState()
    const [member, setMember] = useState()

    useEffect(() => {       
        getCrew()        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getCrew() {
        setLoading(true)
        var url = api.members + "?film=" + props.movieID           
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
        setMember(undefined)
        setModal(true)
    }

    function onEdit (id) {
        let data = crew.find(x => x.artist.id === id)
        setMember(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = crew.filter(x => x.artist.id !== id)        
        setCrew(arr)
    }

    function onReturn (values) {        
        setLoading(true)        
        let arr = crew
        let data = arr.find(x => x.artist.id === values.artist.id)
        if (data) {
            data.role = values.role
        } else {
            data = {
                artist: values.artist,
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
            let target = crew.find(x => x.artist.id === item.artist.id) 
            if (target === undefined) {
                // DELETE
                let data = {
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
                // UPDATE
                let data = {
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
            }
        })
        crew.forEach(item => {
            let target = members.find(x => x.artist.id === item.artist.id)
            if (target === undefined) {
                // CREATE
                let data = {
                    'artist': item.artist.id, 
                    'film': props.movieID,
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
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => onAdd()}>Уран бүтээлч нэмэх</Button>
                    { modal ? <MovieCrewModal item={member ? member : undefined} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col xs={10} sm={10} md={5}>
                            <Typography.Title level={5}>Уран бүтээлч</Typography.Title>
                        </Col>
                        <Col xs={10} sm={10} md={5}>
                            <Typography.Title level={5}>Үүрэг</Typography.Title>
                        </Col>
                        <Col xs={4} sm={4} md={2}>
                            <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                        </Col>  
                        { screens.md ? (
                            <>
                                <Col xs={10} sm={10} md={5}>
                                    <Typography.Title level={5}>Уран бүтээлч</Typography.Title>
                                </Col>
                                <Col xs={10} sm={10} md={5}>
                                    <Typography.Title level={5}>Үүрэг</Typography.Title>
                                </Col>
                                <Col xs={4} sm={4} md={2}>
                                    <Typography.Title level={5}>Засах / Устгах</Typography.Title>
                                </Col>
                            </>
                        ) : (
                            <></>
                        )}
                                               
                        {crew.map(item => {
                            return (
                                <>
                                    <Col xs={10} sm={10} md={5} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>      
                                        <Avatar shape="square" size={50} src={item.artist.avatar} style={{ marginRight: '8px' }} />                                                                          
                                        <Typography.Text>{item.artist.name}</Typography.Text>
                                    </Col>    
                                    <Col xs={10} sm={10} md={5} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text>{getRoles(item.role)}</Typography.Text>
                                    </Col>
                                    <Col xs={4} sm={4} md={2} style={{ display: 'flex', alignItems: 'center' }}>
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

export default MovieUpdateCrew