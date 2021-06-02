import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../../api'
import { Form, Input, Modal, Select, message } from 'antd'

function MovieCastModal (props) {
    const [form] = Form.useForm()
    const [artists, setArtists] = useState()

    useEffect(() => {                      
        if (props.item) {
            let results = []
            results.push(props.item.artist)                        
            setArtists(results)      
        }        
    }, [props.item]) // eslint-disable-line react-hooks/exhaustive-deps

    function onSearch (value) {
        const url = api.artists + "?name=" + value
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let results = res.data.results                          
            setArtists(results)            
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }

    function onFinish (values) {        
        let artist = artists.find(x => x.id === parseInt(values.actor))
        let data = {            
            artist: artist,
            role_name: values.role_name ? values.role_name : ""
        }            
        props.return(data)
        form.resetFields()
    }

    function onClose () {
        form.resetFields()
        props.hide()
    }

    return (
        <div>
            <Modal 
                title={ props.item ? "Жүжигчин өөрчлөх" : "Жүжигчин нэмэх" }
                visible={true} 
                onOk={() => form.submit()}
                onCancel={onClose}
                okText={ props.item ? "Өөрчлөх" : "Нэмэх" }
                cancelText="Болих"
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={ props.item ? { actor: props.item.artist.id.toString(), role_name: props.item.role_name } : undefined}>
                    <Form.Item name="actor" label="Жүжигчин" rules={[{ required: true, message: 'Жүжигчин сонгоно уу!' }]}>
                        <Select                                  
                            showSearch                                
                            onSearch={onSearch}
                            placeholder="Жүжигчин сонгоно уу"                                                
                            optionFilterProp="children"       
                            style={{ width: '100%' }}             
                            disabled={props.item !== undefined}            
                        >
                            { artists ? (
                                <>
                                    {artists.map(a => {
                                        return (
                                            <Select.Option key={a.id.toString()}>{a.name}</Select.Option>
                                        )
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item name="role_name" label="Дүр">
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default MovieCastModal