// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyDLHCpqwj39NzUP-rAOUNerj3em2bdepLw",
    authDomain: "spoilerhub-32c29.firebaseapp.com",
    databaseURL: "https://spoilerhub-32c29-default-rtdb.firebaseio.com",
    projectId: "spoilerhub-32c29",
    storageBucket: "spoilerhub-32c29.firebasestorage.app",
    messagingSenderId: "420414738753",
    appId: "1:420414738753:web:9fec2404469e833e1fd1c0",
    measurementId: "G-EZX36DE3LE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// TMDB API key
const tmdbApiKey = 'ca7226233e23be7a82f302d0a86d02ad';

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
