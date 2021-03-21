import { Breadcrumb, Button, Form, Input, Result, Typography, message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import ImageUpload from '../components/ImageUpload';
import { connect } from "react-redux";
import { Editor } from '@tinymce/tinymce-react';
import './PostCreate.css';

const PostCreate = (props) => {
    const [form] = Form.useForm()    
    const [image, setImage] = useState();
    const [content, setContent] = useState();

    const onImageSelected = (path) => {
        setImage(path);
    } 

    const handleEditorChange = (content, editor) => {
        setContent(content)
    }

    function onFinish (values) {
        var formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', content);        
        formData.append('thumbnail', image);
        formData.append('token', props.token);
        axios({
            method: 'POST',
            url: `${api.posts}/`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'                          
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                
                message.info("Saved successfully")
            }             
        }).catch(err => {
            message.error(err.message)
            console.log(err)
        })
    };

    return (
        <div>            
            {props.token && props.token !== null ? (
                <>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <a href="/">Home</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="/posts">Posts</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            New
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ margin: '16px 0' }}>
                        <Typography.Title level={3}>
                            Write a new post
                        </Typography.Title>       
                        <Form                             
                            form={form}  
                            name="postform"              
                            layout="vertical"
                            style={{ padding: '16px' }}                 
                            onFinish={onFinish}                              
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Гарчиг өгнө үү!' }]}
                            >
                                <Input />
                            </Form.Item>        
                            <Form.Item
                                name="image"
                                label="Thumbnail"                                
                            >                       
                                <div style={{ width: '100%', height: '200px' }}>
                                    <ImageUpload onImageSelected={onImageSelected} imageUrl={undefined} />                        
                                </div>
                            </Form.Item>                     
                            <Form.Item
                                label="Content"
                                name="post"
                                rules={[{ required: true, message: 'Нийтлэлээ оруулна уу!' }]}
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
                                    Post
                                </Button>
                            </Form.Item>
                        </Form>                        
                    </div>                            
                </>
            ) : (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" href="/">Back Home</Button>}
                />
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(PostCreate);