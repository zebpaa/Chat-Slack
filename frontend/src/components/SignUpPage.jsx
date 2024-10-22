import {
    Container, Card, Row, Col, Image,
    Form, FloatingLabel, Button
} from "react-bootstrap";

const SignUpPage = () => {
    return (
        <Container fluid className="h-100">
            <Row className="justify-content-center align-content-center h-100">
                <Col xs={12} md={8} xxl={6}>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                            <div>
                                <Image alt="Регистрация" src="src/assets/signup-avatar.jpg" roundedCircle />
                            </div>
                            <Form className="w-50">
                                <h1 className="text-center mb-4">Регистрация</h1>
                                <FloatingLabel
                                    controlId="username"
                                    label="Имя пользователя"
                                    className="mb-3"
                                >
                                    <Form.Control placeholder="От 3 до 20 символов" name="username" autoComplete="username" required />
                                </FloatingLabel>
                                {/* Переделать, как в макете, сделать всплывающие подсказки */}

                                <FloatingLabel
                                    controlId="password"
                                    label="Пароль"
                                    className="mb-3"
                                >
                                    <Form.Control type="password" placeholder="Не менее 6 символов" name="password" autoComplete="new-password" aria-describedby="passwordHelpBlock" aria-autocomplete="list" required />
                                </FloatingLabel>

                                <FloatingLabel
                                    controlId="confirmPassword"
                                    label="Подтвердите пароль"
                                    className="mb-4"
                                >
                                    <Form.Control type="password" placeholder="Пароли должны совпадать" name="confirmPassword" required autoComplete="new-password" />
                                </FloatingLabel>

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