import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

function Moderator (props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/movieaddrequests">
                        <Button size="large" type="ghost" style={{ width: '300px', height: '100px', fontSize: '20px' }}>Шинэ кино</Button>
                    </Link>
                </Col>  
                <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/movieupdaterequests">
                        <Button size="large" type="ghost" style={{ width: '300px', height: '100px', fontSize: '20px' }}>Кино засвар</Button>
                    </Link> 
                </Col>  
                <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/artistaddrequests">
                        <Button size="large" type="ghost" style={{ width: '300px', height: '100px', fontSize: '20px' }}>Шинэ уран бүтээлч</Button>
                    </Link> 
                </Col>  
                <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/artistupdaterequests">
                        <Button size="large" type="ghost" style={{ width: '300px', height: '100px', fontSize: '20px' }}>Уран бүтээлч засвар</Button>
                    </Link> 
                </Col>             
            </Row>
        </div>
    )
}

export default Moderator;