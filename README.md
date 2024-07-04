# Backend Application README

Welcome to the backend application for the NDN Group's project. This README file will provide you with all the necessary information to get started.

## Installation

1. Clone the repository: `git clone https://github.com/ndngroup/todo-express.git`
2. Navigate to the project directory: `cd todo-express`
3. Install dependencies: `npm install`

## Configuration

1. Create a `.env` file in the root directory.
2. Add the following environment variables:
  - `PORT`: The port number on which the server will run.
  - `DB_URL`: The URL of your MongoDB database.
  - `JWT_SECRET`: A secret key for JSON Web Token (JWT) encryption.

## Usage

To start the server, run the following command: `npm start`

## API Documentation

For detailed information about the API endpoints and how to use them, please refer to the [API documentation](/docs/api.md).

## Contributing

If you would like to contribute to this project, please follow the guidelines outlined in [CONTRIBUTING.md](/docs/CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
