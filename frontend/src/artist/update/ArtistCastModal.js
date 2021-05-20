import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../../api'
import { Form, Input, Modal, Select, message } from 'antd'

function ArtistCastModal (props) {
    const [form] = Form.useForm()
    const [movies, setMovies] = useState()

    useEffect(() => {                      
        if (props.item) {
            let results = []
            results.push(props.item.film)                        
            setMovies(results)      
        }        
    }, [props.item]) // eslint-disable-line react-hooks/exhaustive-deps

    function onSearch (value) {
        const url = api.films + "?name=" + value
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let results = res.data.results                          
            setMovies(results)            
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }

    function onFinish (values) {                      
        let film = movies.find(x => x.id === parseInt(values.movie))
        let data = {            
            film: film,
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
                title={ props.item ? "Дүр өөрчлөх" : "Кино нэмэх" }
                visible={true} 
                onOk={() => form.submit()}
                onCancel={onClose}
                okText={ props.item ? "Өөрчлөх" : "Нэмэх" }
                cancelText="Болих"
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={ props.item ? { movie: props.item.film.id.toString(), role_name: props.item.role_name } : undefined}>
                    <Form.Item name="movie" label="Кино" rules={[{ required: true, message: 'Кино сонгоно уу!' }]}>
                        <Select                                  
                            showSearch                                
                            onSearch={onSearch}
                            placeholder="Кино сонгоно уу"                                                
                            optionFilterProp="children"       
                            style={{ width: '100%' }}                         
                            disabled={props.item !== undefined}
                        >
                            { movies ? (
                                <>
                                    {movies.map(m => {
                                        return (
                                            <Select.Option key={m.id.toString()}>{m.movie.name}</Select.Option>
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

export default ArtistCastModal