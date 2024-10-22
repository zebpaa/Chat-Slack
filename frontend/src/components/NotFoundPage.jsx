import { Image } from "react-bootstrap";
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-center">
            <Image fluid className="h-25" alt="Страница не найдена" src="src/assets/not-found-avatar.svg" />
            <h1 className="h4 text-muted">Страница не найдена</h1>
            <p className="text-muted">Но вы можете перейти <Link to="/">на главную страницу</Link></p>
        </div>
    );
};

export default NotFoundPage;