import { getElementValue } from "../utils/utils.js";

export default class Login {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.initEventListeners();
    }

    initEventListeners() {
        this.handleFormSubmitEventListener();
    }

    handleFormSubmitEventListener() {
        this.form.addEventListener('submit', (event) => {
            const username = getElementValue('username');
            const password = getElementValue('password');
            this.logInUser(event, username, password);
        })
    }

    async logInUser(e, username, password) {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            const data = await response.json();

            this.validateUser(data);
        } catch (error) {
            document.getElementById('message').textContent = 'An error occurred. Please try again.';
        }
    }

    validateUser(data) {
        data.success
            ? window.location.href = data.redirect
            : document.getElementById('message').textContent = data.message

    }
}
