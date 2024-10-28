import axios from 'axios';
import { useEffect, useState } from 'react';

import routes from '../routes.js';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }

    return {};
};

const HomePage = () => {
    const [content, setContent] = useState('');
    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await axios.get(routes.channelsPath(), { headers: getAuthHeader() });
            setContent(data);
        };

        fetchContent();
    }, []);

    return content && <p>{content}</p>;
};

export default HomePage;