import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectors as channelsSelectors } from '../services/channelsSlice.js'

const MessageBox = ({ messages, currentChannelId }) => {
    const channels = useSelector(channelsSelectors.selectAll);
    const inputRef = useRef();
    const currentChannel = channels.find((channel) => channel.id === currentChannelId);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            inputValue: ''
        }, onSubmit: (values) => {

        },
    });

    const renderMessages = () => {
        if (messages.length === 0) {
            return null;
        }
        console.log('messages: ', messages);
        return (
            messages.map((message) => (
                <div key={message.id} class="text-break mb-2"><b>{message.name}</b>: {message.text}</div>
            ))
        );
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0"><b># {currentChannel?.name || null}</b></p>
                <span className="text-muted">0 сообщений</span>
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
                            value={formik.values.inputValue}
                            onChange={formik.handleChange}
                            ref={inputRef}
                        />
                        <Button variant="group-vertical" type="submit" disabled>
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