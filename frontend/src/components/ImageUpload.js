import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import './ImageUpload.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ImageUpload = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {                
        setImageUrl(props.image)
    }, [props.image]);

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }

    function handleChange(info) {        
        setLoading(true);        
        if (info.file.type === 'image/jpeg' || info.file.type === 'image/png') {            
            getBase64(info.file, imageUrl => 
                setImageUrl(imageUrl),
                props.onImageSelected(info.file)
            );
            // setImage(info.file);
            // props.onImageSelected(info.file);
        }
        else {            
            message.error('You can only upload JPG/PNG file!');     
        }              
        setLoading(false);           
    }

    const uploadButton = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: props.height, width: props.width }}>
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        </div>
    );

    return (
        <Upload            
            name="image"
            multiple={false}
            listType="picture-card"
            className="image-uploader"
            showUploadList={false}            
            beforeUpload={() => false}
            onChange={handleChange}                
            style={{ height: props.height, width: props.width }}               
        >
            {imageUrl ? <img src={imageUrl} alt="upload" style={{ height: props.height, width: props.width, objectFit: 'scale-down' }} /> : uploadButton}
        </Upload>
    );
};

export default ImageUpload;