const jokeSetup = document.getElementById('joke-setup');
const jokeDelivery = document.getElementById('joke-delivery');
const newJokeButton = document.getElementById('new-joke-button');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const jokeContent = document.getElementById('joke-content');

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Any?safe-mode';

function toggleVisibility(element, show) {
    if (show) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

async function fetchJoke() {
    jokeSetup.textContent = '';
    jokeDelivery.textContent = '';
    toggleVisibility(errorMessage, false);
    jokeContent.classList.remove('fade-in');

    toggleVisibility(loadingIndicator, true);
    newJokeButton.disabled = true;
    newJokeButton.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const response = await fetch(JOKE_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.message || 'Error fetching joke from API.');

        if (data.type === 'twopart') {
            jokeSetup.textContent = data.setup;
            jokeDelivery.textContent = data.delivery;
        } else {
            jokeSetup.textContent = data.joke;
            jokeDelivery.textContent = '';
        }

        jokeContent.classList.add('fade-in');

    } catch (error) {
        console.error('Error fetching joke:', error);
        toggleVisibility(errorMessage, true);
        errorMessage.textContent = 'Failed to load a joke. Please try again!';
        jokeSetup.textContent = '😅';
        jokeDelivery.textContent = 'No jokes available right now.';
    } finally {
        toggleVisibility(loadingIndicator, false);
        newJokeButton.disabled = false;
        newJokeButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

newJokeButton.addEventListener('click', fetchJoke);
document.addEventListener('DOMContentLoaded', fetchJoke);
