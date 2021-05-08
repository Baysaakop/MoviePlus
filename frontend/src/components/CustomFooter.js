import { FacebookFilled, TwitterOutlined, InstagramOutlined, YoutubeFilled, GoogleOutlined } from "@ant-design/icons"
import { Grid, Col, Row, Typography, Tooltip, Button, Divider } from "antd"
import { Link } from "react-router-dom"
import MovieIcon from "../icons/MovieIcon"
import './CustomFooter.css'

const { useBreakpoint } = Grid

function CustomFooter (props) {

    const screens = useBreakpoint()

    function getPadding() {
        if (screens.xxl) {
            return '16px 15%'
        } else if (screens.xl) {
            return '16px 10%'
        } else if (screens.lg) {
            return '16px 8%'
        } else if (screens.md) {
            return '16px 5%'
        } else if (screens.sm) {
            return '16px 5%'
        } else if (screens.xs) {
            return '16px 5%'
        }
    }

    const styleLogo = {
        display: 'flex',
        justifyContent: 'flex-start',            
        marginBottom: '8px',
        borderRadius: '4px',
        fontFamily: 'Josefin Sans'                
    } 

    return (
        <div style={{ padding: getPadding() }}>
            <div style={{ marginTop: '32px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <div style={styleLogo}>         
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>                                    
                                <MovieIcon style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.85)' }} />
                            </div>
                            <Typography.Title level={2} style={{ margin: 0 }}>
                                movie+  
                            </Typography.Title>
                        </div>     
                        <Typography.Paragraph style={{ width: '80%' }}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, ducimus, atque. Praesentium suscipit provident explicabo dignissimos nostrum.
                        </Typography.Paragraph>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={4}>
                        <Typography.Title level={3}>Цэс</Typography.Title>
                        <Link to="/movies">                            
                            <Typography.Text style={{ display: 'block' }}>
                                Кино
                            </Typography.Text>
                        </Link>
                        <Link to="/series">
                            <Typography.Text style={{ display: 'block' }}>
                                Цуврал
                            </Typography.Text>
                        </Link>
                        <Link to="/artist">
                            <Typography.Text style={{ display: 'block' }}>
                                Уран бүтээлч
                            </Typography.Text>
                        </Link>
                        <Link to="/reviews">
                            <Typography.Text style={{ display: 'block' }}>
                                Нийтлэл
                            </Typography.Text>
                        </Link>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={4}>
                        <Typography.Title level={3}>Тусламж</Typography.Title>
                        <Link to="/about">                            
                            <Typography.Text style={{ display: 'block' }}>
                                Бидний тухай
                            </Typography.Text>
                        </Link>
                        <Link to="/tutorial">
                            <Typography.Text style={{ display: 'block' }}>
                                Ашиглах заавар
                            </Typography.Text>
                        </Link>
                        <Link to="/about">
                            <Typography.Text style={{ display: 'block' }}>
                                Вебийн бүтэц
                            </Typography.Text>
                        </Link>
                        <Link to="/login">
                            <Typography.Text style={{ display: 'block' }}>
                                Нэвтрэх
                            </Typography.Text>
                        </Link>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Typography.Title level={3}>Холбоо барих</Typography.Title>
                        <Typography.Paragraph style={{ margin: 0 }}>
                            Та доор байрлах манай сошиал хаягуудыг сонгон дагаснаар цаг алдалгүй мэдээ мэдээлэл хүлээн авах боломжтой.
                        </Typography.Paragraph>
                        <div className="social" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginTop: '8px' }}>
                            <Tooltip title="Facebook">
                                <Button className="facebook" href="#" type="ghost" icon={<FacebookFilled />} style={{ marginRight: '8px', padding: 0 }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Google">
                                <Button className="google" href="#" type="ghost" icon={<GoogleOutlined />} style={{ marginRight: '8px', padding: 0 }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Twitter">
                                <Button className="twitter" href="#" type="ghost" icon={<TwitterOutlined />} style={{ marginRight: '8px', padding: 0 }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Instagram">
                                <Button className="instagram" href="#" type="ghost" icon={<InstagramOutlined />} style={{ marginRight: '8px', padding: 0 }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Youtube">
                                <Button className="youtube" href="#" type="ghost" icon={<YoutubeFilled />} style={{ marginRight: '8px', padding: 0 }} size="large" /> 
                            </Tooltip>                   
                        </div>
                    </Col>
                </Row>
            </div>
            <Divider />
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={24} lg={8}>
                    <Typography.Text>© 2021 Movie+</Typography.Text>
                </Col>
                <Col xs={24} sm={24} md={24} lg={16} style={ screens.lg ? { textAlign: 'right' } : { textAlign: 'left' }}>
                    <Typography.Text>Зохиогчийн эрх хуулиар хамгаалагдсан. Хөгжүүлсэн On+</Typography.Text>
                </Col>
            </Row>              
        </div>
    )
}

export default CustomFooter