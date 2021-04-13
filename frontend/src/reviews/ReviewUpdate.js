import {  Button, Form, Input, Typography, message, InputNumber, Select, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import ImageUpload from '../components/ImageUpload';
import { Editor } from '@tinymce/tinymce-react';
import './ReviewCreate.css';

const { Option } = Select;

function ReviewUpdate (props) {
    const [form] = Form.useForm()
    const [reviews, setReviews] = useState()
    const [selection, setSelection] = useState()
    const [image, setImage] = useState()
    const [content, setContent] = useState()
    const [movies, setMovies] = useState()

    useEffect(() => {
        axios({
            method: 'GET',                        
            url: api.reviews + "?user=" + props.userID
        })
        .then(res => {                                 
            setReviews(res.data.results)            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }, [props.userID])

    function onSelect(id) {
        const target = reviews.find(x => x.id === parseInt(id))    
        console.log(target)
        form.setFieldsValue({
            title: target.title !== null ? target.title : "",
            score: target.score !== null ? target.score : 0,
            movie: target.movie !== null ? target.movie : undefined,                                                       
        })     
        setContent(target.content)
        setImage(target.thumbnail)     
        setSelection(target)
    }

    const onImageSelected = (path) => {
        setImage(path);
    } 

    const handleEditorChange = (content, editor) => {
        setContent(content)
    }

    function onMovieSearch(value) {                
        axios({
            method: 'GET',                        
            url: api.movies + "?name=" + value
        })
        .then(res => {                        
            setMovies(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function onFinish (values) {                        
        var formData = new FormData();                              
        if (values.title && values.title !== selection.title) {
            formData.append('title', values.title);
        }
        if (values.movie && values.movie !== selection.movie.id) {
            formData.append('movie', values.movie);
        }       
        if (values.score && values.score !== selection.score) {
            formData.append('score', values.score);
        }     
        if (image && image !== selection.thumbnail) {
            formData.append('thumnail', image);
        }
        if (content && content !== selection.content) {
            formData.append('content', content);
        }
        formData.append('token', props.token);
        axios({
            method: 'PUT',
            url: `${api.reviews}/${selection.id}/`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${props.token}`                          
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                
                message.info("Амжилттай")
            }             
        }).catch(err => {
            message.error("Амжилтгүй")
            console.log(err)
        })
    };

    function onDelete() {
        axios({
            method: 'DELETE',
            url: `${api.reviews}/${selection.id}/`                
        })            
        .then(res => {                
            if (res.status === 200 || res.status === 204) {
                message.info("Устгалаа")   
            }                        
            form.resetFields()             
        })
        .catch(err => {                            
            message.error("Амжилтгүй")
        })  
    }

    return (
        <div>
             <div style={{ margin: '16px 0' }}>
                <Typography.Title level={3}>
                    Нийтлэл засах/устгах
                </Typography.Title>       
                <Select
                    showSearch                
                    style={{ width: '100%', margin: '8px 0' }}
                    placeholder="Нийтлэл сонгоно уу"                   
                    onSelect={onSelect}                         
                    optionFilterProp="children"                            
                >
                    { reviews ? (
                        <>
                            {reviews.map(item => {
                                return (
                                    <Option key={item.id}>{item.title}</Option>
                                )
                            })}
                        </>
                    ) : (
                        <></>
                    )}
                </Select> 
                { selection ? (
                    <Form                             
                        form={form}  
                        name="postform"              
                        layout="vertical"
                        style={{ padding: '16px' }}                 
                        onFinish={onFinish}                              
                    >
                        <Form.Item
                            label="Гарчиг"
                            name="title"
                        >
                            <Input />
                        </Form.Item>        
                        <Form.Item
                            name="image"
                            label="Зураг"                          
                        >                       
                            <div style={{ width: '100%', height: '200px' }}>
                                <ImageUpload width="400px" height="200px" onImageSelected={onImageSelected} image={image} />                        
                            </div>
                        </Form.Item>         
                        <Form.Item
                            name="score"
                            label="Оноо (10-аас)"
                        >
                            <InputNumber min={0} max={10} />
                        </Form.Item> 
                        <Form.Item
                            name="movie"
                            label="Кино"
                        >
                            <Select 
                                showSearch
                                onSearch={onMovieSearch}                                
                                placeholder="Кино сонгох"                                                
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
                        </Form.Item>            
                        <Form.Item
                            label="Контент"
                            name="post"
                        >
                            <Editor
                                apiKey='wpwv44irouwa2fnzez4rgccg20gz5bri6qmwlt4wbeuha01r'
                                initialValue={content}
                                init={{
                                    height: 500,                                    
                                    menubar: ['file', 'insert'],                                    
                                    plugins: [
                                        'advlist autolink lists link image imagetools charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],                                        
                                    toolbar:
                                        'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image'
                                }}                                    
                                onEditorChange={handleEditorChange}
                            />
                        </Form.Item>                                                        
                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Popconfirm title="Засах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                    <Button type="primary" style={{ marginRight: '8px' }}>
                                        Засах   
                                    </Button>
                                </Popconfirm>
                                <Popconfirm title="Устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={onDelete}>
                                    <Button danger type="primary">
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
        </div>
    )
}

export default ReviewUpdate;