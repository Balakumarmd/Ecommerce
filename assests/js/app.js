const firebaseConfig = {
    apiKey: "#############",
    authDomain: "###############",
    projectId: "#############",
    storageBucket: "###########",
    messagingSenderId: "#########",
    appId: "###############",
    measurementId: "##########"
  };
  
  
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function displayProductDetails() {
    const productListContainer = document.getElementById('productDetailsContainer');

    try {
        // Fetch all documents from the "product" collection
        const snapshot = await db.collection('product').get();

        // Iterate over each document in the collection
        snapshot.forEach(doc => {
            const productData = doc.data();

            // Ensure that all required properties are present
            if (productData && productData.name && productData.price && productData.imageUrl) {
                // Create HTML elements to display product details dynamically
                const productContainer = document.createElement('div');
                productContainer.className = 'col-lg-3 col-md-4 mb-4';
                productContainer.innerHTML = `
                    <a href="product_details.html?productId=${doc.id}">
                        <div class="product bg-white p-4 text-center shadow-md">
                            <img class="mah-150 product-image" src="${productData.imageUrl}" alt="${productData.productName}"><br>
                            <div class="d-inline-block">
                                <h4 class="fw-bolder fs-5 mt-4">${productData.name}</h4>
                                <span class="fw-bolder fs-4">₹${productData.price}</span>
                                <!--<span class="text-muted text-decoration-line-through">$105</span>--!>
                            </div><br>
                            <div class="d-inline-block mt-3">
                                <button class="btn btn-primary px-5">Buy Now</button>
                            </div>
                        </div>
                    </a>
                `;

                productListContainer.appendChild(productContainer);
            } else {
                console.log(`Product data for document ${doc.id} is incomplete.`);
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Call the function to display all product details from the "product" collection
displayProductDetails();
