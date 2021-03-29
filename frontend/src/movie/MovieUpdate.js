import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, ToolOutlined } from '@ant-design/icons';
import { Typography, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import moment from 'moment';

const { TextArea, Search } = Input;
const { Option } = Select;

function MovieUpdate (props) {
    const [form] = Form.useForm();    
    const [poster, setPoster] = useState();
    const [landscape, setLandscape] = useState();
    const [ratings, setRatings] = useState(); 
    const [genres, setGenres] = useState(); 
    const [occupations, setOccupations] = useState(); 
    const [artists, setArtists] = useState(); 
    const [movies, setMovies] = useState();
    const [loading, setLoading] = useState();
    const [selection, setSelection] = useState(); 

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
        axios({
            method: 'GET',                        
            url: api.occupations
        })
        .then(res => {                        
            setOccupations(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }, [])

    function onMovieSearch(value) {                
        setLoading(true)
        axios({
            method: 'GET',
            url: api.movies + "?name=" + value
        })
        .then(res => {                                    
            setMovies(res.data.results);        
            setLoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectMovie (value) {                        
        const target = movies.find(x => x.id === parseInt(value))             
        console.log(target)           
        let temp = []
        if (target.member && target.member.length > 0) {            
            target.member.forEach(m => {
                let cur = temp.find(x => x.id === m.artist.id);
                if (!cur || cur === null) {
                    temp.push(m.artist)   
                }                
            })            
        }
        if (target.cast && target.cast.length > 0) {            
            target.cast.forEach(m => {
                let cur = temp.find(x => x.id === m.artist.id);
                if (!cur || cur === null) {
                    temp.push(m.artist)   
                }  
            })            
        }
        setArtists(temp)
        form.setFieldsValue({
            name: target.name !== null ? target.name : "",
            description: target.description !== null ? target.description : "",
            plot: target.plot !== null ? target.plot : "",
            duration: target.duration !== null ? target.duration : "",
            releasedate: target.releasedate !== null ? moment(target.releasedate) : undefined,
            rating: target.rating !== null ? target.rating.id.toString() : undefined ,                  
            genre: target.genre !== null && target.genre.length > 0 ? getIDsFromArray(target.genre) : undefined, 
            crew: target.member !== null && target.member.length > 0 ? getMembers(target.member) : undefined,              
            cast: target.cast !== null && target.cast.length > 0 ? getCast(target.cast) : undefined,                                                                                                                 
        })     
        setPoster(target.poster)        
        setLandscape(target.landscape)        
        setSelection(target)
    }

    function getMembers(members) {        
        let res = []
        members.forEach(member => {
            let d = {
                artist: member.artist.id.toString(),
                role: member.role.id.toString()
            }            
            res.push(d)
        })
        return res
    }

    function getCast(cast) {        
        let res = []
        cast.forEach(member => {
            let d = {
                actor: member.artist.id.toString(),
                role_name: member.role_name
            }            
            res.push(d)
        })
        return res
    }

    function getIDsFromArray (array) {
        let result = []
        array.forEach(item => {
            result.push(item.id.toString())
        });        
        return result
    }

    function compareM2M (ids, objects) {
        if (ids.length !== objects.length) {
            return false;
        }
        let i;
        for (i = 0; i < ids.length; i++) {
            if (parseInt(ids[i]) !== parseInt(objects[i].id)) {
                return false;
            }
        }
        return true;
    }

    function compareCrew (crew, members) {
        if (crew.length !== members.length) {
            return false;
        }
        let i;
        for (i = 0; i < crew.length; i++) {
            if (crew[i].artist !== members[i].id.toString() && crew[i].artist !== members[i].name) {
                return false;
            }
        }
        return true;
    }

    function onArtistSearch(value) {                
        axios({
            method: 'GET',                        
            url: api.artists + "?name=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function onFinish (values) {      
        console.log(values)            
        if (selection) {
            const data = {            
                token: props.token
            }
            if (values.name && values.name !== selection.name) {
                data['name'] = values.name;
            }
            if (values.description && values.description !== selection.description) {
                data['description'] = values.description;
            }
            if (values.plot && values.plot !== selection.plot) {
                data['plot'] = values.plot;
            }
            if (values.releasedate && moment(values.releasedate).format("YYYY-MM-DD") !== selection.releasedate) {            
                data['releasedate'] = moment(values.releasedate).format("YYYY-MM-DD");
            }
            if (values.duration && values.duration !== selection.duration) {            
                data['duration'] = values.duration;
            }
            if (values.rating && values.rating !== selection.rating.id.toString()) {            
                data['rating'] = values.rating;
            }
            if (values.genre && !compareM2M(values.genre, selection.genre)) {
                data['genre'] = values.genre;
            }
            if (values.crew && !compareCrew(values.crew, selection.member)) {
                data['crew'] = values.crew;
            }
            // if (values.cast && values.cast !== null && values.cast.length > 0 && values.cast[0] !== "") {
            //     data['cast'] = values.cast;
            // }
            var formData = new FormData();
            if (poster && poster !== selection.poster) {
                formData.append('poster', poster)               
            }
            if (landscape && landscape !== selection.landscape) {
                formData.append('landscape', landscape)            
            }
            formData.append('token', props.token)
            axios({
                method: 'PUT',
                url: `${api.movies}/${selection.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {      
                    console.log(res)
                    axios({
                        method: 'PUT',
                        url: `${api.movies}/${res.data.id}/`,
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Token ${props.token}`            
                        }
                    }).then(res => {                        
                        if (res.status === 201 || res.status === 200) {                
                            message.info("Засварлалаа.");
                            form.resetFields();
                        }             
                    }).catch(err => {   
                        message.error("Амжилтгүй боллоо."); 
                        console.log(err);            
                    })                          
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })       
        }
    }

    function onDelete() {
        if (selection) {
            axios({
                method: 'DELETE',
                url: `${api.movies}/${selection.id}/`                
            })            
            .then(res => {                
                if (res.status === 200 || res.status === 204) {
                    message.info("Устгалаа.")   
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                message.error("Амжилтгүй боллоо.")
            }) 
        } else {
            message.warning("Та эхлээд засварлах уран бүтээлчээ сонгоно уу!")
        }   
    }

    function onPosterSelected (path) {        
        setPoster(path);
    }

    function onLandscapeSelected (path) {        
        setLandscape(path);
    }

    return (
        <div>
            <Row gutter={16}>
                <Col sm={24} md={12}>
                    <Typography.Text>Кино хайх:</Typography.Text>   
                    <Search placeholder="Киноны нэрийг бичиж хайна уу" onSearch={onMovieSearch} enterButton style={{ margin: '8px 0' }} />
                </Col>
                <Col sm={24} md={12}>
                    <Typography.Text>Кино сонгох:</Typography.Text>   
                    { loading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (
                        <Select
                            showSearch                
                            style={{ width: '100%', margin: '8px 0' }}
                            placeholder="Кино сонгоно уу"                
                            onSelect={selectMovie}
                            optionFilterProp="children"                            
                        >
                            { movies ? (
                                <>
                                    {movies.map(item => {
                                        return (
                                            <Option key={item.id}>{item.name}</Option>
                                        )
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Select> 
                    )}                    
                </Col>
            </Row>
            { selection ? (
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="description" label="Дэлгэрэнгүй:">
                                <TextArea rows={8} />
                            </Form.Item>  
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="plot" label="Агуулга:">
                                <TextArea rows={8} />
                            </Form.Item>  
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={8} md={6}>
                            <Form.Item name="duration" label="Хугацаа:">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Form.Item name="releasedate" label="Нээлт:">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Form.Item name="rating" label="Насны ангилал:">                        
                                <Select
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
                        <Col xs={12} sm={8} md={6}>
                            <Form.Item name="genre" label="Төрөл жанр:">                        
                                <Select
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
                        </Col>
                    </Row>
                    <Row gutter={16}>       
                        <Col xs={24} sm={12} md={12} lg={8}>                        
                            <Form.Item name="poster" label="Постер:">                               
                                <ImageUpload image={poster} onImageSelected={onPosterSelected} height="300px" width="200px" />                        
                            </Form.Item>
                        </Col>             
                        <Col xs={24} sm={12} md={12} lg={16}>                        
                            <Form.Item name="landscape" label="Өргөн зураг:">                               
                                <ImageUpload image={landscape} onImageSelected={onLandscapeSelected} height="300px" width="600px" />                        
                            </Form.Item>
                        </Col>                                   
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={11} style={{ marginBottom: '8px' }}>
                            <Typography.Text>Баг бүрэлдэхүүн</Typography.Text>                                
                        </Col>
                        <Col span={11}>
                            <Typography.Text>Үүрэг</Typography.Text>
                        </Col>
                        <Col span={2}></Col>                    
                    </Row>
                    <Form.List name="crew">                                                        
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                            <Row key={field.key} gutter={[8, 8]} style={{ width: '100%' }}>
                                <Col span={11}>
                                    <Form.Item
                                    {...field}
                                        name={[field.name, 'artist']}
                                        fieldKey={[field.fieldKey, 'artist']}                                                
                                    >
                                        <Select 
                                            showSearch
                                            onSearch={onArtistSearch}                                
                                            placeholder="Уран бүтээлч"                                                
                                            optionFilterProp="children"                                                             
                                        >
                                            { artists ? (
                                                <>
                                                    { artists.map(item => {
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
                                <Col span={11}>
                                    <Form.Item
                                    {...field}
                                        name={[field.name, 'role']}
                                        fieldKey={[field.fieldKey, 'role']}                                      
                                    >
                                        <Select 
                                            showSearch                                                              
                                            placeholder="Үүрэг"                                                
                                            optionFilterProp="children"                                                             
                                        >
                                            { occupations ? (
                                                <>
                                                    { occupations.map(item => {
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
                                <Col span={2}>
                                    <Form.Item>
                                        <PlusCircleOutlined onClick={() => add()} style={{ marginRight: '8px', fontSize: '20px', color: '#888' }} />
                                        <MinusCircleOutlined onClick={() => remove(field.name)} style={{ fontSize: '20px', color: '#888' }} />
                                    </Form.Item>  
                                </Col>
                            </Row>
                            ))}                                
                        </>
                        )}                                                                                                            
                    </Form.List>
                    <Row gutter={[16, 16]}>
                        <Col span={11} style={{ marginBottom: '8px' }}>
                            <Typography.Text>Жүжигчид</Typography.Text>                                
                        </Col>
                        <Col span={11}>
                            <Typography.Text>Дүр</Typography.Text>
                        </Col>
                        <Col span={2}></Col>                    
                    </Row>
                    <Form.List name="cast">                                                        
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                            <Row key={field.key} gutter={[8, 8]} style={{ width: '100%' }}>
                                <Col span={11}>
                                    <Form.Item
                                    {...field}
                                        name={[field.name, 'actor']}
                                        fieldKey={[field.fieldKey, 'actor']}                                                 
                                    >
                                        <Select 
                                            showSearch
                                            onSearch={onArtistSearch}                                
                                            placeholder="Уран бүтээлч"                                                
                                            optionFilterProp="children"                                                             
                                        >
                                            { artists ? (
                                                <>
                                                    {artists.map(item => {
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
                                <Col span={11}>
                                    <Form.Item
                                    {...field}
                                        name={[field.name, 'role_name']}
                                        fieldKey={[field.fieldKey, 'role_name']}                                      
                                    >
                                        <Input placeholder="Дүр" /> 
                                    </Form.Item>   
                                </Col>
                                <Col span={2}>
                                    <Form.Item>
                                        <PlusCircleOutlined onClick={() => add()} style={{ marginRight: '8px', fontSize: '20px', color: '#888' }} />
                                        <MinusCircleOutlined onClick={() => remove(field.name)} style={{ fontSize: '20px', color: '#888' }} />
                                    </Form.Item>  
                                </Col>
                            </Row>
                            ))}                                
                        </>
                        )}                                                                                                            
                    </Form.List>               
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Засах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<ToolOutlined />} style={{ marginRight: '8px' }}>
                                    Засах   
                                </Button>
                            </Popconfirm>
                            <Popconfirm title="Устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={onDelete}>
                                <Button danger type="primary" icon={<DeleteOutlined />}>
                                    Устгах
                                </Button>
                            </Popconfirm>
                        </div>                                                 
                    </Form.Item>                                       
                </Form>
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

export default connect(mapStateToProps)(MovieUpdate);