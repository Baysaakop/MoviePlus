import React, { useEffect, useState } from 'react';
import { Image, List, Space, Breadcrumb  } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function ItemList(props) {

    const [items, setItems] = useState();

    useEffect(() => {        
        var url = api.items + props.location.search;
        axios({
            method: 'GET',
            url: url
        })
        .then(res => {
            // console.log(res.data);
            setItems(res.data);
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [props.location.search]);

    return(
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Home</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Item List
                </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ minHeight: '70vh' }}>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        pageSize: 3,
                    }}
                    dataSource={items}                
                    renderItem={item => (
                        <List.Item
                            style={{  border: '1px solid white' }}
                            key={item.title}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}
                            extra={
                                <Link to={`items/${item.id}`}>
                                    <Image
                                        width={200}
                                        alt="logo"
                                        src={item.image}
                                        fallback="https://thumbs.dreamstime.com/z/no-image-available-icon-photo-camera-flat-vector-illustration-132483296.jpg"
                                    />
                                </Link>
                            }
                        >
                            <List.Item.Meta                    
                                title={                        
                                    <a href={`/items/${item.id}`}>{item.name}</a>                                                
                                }
                                description={<a href={`/updateitem/${item.id}/`} hidden={props.token === null}>[Edit]</a>}   
                            />
                            {item.description}
                        </List.Item>
                    )}
                />
            </div>
        </div>        
    );
};

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ItemList);