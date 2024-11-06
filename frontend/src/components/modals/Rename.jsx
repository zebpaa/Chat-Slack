import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as channelsSelectors, updateChannel } from '../../services/channelsSlice'
import routes from '../../routes';
import axios from 'axios';

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {}
};

const Rename = ({ onHide, currentChannelId }) => {
    const dispatch = useDispatch();
    const channels = useSelector(channelsSelectors.selectAll);
    const currentChannel = channels.find((channel) => channel.id === currentChannelId);
    const inputRef = useRef();

    useEffect(() => {
        // Используем setTimeout, чтобы гарантировать, что элемент полностью смонтирован
        setTimeout(() => {
            inputRef.current && inputRef.current.select();
        }, 0);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: currentChannel.name,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const newChannel = { changes: { name: values.name }, id: currentChannelId };
                await axios.patch(routes.channelPath(currentChannelId), values, { headers: getAuthHeader() })
                dispatch(updateChannel(newChannel));
                onHide();
            } catch (err) {
                formik.setSubmitting(false);
                throw err;
            }
        },
    });

    return (
        <Modal show>
            <Modal.Header closeButton onHide={onHide}>
                <Modal.Title className="h4">Переименовать канал</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            autoComplete="off"
                            name="name"
                            id="name"
                            className="mb-2"
                            required
                            ref={inputRef}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
                        <Form.Control.Feedback type="invalid">От 3 до 20 символов</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-end">
                        <Button className="me-2" variant="secondary" onClick={onHide}>Отменить</Button>
                        <Button type="submit" variant="primary">Отправить</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Rename;