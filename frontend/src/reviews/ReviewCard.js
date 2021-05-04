import { StarFilled } from "@ant-design/icons";
import { Button, Card, Typography, Avatar, Tooltip } from "antd";
import { Link } from "react-router-dom";

function ReviewCard (props) {
    return (
        <div>
            <Card                                                        
                style={{ border: 0 }}
                cover={
                    <Link to={`/reviews/${props.item.id}`}>
                        <img alt="thumbnail" src={props.item.thumbnail} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </Link>
                }
            >
                <Card.Meta
                    avatar={<Avatar src={props.item.user.profile.avatar} />}
                    title={<Tooltip title={props.item.title}>{props.item.title}</Tooltip>}
                    description={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {`Нийтлэсэн: ${props.item.user.username}`}
                            </div>
                            <div>
                                <StarFilled style={{ color: '#fadb14' }} /> {props.item.score}/10
                            </div>
                        </div>
                    }
                />
                <Typography.Paragraph ellipsis={{ rows: 8 }} style={{ marginTop: '16px' }}>
                    <div dangerouslySetInnerHTML={{__html: props.item.content }} style={{ maxWidth: '1000px' }} />                                                                    
                </Typography.Paragraph>
                <Link to={`/reviews/${props.item.id}`}>
                    <Button block type="ghost">Унших</Button>
                </Link>                            
            </Card>
        </div>
    )
}

export default ReviewCard