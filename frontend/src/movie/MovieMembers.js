import { List, Typography, Avatar } from "antd";
import { Link } from "react-router-dom";

function MovieMembers (props) {    

    function getRoles(role) {
        let result = []
        role.forEach(element => {
            result.push(element.name)    
        });
        return result.toString()
    }

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
                dataSource={props.members}
                renderItem={item => (
                <List.Item>                                                        
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/artists/${item.artist.id}`}>
                            <Avatar shape="square" size={80} src={item.artist.avatar} />
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.artist.name}</Typography.Text>
                            <Typography.Text>
                                {getRoles(item.role)}
                            </Typography.Text>   
                        </Link>
                    </div>
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;