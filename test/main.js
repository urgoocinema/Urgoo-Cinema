import getRandomColor from './colors.js';
import changeBackground from './dom.js';

document.getElementById('color-btn').addEventListener('click', () => {
    const color = getRandomColor();
    changeBackground(color);
});
// This code adds an event listener to a button with the ID 'color-btn'. When the button is clicked, it generates a random color using the getRandomColor function and changes the background color of the document body to that color using the changeBackground function. The current color is also displayed in a span with the ID 'currColor'.  