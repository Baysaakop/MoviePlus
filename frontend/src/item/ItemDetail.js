import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, Spin } from 'antd';
import { connect } from 'react-redux';
import api from '../api';

function ItemDetail(props) {

    const [item, setItem] = useState();

    useEffect(() => {
        const id = props.match.params.itemID;
        const url = api.items + "/" + id + "/";        
        axios({
            method: 'GET',
            url: url
        })
        .then(res => {
            console.log(res.data);
            setItem(res.data);
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [props.match]);

    return(
        <div>
            {item ? (
                <>                    
                    <Image                    
                        width={200}
                        alt="logo"
                        src={item.image}
                        fallback="https://thumbs.dreamstime.com/z/no-image-available-icon-photo-camera-flat-vector-illustration-132483296.jpg"
                    />                    
                    <h1>Name: {item.name}</h1>
                    <p>Description: {item.description}</p>
                    <p>Created at: {item.created_at}</p>
                    <p>Last updated: {item.updated_at}</p>
                    <a href={`/updateitem/${item.id}`} hidden={props.token === null}>Edit</a>
                </>
            ) : (
                <>
                    <Spin />
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ItemDetail);