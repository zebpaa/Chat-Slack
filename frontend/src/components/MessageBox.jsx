import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { selectors as channelsSelectors } from '../services/channelsSlice.js'
import { addMessage } from "../services/messagesSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import routes from "../routes.js";

const MessageBox = ({ messages, currentChannelId }) => {
    const dispatch = useDispatch();
    const username = useSelector((state) => state.auth.username);
    const channels = useSelector(channelsSelectors.selectAll);
    const inputRef = useRef();
    const currentChannel = channels.find((channel) => channel.id === currentChannelId);

    useEffect(() => {
        inputRef.current.focus();
    }, [currentChannelId]);

    const getAuthHeader = () => {
        const token = JSON.parse(localStorage.getItem('token'));
        return token ? { Authorization: `Bearer ${token}` } : {}
    };

    const formik = useFormik({
        initialValues: { body: '', channelId: currentChannelId, username },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await axios.post(routes.messagesPath(), values, { headers: getAuthHeader() });
                dispatch(addMessage(res.data))
                formik.setSubmitting(true);
                formik.resetForm();
            } catch (err) {
                formik.setSubmitting(false);
                // if (err.isAxiosError && err.response.status === 401) {
                //     inputRef.current.select();
                //     return;
                // }
                throw err;
            }
        },
    });

    const renderMessages = () => (
        messages.length > 0 && messages
            .filter((message) => message.channelId === currentChannelId)
            .map((message) => (
                <div key={message.id} className="text-break mb-2"><b>{message.username}</b>: {message.body}</div>
            ))
    );

    return (
        <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0"><b># {currentChannel?.name || null}</b></p>
                <span className="text-muted">{renderMessages().length} сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                {renderMessages()}
            </div>
            <div className="mt-auto px-5 py-3">
                <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                    <Form.Group className="input-group has-validation">
                        <Form.Control
                            name="body"
                            aria-label="Новое сообщение"
                            placeholder="Введите сообщение..."
                            className="border-0 p-0 ps-2 form-control"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            ref={inputRef}
                        />
                        <Button variant="group-vertical" type="submit" disabled={!formik.dirty}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                                <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path></svg>
                            <span className="visually-hidden">Отправить</span>
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default MessageBox;