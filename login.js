const firebaseConfig = {
  apiKey: "######################",
  authDomain: "####################",
  projectId: "#####################",
  storageBucket: "#######################",
  messagingSenderId: "####################",
  appId: "########################",
  measurementId: "###########"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();


// Function to handle user sign-up
function handleSignUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User signed up successfully
      const user = userCredential.user;
      console.log(`User signed up: ${user.email}`);

    })
    .catch((error) => {
      // Handle sign-up errors
      console.error(error.message);
    });
}


// Function to handle user sign-in
function handleSignIn() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  firebase.auth().signInWithEmailAndPassword(email, password, { remember: 'local' }) // Enable persistent authentication
  .then((userCredential) => {
      // User signed in successfully
      const user = userCredential.user;
      redirectToDashboard(user);
    // Check user role and redirect accordingly
    if (user) {
      // User is signed in
      if (user.email === 'rsrocare@gmail.com' || user.email === 'admin@gmail.com') {
        // Admin user
        alert('Login successful as admin!');
        // Redirect to admin dashboard
        window.location.href = 'upload.html';
      } else {
        // Regular user
        alert('Login successful!');
        // Redirect to the home page
        window.location.href = 'index.html';
      }
    } else {
      // No user signed in
      alert('Login failed. Please check your credentials.');
    }
    })
    .catch((error) => {
      // Handle sign-in errors
      console.error(error.message);
    });
}
function redirectToDashboard(user) {
  if (user) {
    if (user.email === 'balakumarmd93@gmail.com' || user.email === 'admin@gmail.com') {
      // Admin user
      alert('Login successful as admin!');
      window.location.href = 'upload.html';
    } else {
      // Regular user
      alert('Login successful!');
      window.location.href = 'index.html';
    }
  } else {
    // No user signed in
    alert('Login failed. Please check your credentials.');
  }
}

// Check user authentication state on page load
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, redirect to appropriate page
    redirectToDashboard(user);
  } else {
    // No user is signed in
    // Implement logic if needed
  }
});

// Event listeners for the sign-up and sign-in buttons
document.getElementById('signup-button').addEventListener('click', handleSignUp);
document.getElementById('signin-button').addEventListener('click', handleSignIn);