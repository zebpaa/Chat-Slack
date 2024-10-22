import {
    Container, Row, Col, Card,
    Form, Button, FloatingLabel, Image
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <Container fluid className="h-100">
            <Row className="justify-content-center align-content-center h-100">
                <Col xs={12} md={8} xxl={6}>
                    <Card className="shadow-sm">
                        <Card.Body className="row p-5">
                            <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                                <Image src="/images/login-avatar.jpeg" alt="Войти" roundedCircle />
                            </Col>
                            <Form className="col-12 col-md-6 mt-3 mt-md-0">
                                <h1 className="text-center mb-4">Войти</h1>
                                <FloatingLabel
                                    controlId="username"
                                    label="Ваш ник"
                                    className="mb-3"
                                >
                                    <Form.Control placeholder="Ваш ник" name="username" autoComplete="username" required />
                                </FloatingLabel>

                                <FloatingLabel
                                    controlId="password"
                                    label="Пароль"
                                    className="mb-4"
                                >
                                    <Form.Control type="password" placeholder="Пароль" name="password" autoComplete="current-password" required />
                                </FloatingLabel>

                                {/* Feedback bootstrap */}

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