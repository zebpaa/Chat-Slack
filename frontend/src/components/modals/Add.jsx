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
import { useTranslation } from 'react-i18next';

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {}
};

const Add = ({ onHide, setCurrentChannelId }) => {
    const channels = useSelector(channelsSelectors.selectAll);
    const dispatch = useDispatch();
    const inputRef = useRef();
    const { t } = useTranslation();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const channelSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('modal.errors.validation.required'))
            .min(3, t('modal.errors.validation.minMax'))
            .max(20, t('modal.errors.validation.minMax'))
            .notOneOf(channels.map((channel) => channel.name), t('modal.errors.validation.unique'))
    });

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: channelSchema,
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
                <Modal.Title className="h4">{t('modal.add.heading')}</Modal.Title>
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
                        <Form.Label className="visually-hidden" htmlFor="name">{t('modal.name')}</Form.Label>
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="d-flex justify-content-end">
                        <Button className="me-2" variant="secondary" onClick={onHide}>{t('modal.cancelBtn')}</Button>
                        <Button type="submit" variant="primary">{t('modal.submitBtn')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Add;