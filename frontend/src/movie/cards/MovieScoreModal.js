import { Modal, Rate, Typography } from "antd"
import { useEffect, useState } from "react"

const tooltips = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

function MovieScoreModal (props) {

    const [value, setValue] = useState()

    useEffect(() => {              
        setValue(props.value)
    }, [props.movie, props.value]) // eslint-disable-line react-hooks/exhaustive-deps   

    function onScore (val) {
        setValue(val)
        props.score(val)        
    }

    function onOk () {        
        props.hide()
    }

    function onClose () {        
        props.hide()
    }

    return (
        <div>
            <Modal 
                title={`"${props.movie.name}"-д үнэлгээ өгөх`}
                visible={true}           
                onOk={onOk}      
                onCancel={onClose}                
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Title level={5}>Таны үнэлгээ {value}</Typography.Title>
                        <Rate count={10} tooltips={tooltips} value={value} onChange={onScore} />      
                    </div>
                </div>              
            </Modal>
        </div>
    )
}

export default MovieScoreModal