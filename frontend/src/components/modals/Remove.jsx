import { Modal, Button } from 'react-bootstrap';
import { removeChannel } from '../../services/channelsSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import routes from '../../routes';
import { setCurrentChannel } from '../../services/uiSlice';

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {}
};

const Remove = ({ onHide, currentChannelId, setCurrentChannelId, modalInfo: { item } }) => {
    const dispatch = useDispatch();
    const defaultChannelId = useSelector((state) => state.ui.defaultChannelId);

    const handleRemoveChannel = async () => {
        await axios.delete(routes.channelPath(item), { headers: getAuthHeader() });
        setCurrentChannelId(defaultChannelId)
        dispatch(removeChannel(currentChannelId));
        dispatch(setCurrentChannel(defaultChannelId));
        onHide();
    };

    return (
        <Modal show>
            <Modal.Header closeButton onHide={onHide}>
                <Modal.Title className="h4">Удалить канал</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="lead">Уверены?</p>
                <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={onHide}>Отменить</Button>
                    <Button variant="danger" onClick={handleRemoveChannel}>Удалить</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Remove;