import { FacebookFilled, TwitterOutlined, InstagramOutlined, YoutubeFilled } from "@ant-design/icons"
import { Grid, Col, Row, Typography, Tooltip, Button, Divider } from "antd"
import { Link } from "react-router-dom"

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

    return (
        <div style={{ padding: getPadding() }}>
            <div style={{ marginTop: '32px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Typography.Title level={3}>Movie+</Typography.Title>
                        <Typography.Paragraph style={{ width: '80%' }}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, ducimus, atque. Praesentium suscipit provident explicabo dignissimos nostrum.
                        </Typography.Paragraph>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
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
                    <Col xs={24} sm={24} md={12} lg={6}>
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
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Typography.Title level={3}>Холбоо барих</Typography.Title>
                        <Typography.Paragraph style={{ margin: 0 }}>
                            Та доор байрлах манай сошиал хаягуудыг сонгон дагаснаар цаг алдалгүй мэдээ мэдээлэл хүлээн авах боломжтой.
                        </Typography.Paragraph>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                            <Tooltip title="Facebook">
                                <Button shape="circle" icon={<FacebookFilled />} style={{ margin: '8px' }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Twitter">
                                <Button shape="circle" icon={<TwitterOutlined />} style={{ margin: '8px' }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Instagram">
                                <Button shape="circle" icon={<InstagramOutlined />} style={{ margin: '8px' }} size="large" /> 
                            </Tooltip>
                            <Tooltip title="Youtube">
                                <Button shape="circle" icon={<YoutubeFilled />} style={{ margin: '8px' }} size="large" /> 
                            </Tooltip>                   
                        </div>
                    </Col>
                </Row>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>
                    © 2021 Movie Plus Төсөл.
                </p>
                <p>                                                                       
                    Зохиогчийн эрх хуулиар хамгаалагдсан. Хөгжүүлсэн On Plus.
                </p> 
            </div>   
        </div>
    )
}

export default CustomFooter