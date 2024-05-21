const firebaseConfig = {
  apiKey: "###################",
  authDomain: "###############",
  projectId: "##############",
  storageBucket: "###############",
  messagingSenderId: "#############",
  appId: "##############",
  measurementId: "#########"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Define variables globally
const productImage = document.getElementById('productImage');
const productNameElement = document.getElementById('productName');
const productDescriptionElement = document.getElementById('productDescription');
const productPriceElement = document.getElementById('productPrice');

async function displayProductDetails(productId) {
  try {
    // Retrieve the product document from Firestore
    const productDoc = await db.collection('product').doc(productId).get();
    if (productDoc.exists) {
      const productData = productDoc.data();
      console.log('Retrieved product data:', productData); // Log the retrieved product data
      // Check if description exists and display it
      if (productData && productData.des) { // Ensure productData is defined before accessing its properties
        console.log('Product Description:', productData.des); // Log the product description
        productDescriptionElement.textContent = productData.des;
      } else {
        productDescriptionElement.textContent = "No description available";
      }
      // Populate other product details
      productImage.src = productData.imageUrl;
      productNameElement.textContent = productData.name;
      productPriceElement.textContent = `₹${productData.price.toFixed(2)}`;

     
    } else {
      console.error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
}



// Call the function to display the product details
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
displayProductDetails(productId);

// Function to get the download URL of an image from Firebase Storage
async function getImageUrlFromFirebaseStorage(imageSrc) {
  try {
      // Get the reference to the image in Firebase Storage
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child('images/' + imageSrc);
      
      // Get the download URL of the image
      const imageUrl = await imageRef.getDownloadURL();
      return imageUrl;
  } catch (error) {
      console.error('Error getting image URL from Firebase Storage:', error);
      return null;
  }
}


// Function to open WhatsApp with pre-filled message including product details and image
async function openWhatsApp() {
  // Get the product details
  const productName = document.getElementById('productName').textContent;
  const productPrice = document.getElementById('productPrice').textContent;
  const productDescription = document.getElementById('productDescription').textContent;
  const productImageSrc = document.getElementById('productImage').src;


  // Construct the WhatsApp message content with an image link
  const message = `I Need this Product:\nProduct Name: ${productName}\nPrice: ${productPrice}\nProduct Description: ${productDescription} \n Image url: ${productImageSrc}`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp message URL with default number
  const defaultNumber = '###########'; // Change this to your default number
  const whatsappURL = `https://api.whatsapp.com/send?phone=${defaultNumber}&text=${encodedMessage}`;

  // Open WhatsApp with the pre-filled message and default number
  window.open(whatsappURL);
}
