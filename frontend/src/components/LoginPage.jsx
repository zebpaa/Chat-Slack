import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Row, Col, Card,
    Form, Button, FloatingLabel, Image,
} from 'react-bootstrap';


const LoginPage = () => {
    const [authFailed, setAuthFailed] = useState(false);
    const inputRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: (values) => {
            setAuthFailed(false);

            axios.post(routes.loginPath(), values)
                .then((data) => {
                    console.log('data: ', data);
                    localStorage.setItem('userId', JSON.stringify(data));
                    const { from } = location.state;
                    navigate(from);
                })
                .catch((error) => {
                    formik.setSubmitting(false);
                    setAuthFailed(true);
                    console.log('error: ', error);
                })

        }
    });

    return (
        <Container fluid className="h-100">
            <Row className="justify-content-center align-content-center h-100">
                <Col xs={12} md={8} xxl={6}>
                    <Card className="shadow-sm">
                        <Card.Body className="row p-5">
                            <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                                <Image src="/images/login-avatar.jpeg" alt="Войти" roundedCircle />
                            </Col>
                            <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={formik.handleSubmit}>
                                <h1 className="text-center mb-4">Войти</h1>
                                <FloatingLabel
                                    controlId="username"
                                    label="Ваш ник"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        onChange={formik.handleChange}
                                        values={formik.values.username}
                                        placeholder="Ваш ник"
                                        ref={inputRef}
                                        name="username"
                                        autoComplete="username"
                                        required
                                        isInvalid={authFailed}
                                    />
                                </FloatingLabel>

                                <FloatingLabel
                                    controlId="password"
                                    label="Пароль"
                                    className="mb-4"
                                >
                                    <Form.Control
                                        onChange={formik.handleChange}
                                        values={formik.values.password}
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        autoComplete="current-password"
                                        required
                                        isInvalid={authFailed}
                                    />
                                </FloatingLabel>

                                <Form.Control.Feedback type="invalid">Неверные имя пользователя или пароль</Form.Control.Feedback>

                                <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                                    Войти
                                </Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="p-4">
                            <div className="text-center">
                                <span>Нет аккаунта?</span> <Link to="/signup">Регистрация</Link>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;