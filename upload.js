const firebaseConfig = {
    apiKey: "###################",
    authDomain: "#############",
    projectId: "#############",
    storageBucket: "#############",
    messagingSenderId: "#############",
    appId: "###########",
    measurementId: "##########"
  };
  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Function to get the next document name with the specified prefix
async function getNextDocumentName(itemType) {
    const prefix = itemType === 'spare' ? 'spare' : 'product';
    const snapshot = await db.collection(prefix).orderBy('id', 'desc').limit(1).get();
    if (snapshot.empty) {
        return `${prefix}_1`;
    } else {
        const lastDocumentName = snapshot.docs[0].id;
        const lastDocumentNumber = parseInt(lastDocumentName.split('_')[1]);
        const nextDocumentNumber = lastDocumentNumber + 1;
        return `${prefix}_${nextDocumentNumber}`;
    }
}

// Function to check if a document with the given name exists in the collection
async function documentExists(itemType, documentName) {
    const docRef = db.collection(itemType).doc(documentName);
    const doc = await docRef.get();
    return doc.exists;
}

// Form submit event listener
document.getElementById('inventoryForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const itemName = document.getElementById('itemName').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const itemType = document.getElementById('itemType').value;
    const itemDes = document.getElementById('itemDes').value;
    const itemImage = document.getElementById('itemImage').files[0]; // Get the uploaded image file

    // Get the next document name based on the item type
    let nextDocumentName = await getNextDocumentName(itemType);

    // Check if the document with the generated name already exists
    let counter = 1;
    while (await documentExists(itemType, nextDocumentName)) {
        counter++;
        nextDocumentName = `${itemType}_${counter}`;
    }

    // Upload image to Firebase Storage
    const storageRef = firebase.storage().ref(`images/${nextDocumentName}`);
    const uploadTask = storageRef.put(itemImage);

    // Handle successful image upload
    uploadTask.then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
            // Add item details to Firestore
            db.collection(itemType).doc(nextDocumentName).set({
                name: itemName,
                price: itemPrice,
                des : itemDes,
                imageUrl: downloadURL // Store image URL in Firestore
            })
            .then(function() {
                console.log("Document written with ID: ", nextDocumentName);
                // Reset form
                document.getElementById('inventoryForm').reset();
                alert('Product added');
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        });
    });
});
