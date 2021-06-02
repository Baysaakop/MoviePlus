import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../../api'
import { Form, Modal, Select, message } from 'antd'

function ArtistCrewModal (props) {
    const [form] = Form.useForm()
    const [movies, setMovies] = useState()
    const [occupations, setOccupations] = useState()

    useEffect(() => {                      
        if (props.item) {
            let results = []
            results.push(props.item.film)                        
            setMovies(results)      
        }        
        if (!occupations) {
            getOccupations()
        }        
    }, [props.item]) // eslint-disable-line react-hooks/exhaustive-deps

    function getOccupations () {
        axios({
            method: 'GET',
            url: api.occupations,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let results = res.data.results                          
            setOccupations(results.filter(x => x.id !== 1))            
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }

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
        let role = []
        values.role.forEach(item => {
            let r = occupations.find(x => x.id === parseInt(item))
            role.push(r)
        })
        let data = {            
            film: film,
            role: role
        }            
        props.return(data)        
        form.resetFields()        
    }

    function onClose () {
        form.resetFields()
        props.hide()
    }

    function getRoleIDs () {
        let arr = []
        props.item.role.forEach(x => {
            arr.push(x.id.toString())
        })
        return arr
    }

    return (
        <div>
            <Modal 
                title={ props.item ? "Үүрэг өөрчлөх" : "Кино нэмэх" }
                visible={true} 
                onOk={() => form.submit()}
                onCancel={onClose}
                okText={ props.item ? "Өөрчлөх" : "Нэмэх" }
                cancelText="Болих"
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={ props.item ? { movie: props.item.film.id.toString(), role: getRoleIDs()} : undefined}>
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
                    <Form.Item name="role" label="Үүрэг" rules={[{ required: true, message: 'Үүрэг сонгоно уу!' }]}>
                        <Select                                  
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

export default ArtistCrewModal