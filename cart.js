// ============================================================
// Simple closeout cart using localStorage
// ============================================================

const CART_KEY = "closeoutCart";

/** Single place to control the Google Form URL */
const ORDER_FORM_URL = "https://forms.gle/vccFdaietcoSHRUH8";  // paste your responder link here


// ------------------------------------------------------------
// Load cart from localStorage
// ------------------------------------------------------------
function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Error loading cart", e);
        return [];
    }
}

// ------------------------------------------------------------
// Save cart to localStorage and update the cart count badge
// ------------------------------------------------------------
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount(cart);
}

// ------------------------------------------------------------
// Update all elements that display the total number of cases
// ------------------------------------------------------------
function updateCartCount(cart) {
    const totalCases = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll("#cart-count");

    countElements.forEach(span => {
        span.textContent = totalCases;
    });
}


// ============================================================
// Add to cart behaviour on catalog pages
// ============================================================
//
// Buttons must have class "add-to-cart-button" and data attributes:
// data-sku, data-name, data-cases-per-case, and price fields
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart-button[data-sku]");
    if (!buttons.length) {
        return; // not on a catalog page with add buttons
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            let cart = loadCart();
            const sku = btn.dataset.sku;
            const existing = cart.find(item => item.sku === sku);

            // Support both types of attributes:
            // data-price-10  OR  data-price10
            const priceNormal =
                parseFloat(btn.dataset.priceNormal || "0") || 0;

            const price10 =
                parseFloat(btn.dataset.price10 ||
                           btn.dataset["price-10"] || "0") || 0;

            const price50 =
                parseFloat(btn.dataset.price50 ||
                           btn.dataset["price-50"] || "0") || 0;

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    sku: sku,
                    name: btn.dataset.name || "",
                    casesPerCase: parseInt(btn.dataset.casesPerCase || "0", 10) || 0,
                    priceNormal: priceNormal,
                    price10: price10,
                    price50: price50,
                    quantity: 1
                });
            }

            saveCart(cart);
            alert("Added to cart.");
        });
    });
}

