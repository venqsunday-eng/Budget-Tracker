/* =========================
   BUDGET TRACKER
========================= */

/* =========================
   EXPENSES
========================= */

const budgetForm = document.getElementById("budgetForm");
const budgetTableBody = document.getElementById("budgetTableBody");
const totalAmount = document.getElementById("totalAmount");

let expenses = [];

try {
    expenses =
        JSON.parse(localStorage.getItem("budgetExpenses")) || [];
} catch (error) {
    console.error("Could not load expenses:", error);
    expenses = [];
}


/* =========================
   DISPLAY EXPENSES
========================= */

function displayExpenses() {

    if (!budgetTableBody) {
        return;
    }

    budgetTableBody.innerHTML = "";

    let total = 0;

    expenses.forEach(function(expense, index) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${expense.description}
            </td>

            <td>
                KSh ${Number(expense.amount).toLocaleString()}
            </td>

            <td>
                ${expense.category}
            </td>

            <td>
                ${expense.date}
            </td>

            <td>
                <button
                    class="delete-expense"
                    data-index="${index}"
                    type="button"
                >
                    🗑️ Delete
                </button>
            </td>

        `;

        budgetTableBody.appendChild(row);

        total += Number(expense.amount);
    });


    if (totalAmount) {

        totalAmount.textContent =
            total.toLocaleString();

    }
}


/* =========================
   ADD EXPENSE
========================= */

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const descriptionElement =
                document.getElementById("description");

            const amountElement =
                document.getElementById("amount");

            const categoryElement =
                document.getElementById("category");


            if (
                !descriptionElement ||
                !amountElement ||
                !categoryElement
            ) {

                alert(
                    "Expense form fields are missing."
                );

                return;
            }


            const description =
                descriptionElement.value.trim();

            const amount =
                amountElement.value.trim();

            const category =
                categoryElement.value;


            if (
                description === "" ||
                amount === "" ||
                category === ""
            ) {

                alert(
                    "Please fill in all expense details."
                );

                return;
            }


            const expense = {

                description: description,

                amount: amount,

                category: category,

                date: new Date()
                    .toLocaleDateString()

            };


            expenses.push(expense);


            try {

                localStorage.setItem(
                    "budgetExpenses",
                    JSON.stringify(expenses)
                );

            } catch (error) {

                expenses.pop();

                alert(
                    "Unable to save this expense."
                );

                console.error(error);

                return;
            }


            displayExpenses();

            budgetForm.reset();

        }
    );
}


/* =========================
   DELETE EXPENSE
========================= */

if (budgetTableBody) {

    budgetTableBody.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".delete-expense"
                );


            if (!button) {
                return;
            }


            const index =
                Number(button.dataset.index);


            const expense =
                expenses[index];


            if (!expense) {
                return;
            }


            const confirmDelete =
                confirm(
                    `Delete "${expense.description}"?`
                );


            if (!confirmDelete) {
                return;
            }


            expenses.splice(index, 1);


            localStorage.setItem(
                "budgetExpenses",
                JSON.stringify(expenses)
            );


            displayExpenses();

        }
    );
}


/* =========================
   LOAD EXPENSES
========================= */

displayExpenses();


/* =========================
   MARKET
========================= */

const addProductButton =
    document.getElementById("addProductButton");

const productsContainer =
    document.getElementById("productsContainer");

const productImage =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

const imageText =
    document.getElementById("imageText");


let selectedImage = "";

let products = [];

try {

    products =
        JSON.parse(
            localStorage.getItem("marketProducts")
        ) || [];

} catch (error) {

    console.error(
        "Could not load market products:",
        error
    );

    products = [];
}


/* =========================
   IMAGE PREVIEW
========================= */

if (productImage) {

    productImage.addEventListener(
        "change",
        function() {

            const file =
                this.files && this.files[0];


            if (!file) {

                selectedImage = "";

                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please choose a valid image file such as PNG, JPG or JPEG."
                );

                this.value = "";

                selectedImage = "";

                return;
            }


            if (file.size > 15 * 1024 * 1024) {

                alert(
                    "This image is too large. Please choose an image below 15MB."
                );

                this.value = "";

                selectedImage = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const img =
                        new Image();


                    img.onload =
                        function() {

                            const maxSize = 1000;

                            let width =
                                img.width;

                            let height =
                                img.height;


                            if (width > maxSize) {

                                height =
                                    height *
                                    (maxSize / width);

                                width =
                                    maxSize;
                            }


                            if (height > maxSize) {

                                width =
                                    width *
                                    (maxSize / height);

                                height =
                                    maxSize;
                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                Math.max(
                                    1,
                                    Math.round(width)
                                );


                            canvas.height =
                                Math.max(
                                    1,
                                    Math.round(height)
                                );


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!ctx) {

                                alert(
                                    "Unable to process this image."
                                );

                                selectedImage = "";

                                return;
                            }


                            ctx.drawImage(
                                img,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            try {

                                selectedImage =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        0.70
                                    );

                            } catch (error) {

                                console.error(
                                    "Image compression error:",
                                    error
                                );

                                alert(
                                    "There was a problem processing the image."
                                );

                                selectedImage = "";

                                return;
                            }


                            if (imagePreview) {

                                imagePreview.src =
                                    selectedImage;

                                imagePreview.style.display =
                                    "block";

                                imagePreview.style.maxWidth =
                                    "200px";

                                imagePreview.style.maxHeight =
                                    "200px";

                                imagePreview.style.width =
                                    "auto";

                                imagePreview.style.height =
                                    "auto";
                            }


                            if (imageText) {

                                imageText.style.display =
                                    "none";
                            }

                        };


                    img.onerror =
                        function() {

                            alert(
                                "The image could not be loaded. Please choose another image."
                            );

                            selectedImage = "";

                            if (imagePreview) {

                                imagePreview.src = "";

                                imagePreview.style.display =
                                    "none";
                            }


                            if (imageText) {

                                imageText.style.display =
                                    "block";
                            }

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function() {

                    alert(
                        "There was a problem reading the image."
                    );

                    selectedImage = "";

                    productImage.value = "";

                };


            reader.readAsDataURL(file);

        }
    );
}


/* =========================
   DISPLAY MARKET PRODUCTS
========================= */

function displayProducts() {

    if (!productsContainer) {
        return;
    }


    const oldRows =
        productsContainer.querySelectorAll(
            ".saved-product"
        );


    oldRows.forEach(function(row) {

        row.remove();

    });


    products.forEach(function(product, index) {

        const row =
            document.createElement("tr");


        row.className =
            "saved-product";


        row.innerHTML = `

            <td>

                <img
                    src="${product.image}"
                    class="market-product-image"
                    alt="${product.name}"
                >

            </td>


            <td>
                ${product.name}
            </td>


            <td>
                KSh ${Number(
                    product.price
                ).toLocaleString()}
            </td>


            <td>
                ${product.payment}
            </td>


            <td>

                <button
                    class="delete-product"
                    data-index="${index}"
                    type="button"
                >
                    🗑️ Delete
                </button>

            </td>

        `;


        productsContainer.appendChild(row);

    });

}


/* =========================
   ADD PRODUCT
========================= */

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function() {

            const nameElement =
                document.getElementById("productName");

            const priceElement =
                document.getElementById("productPrice");

            const paymentElement =
                document.getElementById("paymentNumber");


            if (
                !nameElement ||
                !priceElement ||
                !paymentElement
            ) {

                alert(
                    "Product form fields are missing."
                );

                return;
            }


            const name =
                nameElement.value.trim();

            const price =
                priceElement.value.trim();

            const payment =
                paymentElement.value.trim();


            if (
                selectedImage === "" ||
                name === "" ||
                price === "" ||
                payment === ""
            ) {

                alert(
                    "Please add image, product name, price and payment number."
                );

                return;
            }


            const product = {

                image: selectedImage,

                name: name,

                price: price,

                payment: payment

            };


            products.push(product);


            try {

                localStorage.setItem(
                    "marketProducts",
                    JSON.stringify(products)
                );

            } catch (error) {

                products.pop();

                alert(
                    "Storage is full. Please remove old market products/images and try again."
                );

                console.error(
                    "localStorage error:",
                    error
                );

                return;
            }


            displayProducts();


            if (productImage) {

                productImage.value = "";

            }


            nameElement.value = "";

            priceElement.value = "";

            paymentElement.value = "";

            selectedImage = "";


            if (imagePreview) {

                imagePreview.src = "";

                imagePreview.style.display =
                    "none";

            }


            if (imageText) {

                imageText.style.display =
                    "block";

            }

        }
    );
}


/* =========================
   DELETE MARKET PRODUCT
========================= */

if (productsContainer) {

    productsContainer.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".delete-product"
                );


            if (!button) {
                return;
            }


            const index =
                Number(button.dataset.index);


            const product =
                products[index];


            if (!product) {
                return;
            }


            const confirmDelete =
                confirm(
                    `Delete "${product.name}"?`
                );


            if (!confirmDelete) {
                return;
            }


            products.splice(index, 1);


            localStorage.setItem(
                "marketProducts",
                JSON.stringify(products)
            );


            displayProducts();

            displayBusinessProducts();

            updateProductCount();

        }
    );
}


/* =========================
   LOAD MARKET PRODUCTS
========================= */

displayProducts();


/* =========================
   BUSINESS PAGE
========================= */

const productCount =
    document.getElementById("productCount");

const businessProducts =
    document.getElementById("businessProducts");

const businessExpenses =
    document.getElementById("businessExpenses");


/* =========================
   UPDATE PRODUCT COUNT
========================= */

function updateProductCount() {

    if (productCount) {

        productCount.textContent =
            products.length;

    }

}


/* =========================
   DISPLAY BUSINESS PRODUCTS
========================= */

function displayBusinessProducts() {

    if (!businessProducts) {
        return;
    }


    businessProducts.innerHTML = "";


    products.forEach(function(product, index) {

        const card =
            document.createElement("div");


        card.className =
            "business-product";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h4>
                ${product.name}
            </h4>

            <p>
                KSh ${Number(
                    product.price
                ).toLocaleString()}
            </p>

            <p>
                📱 ${product.payment}
            </p>

            <button
                class="delete-business-product"
                data-index="${index}"
                type="button"
            >
                🗑️ Delete
            </button>

        `;


        businessProducts.appendChild(card);

    });

}


/* =========================
   DELETE BUSINESS PRODUCT
========================= */

if (businessProducts) {

    businessProducts.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".delete-business-product"
                );


            if (!button) {
                return;
            }


            const index =
                Number(button.dataset.index);


            const product =
                products[index];


            if (!product) {
                return;
            }


            const confirmDelete =
                confirm(
                    `Delete "${product.name}"?`
                );


            if (!confirmDelete) {
                return;
            }


            products.splice(index, 1);


            localStorage.setItem(
                "marketProducts",
                JSON.stringify(products)
            );


            displayBusinessProducts();

            displayProducts();

            updateProductCount();

        }
    );
}


/* =========================
   BUSINESS EXPENSES
========================= */

if (businessExpenses) {

    let totalBusinessExpenses = 0;


    expenses.forEach(function(expense) {

        totalBusinessExpenses +=
            Number(expense.amount);

    });


    businessExpenses.textContent =
        totalBusinessExpenses.toLocaleString();

}


/* =========================
   LOAD BUSINESS PAGE
========================= */

displayBusinessProducts();

updateProductCount();