// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyCxAcyX1iStBG-AWiW0VD9DJD7bGb3jAJ8",
    authDomain: "spoilerhub-bff5e.firebaseapp.com",
    projectId: "spoilerhub-bff5e",
    storageBucket: "spoilerhub-bff5e.appspot.com",
    messagingSenderId: "782186873976",
    appId: "1:782186873976:web:2353c5bc832862cce3998d",
    measurementId: "G-SXG115FWY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// TMDB API key
const tmdbApiKey = 'ce57cffb12c8c26d717f0a68d8e8bee1';

// Function to fetch personalized trailers
function fetchPersonalizedTrailers() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayTrailers(data.results);
        })
        .catch(error => console.error('Error fetching trailers:', error));
}

// Function to display trailers
function displayTrailers(movies) {
    const moviesContainer = document.querySelector('.movies');
    moviesContainer.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <button onclick="playTrailer('${movie.id}')">Watch Trailer</button>
        `;
        moviesContainer.appendChild(movieDiv);
    });
}

// Function to play the trailer
function playTrailer(movieId) {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=en-US`;

    fetch(trailerUrl)
        .then(response => response.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === 'Trailer');
            if (trailer) {
                document.getElementById('trailer-video').src = `https://www.youtube.com/embed/${trailer.key}`;
                document.getElementById('trailer-player').style.display = 'block';
            } else {
                alert('No trailer found for this movie.');
            }
        })
        .catch(error => console.error('Error fetching trailer:', error));
}

// Sign In functionality
document.getElementById('sign-in-button').addEventListener('click', () => {
    document.getElementById('login-section').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('sign-out-button').style.display = 'block';
            document.getElementById('sign-in-button').style.display = 'none';
            fetchPersonalizedTrailers(); // Fetch trailers after sign-in
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            alert('Sign-in failed: ' + error.message);
        });
});

// Sign Out functionality
document.getElementById('sign-out-button').addEventListener('click', () => {
    signOut(auth).then(() => {
        document.getElementById('sign-out-button').style.display = 'none';
        document.getElementById('sign-in-button').style.display = 'block';
        alert('Successfully signed out!');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        fetchPersonalizedTrailers(); // Fetch trailers when the user is signed in
    } else {
        console.log('No user is signed in.');
        document.getElementById('sign-out-button').style.display = 'none';
        document.getElementById('sign-in-button').style.display = 'block';
    }
});
