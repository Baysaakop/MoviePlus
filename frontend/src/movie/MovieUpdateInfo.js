import { ToolOutlined, LoadingOutlined } from '@ant-design/icons';
import { Grid, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message, Spin, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import moment from 'moment';

const { useBreakpoint } = Grid;
const { TextArea } = Input;
const { Option } = Select;
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieUpdateInfo (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm();    
    const [movie, setMovie] = useState()
    const [poster, setPoster] = useState();
    const [landscape, setLandscape] = useState();
    const [ratings, setRatings] = useState(); 
    const [genres, setGenres] = useState();     
    const [loading, setLoading] = useState();    

    useEffect(() => {
        axios({
            method: 'GET',                        
            url: api.ratings
        })
        .then(res => {                        
            setRatings(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
        axios({
            method: 'GET',                        
            url: api.genres
        })
        .then(res => {                        
            setGenres(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })         
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
            setMovie(target)
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }    

    function getIDsFromArray (array) {
        let result = []
        array.forEach(item => {
            result.push(item.id.toString())
        });        
        return result
    }

    function onFinish (values) {             
        setLoading(true)       
        console.log(values)
        let count = 0
        var formData = new FormData();        
        if (values.name) {
            formData.append('name', values.name)
            count++
        }
        if (values.description) {
            formData.append('description', values.description)
            count++
        }
        if (values.plot) {
            formData.append('plot', values.plot)
            count++
        }
        if (values.trailer) {
            formData.append('trailer', values.trailer)
            count++
        }
        if (values.duration) {
            formData.append('duration', values.duration)
            count++
        }
        if (values.releasedate) {
            formData.append('releasedate', moment(values.releasedate).format("YYYY-MM-DD"))
            count++
        }         
        if (values.is_released) {
            formData.append('is_released', values.is_released)
            count++
        }
        if (values.is_playing) {
            formData.append('is_playing', values.is_playing)
            count++
        }  
        if (values.rating) {
            formData.append('rating', values.rating)
            count++
        }  
        if (values.genre) {
            formData.append('genre', values.genre)
            count++
        } 
        if (poster) {
            formData.append('poster', poster)
            count++
        } 
        if (landscape) {
            formData.append('landscape', landscape)
            count++
        }
        if (count > 0) {            
            formData.append('token', props.token) 
            formData.append('filmid', movie.id)             
            axios({
                method: 'POST',
                url: `${api.tempfilms}/`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
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
        } else {
            message.warning("Дор хаяж нэг талбарыг өөрчлөх хэрэгтэй.")
        }                 
    }

    function onPosterSelected (path) {        
        setPoster(path);
    }

    function onLandscapeSelected (path) {        
        setLandscape(path);
    }

    function getWidth() {
        if (screens.xxl) {
            return window.screen.availWidth * 0.69
        } else if (screens.xl) {
            return window.screen.availWidth * 0.79
        } else if (screens.lg) {
            return window.screen.availWidth * 0.83
        } else if (screens.md) {
            return window.screen.availWidth * 0.89
        } else if (screens.sm) {
            return window.screen.availWidth * 0.89
        } else if (screens.xs) {
            return window.screen.availWidth * 0.89
        }
    }

    function getHeight() {
        if (screens.xxl) {
            return window.screen.availWidth * 0.2
        } else if (screens.xl) {
            return window.screen.availWidth * 0.25
        } else if (screens.lg) {
            return window.screen.availWidth * 0.3
        } else if (screens.md) {
            return window.screen.availWidth * 0.4
        } else if (screens.sm) {
            return window.screen.availWidth * 0.4
        } else if (screens.xs) {
            return window.screen.availWidth * 0.4
        }
    }

    return (
        <div>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : movie ? (
                <Form 
                    form={form}
                    layout="vertical"  
                    onFinish={onFinish} 
                >
                    <Form.Item name="landscape" label="Өргөн зураг:">
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>           
                            <div>
                                <ImageUpload image={movie.movie.landscape} onImageSelected={onLandscapeSelected} height={getHeight()} width={getWidth()} />                        
                            </div>                 
                        </div>                               
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8} md={8} lg={8} xl={6}>
                            <Form.Item name="poster" label="Постер:">                               
                                <ImageUpload image={movie.movie.poster} onImageSelected={onPosterSelected} height="300px" width="200px" />                        
                            </Form.Item>
                            <Form.Item name="trailer" label="Трейлер:">
                                <Input defaultValue={movie.movie.trailer ? movie.movie.trailer : ""} />
                            </Form.Item>
                            <Row gutter={16}>       
                                <Col xs={24} sm={12}>                        
                                    <Form.Item name="is_released" label="Нээлтээ хийсэн:">                               
                                        <Radio.Group defaultValue={movie.movie.is_released}>
                                            <Radio value={true}>Тийм</Radio>
                                            <Radio value={false}>Үгүй</Radio>
                                        </Radio.Group> 
                                    </Form.Item>
                                </Col>             
                                <Col xs={24} sm={12}>                        
                                    <Form.Item name="is_playing" label="Одоо гарч буй:">                               
                                        <Radio.Group defaultValue={movie.movie.is_playing}>
                                            <Radio value={true}>Тийм</Radio>
                                            <Radio value={false}>Үгүй</Radio>
                                        </Radio.Group>          
                                    </Form.Item>
                                </Col>                                   
                            </Row>
                        </Col>
                        <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                            <Form.Item name="name" label="Нэр:">
                                <Input defaultValue={movie.movie.name ? movie.movie.name : ""} />
                            </Form.Item>
                            <Form.Item name="genre" label="Төрөл жанр:">                        
                                <Select
                                    defaultValue={movie.movie.genre ? getIDsFromArray(movie.movie.genre) : undefined}
                                    showSearch
                                    mode="multiple"
                                    placeholder="Төрөл сонгоно уу"                                                
                                    optionFilterProp="children"                                
                                >
                                    { genres ? (
                                        <>
                                            {genres.map(item => {
                                                return (
                                                    <Option key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Select>                        
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item name="releasedate" label="Нээлт:">
                                        <DatePicker style={{ width: '100%' }} defaultValue={movie.movie.releasedate ? moment(movie.movie.releasedate) : undefined} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item name="duration" label="Хугацаа:">
                                        <InputNumber defaultValue={movie.movie.duration ? movie.movie.duration : 90} min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>                                
                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item name="rating" label="Насны ангилал:">                        
                                        <Select
                                            defaultValue={movie.movie.rating ? movie.movie.rating.id.toString() : undefined}
                                            showSearch                                
                                            placeholder="Ангилал сонгоно уу"                                                
                                            optionFilterProp="children"                                
                                        >
                                            { ratings ? (
                                                <>
                                                    {ratings.map(item => {
                                                        return (
                                                            <Option key={item.id}>{item.name}</Option>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </Select>                        
                                    </Form.Item>                                                
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12}>
                                    <Form.Item name="description" label="Дэлгэрэнгүй:">
                                        <TextArea rows={10} defaultValue={movie.movie.description ? movie.movie.description : ""} />
                                    </Form.Item>  
                                </Col>
                                <Col xs={24} sm={24} md={12}>
                                    <Form.Item name="plot" label="Агуулга:">
                                        <TextArea rows={10} defaultValue={movie.movie.plot ? movie.movie.plot : ""} />
                                    </Form.Item>  
                                </Col>
                            </Row>
                        </Col>
                    </Row>                                                                                                                                                 
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm title="Засах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button type="primary" icon={<ToolOutlined />} style={{ marginRight: '8px' }}>
                                Засах   
                            </Button>
                        </Popconfirm>                                    
                    </div>                            
                </Form>   
            ) : <></>}             
        </div>
    )
}

export default MovieUpdateInfo