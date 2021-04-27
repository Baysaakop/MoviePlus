import { List, Typography, Avatar } from "antd";

function MovieMembers (props) {    

    return (
        <div>
            <List                                                                                                        
                itemLayout="horizontal"                                                    
                dataSource={props.members}
                renderItem={item => (
                <List.Item>                                                        
                    <List.Item.Meta
                        avatar={
                            <a href={`/artists/${item.artist.id}`}>
                                <Avatar size={48} src={item.artist.avatar} />
                            </a>
                        }
                        title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                        description={item.artist.occupation.map(occupation => {
                            return (
                                <span>{occupation.name} | </span>
                            )
                        })}
                    />
                    <Typography.Text>
                        {item.role.name}
                    </Typography.Text>                                                        
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;