// ============================================================
// Cart page rendering
// ============================================================
function renderCartPage() {
    const tbody          = document.getElementById("cart-body");
    if (!tbody) {
        return; // not on cart.html
    }

    const emptyMessage   = document.getElementById("cart-empty-message");
    const summaryBox     = document.getElementById("cart-summary");
    const clearButton    = document.getElementById("clear-cart-button");
    const copyButton     = document.getElementById("copy-summary-button");
    const grandTotalCell = document.getElementById("cart-grand-total");

    // Decide which price tier applies to the whole cart
    function getActiveTier(cart) {
        const totalCases = cart.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        let tier = "normal";
        if (totalCases >= 50) {
            tier = "50";
        } else if (totalCases >= 10) {
            tier = "10";
        }

        return { tier, totalCases };
    }

    function render() {
        const cart = loadCart();
        tbody.innerHTML = "";

        if (!cart.length) {
            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }
            if (summaryBox) {
                summaryBox.value = "";
            }
            if (grandTotalCell) {
                grandTotalCell.textContent = "Grand Total: $0.00";
            }
            return;
        } else if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        const { tier } = getActiveTier(cart);
        let grandTotal = 0;
        const summaryLines = [];

        // Human friendly label for the active tier
        let tierLabel = "Normal";
        if (tier === "10") {
            tierLabel = "Closeout 10+";
        } else if (tier === "50") {
            tierLabel = "Closeout 50+";
        }

        cart.forEach((item, index) => {
            const tr = document.createElement("tr");

            // Item name
            const tdName = document.createElement("td");
            tdName.textContent = item.name;
            tr.appendChild(tdName);

            // SKU
            const tdSku = document.createElement("td");
            tdSku.textContent = item.sku;
            tr.appendChild(tdSku);

            // Pieces per case
            const tdCasesPer = document.createElement("td");
            tdCasesPer.textContent = item.casesPerCase || "";
            tr.appendChild(tdCasesPer);

            // Quantity input
            const tdQty = document.createElement("td");
            const qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.min = "1";
            qtyInput.value = item.quantity;
            qtyInput.addEventListener("change", () => {
                const newQty = parseInt(qtyInput.value, 10);
                const cartNow = loadCart();

                if (isNaN(newQty) || newQty <= 0) {
                    cartNow.splice(index, 1);
                } else {
                    cartNow[index].quantity = newQty;
                }

                saveCart(cartNow);
                render();
            });
            tdQty.appendChild(qtyInput);
            tr.appendChild(tdQty);

            // Helper to create a price cell and highlight the active tier
            function makePriceCell(value, thisTier) {
                const td = document.createElement("td");
                if (value && value > 0) {
                    td.textContent = "$" + value.toFixed(2);
                } else {
                    td.textContent = "";
                }

                // Highlight whichever tier is actually used for this row
                if (tier === thisTier && value && value > 0) {
                    td.classList.add("active-price-tier");
                }
                return td;
            }

            // Normal, Closeout 10+, Closeout 50+
            const tdNormal = makePriceCell(item.priceNormal, "normal");
            const td10     = makePriceCell(item.price10, "10");
            const td50     = makePriceCell(item.price50, "50");
            tr.appendChild(tdNormal);
            tr.appendChild(td10);
            tr.appendChild(td50);

            // Choose the unit price based on the active tier,
            // but fall back to a lower tier if that price is missing
            let unitPrice = item.priceNormal;

            if (tier === "50" && item.price50 > 0) {
                unitPrice = item.price50;
            } else if (tier === "10" && item.price10 > 0) {
                unitPrice = item.price10;
            }

            const lineTotal = unitPrice * Number(item.quantity || 0);
            grandTotal += lineTotal;

            const tdTotal = document.createElement("td");
            tdTotal.textContent = "$" + lineTotal.toFixed(2);
            tr.appendChild(tdTotal);

            // Remove button
            const tdRemove = document.createElement("td");
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.type = "button";
            removeBtn.addEventListener("click", () => {
                const cartNow = loadCart();
                cartNow.splice(index, 1);
                saveCart(cartNow);
                render();
            });
            tdRemove.appendChild(removeBtn);
            tr.appendChild(tdRemove);

            tbody.appendChild(tr);

            // Summary line for Google Form or email
            summaryLines.push(
                `${item.sku}: ${item.quantity} case(s) @ $${unitPrice.toFixed(2)} (${tierLabel})`
            );
        });

        if (summaryBox) {
            summaryBox.value = summaryLines.join("\n");
        }
        if (grandTotalCell) {
            grandTotalCell.textContent = "Grand Total: $" + grandTotal.toFixed(2);
        }
    }

    // Clear cart button
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (confirm("Clear all items from your cart?")) {
                saveCart([]);
                render();
            }
        });
    }

    // Copy summary button
    if (copyButton && summaryBox) {
        copyButton.addEventListener("click", () => {
            summaryBox.select();
            document.execCommand("copy");
            alert("Cart summary copied. You can paste it into the Google Form.");
        });
    }

    // Initial render
    render();
}

// ============================================================
// Initialise on every page
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const cart = loadCart();
    updateCartCount(cart);
    setupAddToCartButtons();
    renderCartPage();
});

// Automatically open the Google Form and copy the cart summary when available
document.addEventListener("click", function (event) {
    const orderButton = event.target.closest(".order-request-button");
    if (!orderButton) {
        return;
    }

    event.preventDefault();

    const summaryTextarea = document.getElementById("cart-summary");

    function openForm() {
        window.open(ORDER_FORM_URL, "_blank");
    }

    if (summaryTextarea && summaryTextarea.value.trim()) {
        const summaryText = summaryTextarea.value.trim();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(summaryText)
                .catch(function () {
                    // If copy fails, still open the form
                })
                .finally(openForm);
        } else {
            // If clipboard is not available, just open the form
            openForm();
        }
    } else {
        // On non-cart pages, or if there is no summary, just open the form
        openForm();
    }
});
