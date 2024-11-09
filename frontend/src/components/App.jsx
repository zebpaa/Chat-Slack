import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Container, Button } from "react-bootstrap";
import LoginPage from "./LoginPage";
import NotFoundPage from "./NotFoundPage";
import SignUpPage from "./SignUpPage";
import AuthContext from '../contexts/AuthContext';
import useAuth from '../hooks/index.jsx';
import HomePage from './HomePage.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../services/authSlice.js';
import { addChannel, removeChannel, updateChannel } from '../services/channelsSlice.js'
import { addMessage } from '../services/messagesSlice.js'
import { setCurrentChannel } from '../services/uiSlice.js';
import socket from '../socket.js';
import resources from '../locales/index.js';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import filter from 'leo-profanity';
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: 'testenv',
};

filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('ru'));

const AuthProvider = ({ children }) => {
    const hasToken = !!localStorage.getItem('token');
    const [loggedIn, setLoggedIn] = useState(hasToken);
    const dispatch = useDispatch();

    const logIn = () => setLoggedIn(true);
    const logOut = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logoutUser());
        setLoggedIn(false);
    };

    useEffect(() => {
        const user = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        user && token ? logIn() : logOut();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
            <Provider config={rollbarConfig}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </Provider>
        </AuthContext.Provider>
    );
};

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();

    return (
        auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
    );
}

const AuthButton = () => {
    const auth = useAuth();
    const { t } = useTranslation();
    return (
        auth.loggedIn && <Button onClick={auth.logOut}>{t('navbar.logOutButton')}</Button>
    );
};

const App = () => {
    i18next
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'ru',
            interpolation: {
                escapeValue: false,
            },
        });

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const defaultChannelId = useSelector((state) => state.ui.defaultChannelId);

    useEffect(() => {
        socket.on('newMessage', (payload) => {
            dispatch(addMessage(payload));
        });
        socket.on('newChannel', (payload) => {
            dispatch(addChannel(payload));
        });
        socket.on('removeChannel', (payload) => {
            console.log(payload.id); // { id: 6 };
            console.log('defaultChannelId: ', defaultChannelId)
            dispatch(setCurrentChannel(defaultChannelId)); // показывается пустой канал, если удалить в другом браузере 
            dispatch(removeChannel(payload.id));

        });
        socket.on('renameChannel', (payload) => {
            dispatch(updateChannel({ changes: { name: payload.name }, id: payload.id }))
        });

        return () => {
            socket.off('newMessage');
            socket.off('newChannel');
            socket.off('removeChannel');
            socket.off('renameChannel');
        };
    }, [socket]);

    return (
        <AuthProvider>
            <div className="d-flex flex-column h-100">
                <Router>
                    <Navbar expand="lg" className="shadow-sm bg-white">
                        <Container>
                            <Navbar.Brand href="/">{t('navbar.homeLink')}</Navbar.Brand>
                            <AuthButton />
                        </Container>
                    </Navbar>

                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route
                            path="/"
                            element={(
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>
                            )}
                        />
                    </Routes>
                </Router>
            </div>
            <ToastContainer closeOnClick />
        </AuthProvider>
    );
}

export default App;