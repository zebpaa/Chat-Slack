import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { useNavigate } from 'react-router-dom';
import {
    Container, Row, Col, Card,
    Form, Button, Image,
} from 'react-bootstrap';
import useAuth from '../hooks/index.jsx';
import { loginUser } from '../services/authSlice.js';
import { useDispatch } from 'react-redux';


const LoginPage = () => {
    const auth = useAuth();
    const [authFailed, setAuthFailed] = useState(false);
    const inputRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            setAuthFailed(false);

            try {
                const res = await axios.post(routes.loginPath(), values);
                localStorage.setItem('token', JSON.stringify(res.data.token));
                localStorage.setItem('username', JSON.stringify(res.data.username));
                dispatch(loginUser(res.data))
                auth.logIn();
                navigate('/');
            } catch (err) {
                formik.setSubmitting(false);
                if (err.isAxiosError && err.response.status === 401) {
                    setAuthFailed(true);
                    inputRef.current.select();
                    return;
                }
                throw err;
            }
        },
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
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        type="username"
                                        id="username"
                                        onChange={formik.handleChange}
                                        values={formik.values.username}
                                        placeholder="Ваш ник"
                                        ref={inputRef}
                                        name="username"
                                        autoComplete="username"
                                        required
                                        isInvalid={authFailed}
                                    />
                                    <Form.Label htmlFor="username">Ваш ник</Form.Label>
                                </Form.Floating>

                                <Form.Floating className="mb-4">
                                    <Form.Control
                                        onChange={formik.handleChange}
                                        values={formik.values.password}
                                        id="password"
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        autoComplete="current-password"
                                        required
                                        isInvalid={authFailed}
                                    />
                                    <Form.Label htmlFor="password" className="mb-4">Пароль</Form.Label>
                                    <Form.Control.Feedback type="invalid">Неверные имя пользователя или пароль</Form.Control.Feedback>
                                </Form.Floating>
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