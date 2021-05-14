import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api'
import { Form, Modal, Select, message } from 'antd'

function CrewModal (props) {
    const [form] = Form.useForm()
    const [artists, setArtists] = useState()
    const [occupations, setOccupations] = useState()

    useEffect(() => {                      
        if (props.item) {
            let results = []
            results.push(props.item.artist)                        
            setArtists(results)      
        }       
        axios({
            method: 'GET',
            url: api.occupations,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {                                    
            setOccupations(res.data.results.filter(x => x.id !== 1))            
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        }) 
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
        let role = []
        values.role.forEach(element => {
            let occupation = occupations.find(x => x.id.toString() === element)
            role.push(occupation)
        });        
        let data = {
            id: props.item ? props.item.id : 0,
            artist: artist,
            role: role
        }            
        console.log(data)
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
                title={ props.item ? "Уран бүтээлч өөрчлөх" : "Уран бүтээлч нэмэх" }
                visible={true} 
                onOk={() => form.submit()}
                onCancel={onClose}
                okText={ props.item ? "Өөрчлөх" : "Нэмэх" }
                cancelText="Болих"
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={ props.item ? { actor: props.item.artist.id.toString(), role_name: props.item.role_name } : undefined}>
                    <Form.Item name="actor" label="Уран бүтээлч" rules={[{ required: true, message: 'Уран бүтээлч сонгоно уу!' }]}>
                        <Select                                  
                            showSearch                                
                            onSearch={onSearch}
                            placeholder="Уран бүтээлч сонгоно уу"                                                
                            optionFilterProp="children"       
                            style={{ width: '100%' }}                         
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
                    <Form.Item name="role" label="Үүрэг" rules={[{ required: true, message: 'Үүрэг сонгоно уу!' }]}>
                        <Select                                  
                            showSearch                                                            
                            mode="multiple"
                            placeholder="Үүрэг сонгоно уу"                                                
                            optionFilterProp="children"       
                            style={{ width: '100%' }}                         
                        >
                            { occupations ? (
                                <>
                                    {occupations.map(o => {
                                        return (
                                            <Select.Option key={o.id.toString()}>{o.name}</Select.Option>
                                        )
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CrewModal