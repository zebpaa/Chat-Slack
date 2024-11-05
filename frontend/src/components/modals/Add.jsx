import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { useEffect, useRef } from "react";
import { addChannel } from "../../services/channelsSlice";
import { setCurrentChannel } from "../../services/uiSlice";
import axios from "axios";
import routes from "../../routes";
import { useDispatch } from "react-redux";

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {}
};

const Add = ({ onHide, setCurrentChannelId }) => {
    const dispatch = useDispatch();
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: async (values) => {
            try {
                const { data } = await axios.post(routes.channelsPath(), values, { headers: getAuthHeader() });
                setCurrentChannelId(data.id);
                dispatch(addChannel(data));
                dispatch(setCurrentChannel(data.id));
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
                <Modal.Title className="h4">Добавить канал</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            name="name"
                            id="name"
                            className="mb-2"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                            required
                            ref={inputRef}
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

export default Add;