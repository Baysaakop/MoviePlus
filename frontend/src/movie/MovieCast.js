import { List, Typography, Avatar } from "antd";
import { Link } from "react-router-dom";

function MovieCast (props) {    
    return (
        <div>
            <List                                                                                                        
                grid={{
                    gutter: 16,
                    xs: 3,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 8,
                }}                              
                dataSource={props.actors}
                renderItem={item => (
                <List.Item>                                                        
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/artists/${item.artist.id}`}>
                            <Avatar shape="square" size={80} src={item.artist.avatar} />
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.artist.name}</Typography.Text>
                            <Typography.Text style={{ display: 'block' }}>- {item.role_name}</Typography.Text>
                        </Link>
                    </div>
                </List.Item>
                )}
            />  
        </div>
    )
}

export default MovieCast;