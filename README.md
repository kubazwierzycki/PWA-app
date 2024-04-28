# CoGame

The project goal is to design and implement a Progressive Web Application (PWA) for board game enthusiasts. 
The app will store users’ games and allow them to create their own game ranking. 
The primary goal is to support live gameplay by selecting parameters and timing based on game conditions. 
The product's purpose is to make board game enjoyment more accessible for all users. <p>
The application will also be integrated with the BGG API to collect various data such as users' 
gameplay history and available board games. <p>

## Project structure

The application consists of the fronted app and the backend services. <p>

- <b>Frontend:</b>
  - `/client-pwa/` - web application which is used as GUI for the application


- <b>Backend:</b>
  - `/pwa-experience/` - manages user data related to a specific board game
  - `/pwa-gameplays/` - stores the gameplay history of registered users
  - `/pwa-games/` - manages data related to board games
  - `/pwa-gateway/` - gateway for backend services
  - `/pwa-playrooms/` - is responsible for the functionality of the playroom
  - `/pwa-users/` - stores data of registered users

## Authors

The application is developed by:
- Jakub Bednarz
- Kacper Włodarski
- Jakub Zwierzycki

## Project info

The project is developed for the needs of the engineering thesis at Gdansk University of Technology. <p>
© WETI PG
