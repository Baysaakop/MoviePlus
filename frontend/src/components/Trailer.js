import { Grid, Modal } from "antd"

const { useBreakpoint } = Grid

function Trailer (props) {
    const screens = useBreakpoint()

    function getWidth() {
        if (screens.xxl) {
            return window.screen.width * 0.7
        } else if (screens.xl) {
            return window.screen.width * 0.8
        } else if (screens.lg) {
            return window.screen.width * 0.84
        } else if (screens.md) {
            return window.screen.width * 0.9
        } else if (screens.sm) {
            return window.screen.width * 0.9
        } else if(screens.xs) {
            return window.screen.width
        }
    }

    function getHeight() {
        if (screens.xxl) {
            return window.screen.width * 0.35
        } else if (screens.xl) {
            return window.screen.width * 0.4
        } else if (screens.lg) {
            return window.screen.width * 0.42
        } else if (screens.md) {
            return window.screen.width * 0.45
        } else if (screens.sm) {
            return window.screen.width * 0.5
        } else if(screens.xs) {
            return window.screen.width * 0.6
        }     
    }

    return (
        <div>
            <Modal 
                centered                                                                                                                                 
                visible={true}
                footer={null}                    
                onCancel={() => props.hide()}                                                      
                width={getWidth()}
                style={{ padding: 0 }}
            >                                                   
                <div>
                    <iframe title={props.title} width="100%" height={getHeight()} src={props.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>                                                
                </div> 
            </Modal>
        </div>
    )
}

export default Trailer