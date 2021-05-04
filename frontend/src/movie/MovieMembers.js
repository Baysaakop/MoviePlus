import { List, Typography, Avatar } from "antd";
import { Link } from "react-router-dom";

function MovieMembers (props) {    

    function getRoles(members) {
        let result = []
        members.forEach(member => {
            let item = result.find(x => x.artist.id === member.artist.id)
            if (item === undefined || item === null) {
                item = {
                    artist: member.artist,
                    role: member.role.name
                }
                result.push(item)
            } else {
                item.role = item.role + ", " + member.role.name
            }
        });
        console.log(result)
        return result
    }

    return (
        <div>
            <List                                                                                                        
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 4,
                    xl: 5,
                    xxl: 6,
                }}                                                
                dataSource={getRoles(props.members)}
                renderItem={item => (
                <List.Item>                                                        
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/artists/${item.artist.id}`}>
                            <Avatar size={100} src={item.artist.avatar} />
                            <Typography.Text style={{ fontWeight: 'bold', display: 'block' }}>{item.artist.name}</Typography.Text>
                            <Typography.Text style={{ display: 'block' }}>- {item.role}</Typography.Text>
                        </Link>
                    </div>
                </List.Item>
                )}
            />
        </div>
    )
}

export default MovieMembers;