import { List, Typography, Avatar } from "antd";

function MovieMembers (props) {

    function getMembers(members) {
        const result = []
        members.forEach(member => {
            const artist = member.artist;
            const role = member.role.name;
            const item = result.find(x => x.artist.id === artist.id);
            if (item && item !== null) {
                item.role = item.role + ", " + role
            } else {
                const d = {
                    artist: artist,
                    role: role
                }
                result.push(d)
            }
        })        
        return result;
    }

    return (
        <div>
            <List                                                                                                        
                itemLayout="horizontal"                                                    
                dataSource={getMembers(props.data)}
                renderItem={item => (
                <List.Item>                                                        
                    <List.Item.Meta
                        avatar={
                            <a href={`/artists/${item.artist.id}`}>
                                <Avatar size="large" src={item.artist.avatar} />
                            </a>
                        }
                        title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                        description={item.artist.occupation.map(occupation => {
                            return (
                                <span>{occupation.name} </span>
                            )
                        })}
                    />
                    <Typography.Text>
                        {item.role}
                    </Typography.Text>                                                        
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;