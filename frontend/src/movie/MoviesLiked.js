import { List } from 'antd';
import React from 'react';
// import MovieCard from './MovieCard';
import MovieCard2 from './MovieCard2';

function MoviesLiked (props) {    
    return (
        <div>            
            <List                        
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}                      
                pagination={{ pageSize: 12 }}                  
                style={{ marginTop: '16px' }}                
                dataSource={props.movies ? props.movies : undefined}
                renderItem={item => (
                    <List.Item>
                        <MovieCard2 movie={item} />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default MoviesLiked;