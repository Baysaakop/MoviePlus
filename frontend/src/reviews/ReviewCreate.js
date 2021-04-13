import {  Button, Form, Input, Typography, message, InputNumber, Select } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import ImageUpload from '../components/ImageUpload';
import { Editor } from '@tinymce/tinymce-react';
import './ReviewCreate.css';

const { Option } = Select;

const ReviewCreate = (props) => {
    const [form] = Form.useForm()    
    const [image, setImage] = useState();
    const [content, setContent] = useState();
    const [movies, setMovies] = useState(); 

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
        formData.append('title', values.title);
        formData.append('content', content);        
        formData.append('thumbnail', image);
        if (values.score && values.score > 0) {
            formData.append('score', values.score);
        }
        if (values.movie && values.movie !== null) {
            formData.append('movie', values.movie);
        }        
        formData.append('token', props.token);
        axios({
            method: 'POST',
            url: `${api.reviews}/`,
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

    return (
        <div>            
            <div style={{ margin: '16px 0' }}>
                <Typography.Title level={3}>
                    Нийтлэл бичих
                </Typography.Title>       
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
                        rules={[{ required: true, message: 'Гарчиг өгнө үү!' }]}
                    >
                        <Input />
                    </Form.Item>        
                    <Form.Item
                        name="image"
                        label="Зураг"               
                        rules={[{ required: true, message: 'Зураг оруулна уу!' }]}                 
                    >                       
                        <div style={{ width: '100%', height: '200px' }}>
                            <ImageUpload width="400px" height="200px" onImageSelected={onImageSelected} image={undefined} />                        
                        </div>
                    </Form.Item>         
                    <Form.Item
                        name="score"
                        label="Оноо (10-аас)"
                    >
                        <InputNumber min={0} max={10} defaultValue={0} />
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
                        rules={[{ required: true, message: 'Контент оруулна уу!' }]}
                    >
                        <Editor
                            apiKey='wpwv44irouwa2fnzez4rgccg20gz5bri6qmwlt4wbeuha01r'
                            initialValue=""
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
                        <Button type="primary" htmlType="submit">
                            Нийтлэх
                        </Button>
                    </Form.Item>
                </Form>                        
            </div>  
        </div>
    )
}

export default ReviewCreate;