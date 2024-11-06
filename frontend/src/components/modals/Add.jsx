import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { useEffect, useRef } from "react";
import { addChannel } from "../../services/channelsSlice";
import { setCurrentChannel } from "../../services/uiSlice";
import axios from "axios";
import routes from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { selectors as channelsSelectors } from '../../services/channelsSlice.js'
import * as Yup from 'yup';

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {}
};

const Add = ({ onHide, setCurrentChannelId }) => {
    const channels = useSelector(channelsSelectors.selectAll);
    const dispatch = useDispatch();
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const channelAddingSchema = Yup.object().shape({
        name: Yup.string()
            .required('Обязательное поле')
            .min(3, 'От 3 до 20 символов')
            .max(20, 'От 3 до 20 символов')
            .notOneOf(channels.map((channel) => channel.name), 'Должно быть уникальным')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: channelAddingSchema,
        onSubmit: async (values) => {
            try {
                const { data } = await axios.post(routes.channelsPath(), values, { headers: getAuthHeader() });
                setCurrentChannelId(data.id);
                dispatch(addChannel(data));
                dispatch(setCurrentChannel(data.id));
                onHide();
            } catch (err) {
                formik.setSubmitting(false);
                console.log('err: ', err);
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
                            className={`mb-2 ${formik.errors.name && 'is-invalid'}`}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                            required
                            ref={inputRef}
                        />
                        <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
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