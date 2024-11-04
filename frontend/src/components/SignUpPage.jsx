import {
    Container, Card, Row, Col, Image,
    Form, Button
} from "react-bootstrap";
import axios from "axios";
import { useFormik } from "formik";
import routes from "../routes";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from '../services/authSlice.js';

const SignUpPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useAuth();
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await axios.post(routes.signupPath(), values)
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('username', JSON.stringify(response.data.username));
                dispatch(loginUser(response.data))
                auth.logIn();
                navigate('/');
            } catch (err) {
                formik.setSubmitting(false);

                if (err.isAxiosError && err.response.status === 409) {
                    console.log('Такой пользователь уже существует');
                }

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
                        <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                            <div>
                                <Image alt="Регистрация" src="/images/signup-avatar.jpg" roundedCircle />
                            </div>
                            <Form className="w-50" onSubmit={formik.handleSubmit}>
                                <h1 className="text-center mb-4">Регистрация</h1>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        type="username"
                                        id="username"
                                        onChange={formik.handleChange}
                                        name="username"
                                        autoComplete="username"
                                        value={formik.values.username}
                                        placeholder="От 3 до 20 символов"
                                        ref={inputRef}
                                        required
                                    // isInvalid={authFailed}
                                    />
                                    <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                                    <Form.Control.Feedback type="invalid">Обязательное поле</Form.Control.Feedback>
                                </Form.Floating>

                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        id="password"
                                        type="password"
                                        placeholder="Не менее 6 символов"
                                        name="password"
                                        autoComplete="new-password"
                                        aria-describedby="passwordHelpBlock"
                                        aria-autocomplete="list"
                                        required
                                    // isInvalid={authFailed}
                                    />
                                    <Form.Label htmlFor="password">Пароль</Form.Label>
                                    <Form.Control.Feedback type="invalid">Не менее 6 символов</Form.Control.Feedback>
                                </Form.Floating>

                                <Form.Floating className="mb-4">
                                    <Form.Control
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Пароли должны совпадать"
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        required
                                    // isInvalid={authFailed}
                                    />
                                    <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
                                    <Form.Control.Feedback type="invalid">Пароли должны совпадать</Form.Control.Feedback>
                                </Form.Floating>

                                <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                                    Зарегистрироваться
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpPage;