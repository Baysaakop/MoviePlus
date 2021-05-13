import { useEffect, useState } from "react";
import axios from 'axios';
import api from '../api';
import { message, Spin, Typography, Avatar, Row, Col, Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import CastModal from "../components/CastModal";

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieUpdateCast (props) {
    const [cast, setCast] = useState()
    const [loading, setLoading] = useState()
    const [modal, setModal] = useState()
    const [actor, setActor] = useState()
    const [tempid, setTempid] = useState(0)

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
            setCast(target.movie.actors)            
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    } 

    function onEdit (id) {
        let data = cast.find(x => x.id === id)
        setActor(data)
        setModal(true)
    }

    function onDelete (id) {                
        let arr = cast.filter(x => x.id !== id)        
        setCast(arr)
    }

    function onReturn (values) {
        console.log(values)
        setLoading(true)        
        let arr = cast
        if (values.id === 0) {
            values.id = tempid
            setTempid(tempid - 1)
            arr.push(values)
        } else {
            let data = arr.find(x => x.id === parseInt(values.id))
            data.artist = values.artist
            data.role_name = values.role_name
        }
        setCast(arr)
        setModal(false)
        setLoading(false)        
    }

    function onSave () {
        console.log("Save Cast")
    }

    return (
        <div>            
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : cast ? (
                <>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => setModal(true)}>Жүжигчин нэмэх</Button>
                    { modal ? <CastModal item={actor ? actor : undefined} hide={() => setModal(false)} return={(values) => onReturn(values)} /> : <></> }
                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                        <Col span={6}>
                            <Typography.Title level={4}>Жүжигчин</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={4}>Дүр</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={4}>Жүжигчин</Typography.Title>
                        </Col>
                        <Col span={6}>
                            <Typography.Title level={4}>Дүр</Typography.Title>
                        </Col>                        
                        {cast.map(item => {
                            return (
                                <>
                                    <Col span={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Avatar src={item.artist.avatar} size={64} shape="square" style={{ marginRight: '16px' }} />
                                        <Typography.Text style={{ fontSize: '16px' }}>{item.artist.name}</Typography.Text>
                                    </Col>    
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text style={{ fontSize: '16px' }}>{item.role_name}</Typography.Text>
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
                    <Button type="primary" icon={<SaveOutlined />} style={{ marginTop: '16px' }} onClick={onSave}>Хадгалах</Button>                                       
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

export default MovieUpdateCast