import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../api';
import { message, Spin, Typography, Avatar, Row, Col, Button, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import CrewModal from "../components/CrewModal";

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieUpdateCrew (props) {
    const [crew, setCrew] = useState()
    const [loading, setLoading] = useState()
    const [modal, setModal] = useState()
    const [member, setMember] = useState()
    const [tempid, setTempid] = useState(-1)

    useEffect(() => {       
        getMovie()     
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getMovie() {        
        setLoading(true)
        const id = props.movieID
        const url = api.films + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let target = res.data              
            setCrew(target.movie.members)            
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    } 

    function onAdd() {
        setMember(undefined)
        setModal(true)
    }

    function onEdit (id) {
        let data = crew.find(x => x.id === id)
        setMember(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = crew.filter(x => x.id !== id)        
        setCrew(arr)
    }

    function onReturn (values) {        
        setLoading(true)        
        let arr = crew
        if (values.id === 0) {
            values.id = tempid
            setTempid(tempid - 1)
            arr.push(values)
        } else {
            arr.forEach(data => {
                if (data.id === parseInt(values.id)) {
                    data.artist = values.artist
                    data.role = values.role
                }
            })                        
        }
        setCrew(arr)
        setModal(false)
        setLoading(false)        
    }

    function onSave () {
        console.log(crew)
        let data = {
            'crew': crew,
            'token': props.token,
            'filmid': props.movieID
        }            
        axios({
            method: 'POST',
            url: `${api.tempfilms}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201) {                          
                message.info("Хүсэлтийг хүлээж авлаа.")                    
                setLoading(false)                                                              
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо.")
            console.log(err)            
            setLoading(false)          
        })                    
    }

    function getRoles(role) {
        let result = []
        role.forEach(element => {
            result.push(element.name)    
        });
        return result.toString()
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
                    { modal ? <CrewModal item={member ? member : undefined} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col span={6}>
                            <Typography.Title level={5}>Уран бүтээлч</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={5}>Үүрэг</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={5}>Уран бүтээлч</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={5}>Үүрэг</Typography.Title>
                        </Col>                        
                        {crew.map(item => {
                            return (
                                <>
                                    <Col span={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Avatar src={item.artist.avatar} size={64} shape="square" style={{ marginRight: '16px' }} />
                                        <Typography.Text style={{ fontSize: '16px' }}>{item.artist.name}</Typography.Text>
                                    </Col>    
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>       
                                        <div style={{ textAlign: 'center' }}>
                                            <Typography.Text>
                                                {getRoles(item.role)}
                                            </Typography.Text>                                        
                                        </div>                                 
                                    </Col>
                                    <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Засах">
                                            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }} onClick={() => onEdit(item.id)} />
                                        </Tooltip>                                        
                                        <Tooltip title="Устгах">
                                            <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => onDelete(item.id)} />
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