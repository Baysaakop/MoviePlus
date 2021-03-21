import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Result, Spin } from 'antd';
import axios from 'axios';
import { connect } from "react-redux";
import api from '../api';
import ImageUpload from "../components/ImageUpload";
import { LoadingOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 12,
            offset: 6,
        },
    },
};

function ItemUpdate (props) {    
    const [form] = Form.useForm()    
    const [fields, setFields] = useState();
    const [image, setImage] = useState();    

    useEffect(() => {
        if (props.match.params.itemID) {
            var id = props.match.params.itemID;
            var url = api.items + "/" + id + "/";
            axios({
                method: 'GET',
                url: url
            }).then(res => {        
                console.log(res.data);        
                setFields(res.data);
            }).catch(err => {
                console.log(err.message)
            })
        }
    }, [props.match.params.itemID])

    const onFinish = values => {                                     
        // Image upload
        if (image) {
            var formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('token', props.token);
            formData.append('image', image);
            axios({
                method: 'PUT',
                url: `${api.items}/${fields.id}/`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
        } else {
            const data = {
                "name": values.name ? values.name : fields.name,
                "description": values.description ? values.description : fields.description,            
                "token": props.token,                
                "image": image
            }            
            axios({
                method: 'PUT',
                url: `${api.items}/${fields.id}/`,
                data: data                
            })            
            .then(res => {
                console.log(res)
                message.info(res.statusText)                
            })
            .catch(err => {                
                console.log(err)
                message.info(err)
            })  
        }
    };

    const onReset = () => {
        form.resetFields();
    }

    const onDelete = () => {        
        axios({
            method: 'DELETE',
            url: `${api.items}/${props.fields.id}/`         
        })            
        .then(res => {
            console.log(res)
            message.info("Deleted")
            props.history.push('/items')            
        })
        .catch(err => {                
            console.log(err)
            message.info(err)
        })
    }

    const onImageSelected = (path) => {        
        setImage(path);
    } 

    return (
        <div>    
            {props.token && props.token !== null ? (
                <>
                {fields ? (
                    <>
                        <Typography.Title level={3}>
                            {`Update item ${fields.name}`}                   
                        </Typography.Title>
                        <Form
                            {...formItemLayout}             
                            form={form}                                
                            name="itemform"                        
                            initialValues={{
                                name: fields.name,
                                description: fields.description
                            }}       
                            onFinish={onFinish}                              
                        >
                            <Form.Item                    
                                name="name"                            
                                label="Name"      
                                rules={[{ required: true, message: 'Please input item name!' }]}                                                             
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"                                     
                            >
                                <TextArea rows={6} />
                            </Form.Item>
                            <Form.Item
                                name="image"
                                label="Image"
                            >                               
                                <ImageUpload onImageSelected={onImageSelected} image={fields.image} />                        
                            </Form.Item>                        
                            <Form.Item {...tailFormItemLayout}>
                                <div>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                                        Submit
                                    </Button>
                                    <Button type="ghost" onClick={onReset} style={{ marginRight: '8px' }}>
                                        Reset
                                    </Button>
                                    <Button danger type="primary" onClick={onDelete}>
                                        Delete
                                    </Button>
                                </div>                                        
                            </Form.Item>
                        </Form>             
                    </>
                ) : (
                    <Spin indicator={indicator} />
                )}       
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

export default connect(mapStateToProps)(ItemUpdate);