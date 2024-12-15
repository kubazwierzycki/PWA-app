import {ReactNode} from "react";
import ReactMarkdown from 'react-markdown';


/**
 * Info about site page
 * @returns {ReactNode}
 */
const About = (): ReactNode => {


    const markdown = '# CoGame\n' +
        '\n' +
        'The project goal is to design and implement a Progressive Web Application (PWA) for board game enthusiasts. \n' +
        'The app will store users’ games and allow them to create their own game ranking. \n' +
        'The primary goal is to support live gameplay by selecting parameters and timing based on game conditions. \n' +
        'The product\'s purpose is to make board game enjoyment more accessible for all users. \n' +
        'The application will also be integrated with the BGG API to collect various data such as users\' \n' +
        'gameplay history and available board games. \n' +
        '\n' +
        '## Project structure\n' +
        '\n' +
        'The application consists of the fronted app and the backend services. \n' +
        '\n' +
        '- Frontend:\n' +
        '  - `/client-pwa/` - web application which is used as GUI for the application\n' +
        '\n' +
        '\n' +
        '- Backend:\n' +
        '  - `/pwa-experience/` - manages user data related to a specific board game\n' +
        '  - `/pwa-gameplays/` - stores the gameplay history of registered users\n' +
        '  - `/pwa-games/` - manages data related to board games\n' +
        '  - `/pwa-gateway/` - gateway for backend services\n' +
        '  - `/pwa-playrooms/` - is responsible for the functionality of the playroom\n' +
        '  - `/pwa-users/` - stores data of registered users\n' +
        '\n' +
        '## Authors\n' +
        '\n' +
        'The application is developed by:\n' +
        '- Jakub Bednarz\n' +
        '- Kacper Włodarski\n' +
        '- Jakub Zwierzycki\n' +
        '\n' +
        '## Project info\n' +
        '\n' +
        'The project is developed for the needs of the engineering thesis at Gdansk University of Technology. \n' +
        '© WETI PG';

    return (
        <div className="About" style={{paddingLeft:"15%", paddingRight:"15%"}}>
            <ReactMarkdown
                children={markdown}
            />
        </div>
    );
}

export default About;
