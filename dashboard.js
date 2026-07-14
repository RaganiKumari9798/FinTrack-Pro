const ctx = document.getElementById("myChart");

const myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Income vs Expenses"],
        datasets: [
            {
                label: "Income",
                data: [0],
                backgroundColor: "#166534",
                barThickness: 120
            },
            {
                label: "Expenses",
                data: [0],
                backgroundColor: "#b91c1c",
                barThickness: 120
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top"
            }
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                },

                grid: {
                    color: "#e5e7eb"
                }
            },

            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});


function updateChart(data = transactions) {

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((item) => {

        if (item.type === "Income") {
            totalIncome += Number(item.amount);
        } else {
            totalExpense += Number(item.amount);
        }

    });

    myChart.data.datasets[0].data = [totalIncome];
    myChart.data.datasets[1].data = [totalExpense];

    const highest = Math.max(totalIncome, totalExpense);

    myChart.options.scales.y.max =
        highest === 0 ? 1000 : Math.ceil(highest * 1.2);

    myChart.options.scales.y.ticks.stepSize =
        highest === 0 ? 100 : Math.ceil(highest / 10);

    myChart.update();
}


const openBtn = document.getElementById("openModal");
const modal = document.getElementById("transactionModal");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Close when clicking outside the modal box
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});
const form = document.getElementById("transactionForm");
const tbody = document.getElementById("transactionBody");


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex=-1;

form.addEventListener("submit", function(event){

    event.preventDefault();
    let type = event.target[0].value;
  let description = event.target[1].value;
  let amount = event.target[2].value;
  let date = event.target[3].value;
  let category = event.target[4].value;

  if (
    type.trim() === "" ||
    description.trim() === "" ||
    amount.trim() === "" ||
    date.trim() === "" ||
    category.trim() ===""
  ) {
    alert("Please fill all the fields");
    return;
  }

   let transaction = {
        type,
        description,
        amount,
        date,
        category
    };

    if (editIndex === -1) {

        // Add New Transaction
        transactions.push(transaction);

    } else {

        // Update Existing Transaction
        transactions[editIndex] = transaction;

        editIndex = -1;

    }
    
    saveTransactions();
    displayTransactions();
    updateChart();
    updateCards();
    form.reset();

    modal.classList.remove("active");

});


function displayTransactions(data = transactions) {

    tbody.innerHTML = "";

    // Currency Symbol
    const symbol = localStorage.getItem("currency") || "$";

    data.forEach((item) => {

        const index = transactions.indexOf(item);

        tbody.innerHTML += `
        <tr>

            <td>${item.date}</td>

            <td><strong>${item.description}</strong></td>

            <td>
                <span class="category">${item.category}</span>
            </td>

            <td class="${item.type === "Income" ? "income" : "expense"}">
                ${item.type === "Income" ? "+" : "-"}${symbol}${Number(item.amount).toFixed(2)}
            </td>

            <td>

                <button class="edit-btn" onclick="editTransaction(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn" onclick="deleteTransaction(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>

        </tr>
        `;
    });

}

function deleteTransaction(index){

    transactions.splice(index,1);

    saveTransactions();
    displayTransactions();
    updateCards();
    updateChart();
}

function editTransaction(index){
    console.log(index);
    console.log(transactions);

    editIndex = index;

    const item = transactions[index];

    document.getElementById("type").value = item.type;

    document.getElementById("description").value = item.description;

    document.getElementById("amount").value = item.amount;

    document.getElementById("date").value = item.date;

    document.getElementById("category").value = item.category;

    modal.classList.add("active");

    // transactions.splice(index,1);

}


function updateCards(data = transactions) {

    let totalIncome = 0;
    let totalExpense = 0;

    // Currency Symbol
    const symbol = localStorage.getItem("currency") || "$";

    data.forEach((transaction) => {

        if (transaction.type === "Income") {

            totalIncome += Number(transaction.amount);

        } else {

            totalExpense += Number(transaction.amount);

        }

    });

    const currentBalance = totalIncome - totalExpense;

    document.getElementById("currentBalance").textContent =
        `${symbol}${currentBalance.toLocaleString("en-IN")}`;

    document.getElementById("totalIncome").textContent =
        `${symbol}${totalIncome.toLocaleString("en-IN")}`;

    document.getElementById("totalExpense").textContent =
        `${symbol}${totalExpense.toLocaleString("en-IN")}`;

    document.getElementById("totalTransaction").textContent =
        data.length;

}

const resetBtn = document.querySelector(".reset-btn");

resetBtn.addEventListener("click", function () {

    const confirmReset = confirm("WARNING: This will delete all your transaction data permanently!");

    if (!confirmReset) {
        return;
    }

    // Clear all transactions
    transactions = [];

    // Reset edit mode
    editIndex = -1;

    // Clear table
    displayTransactions();

    // Reset cards
    updateCards();

    // Reset chart
    updateChart();

    // Reset form
    form.reset();

    // Close modal if open
    modal.classList.remove("active");

    // Remove saved data (if using localStorage)
    localStorage.removeItem("transactions");

    // alert("All data has been reset successfully!");

});


const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
}

// Toggle theme
themeToggle.addEventListener("change", function () {

    if (themeToggle.checked) {

        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");

    } else {

        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");

    }

});

const dashboardBtn = document.getElementById("dashboardBtn");
const settingsBtn = document.getElementById("settingsBtn");

const dashboardPage = document.getElementById("dashboard");
const settingsPage = document.getElementById("settingsPage");

dashboardBtn.addEventListener("click", () => {

    dashboardPage.style.display = "block";
    settingsPage.style.display = "none";

    dashboardBtn.classList.add("active");
    settingsBtn.classList.remove("active");

});

settingsBtn.addEventListener("click", () => {

    dashboardPage.style.display = "none";
    settingsPage.style.display = "block";

    settingsBtn.classList.add("active");
    dashboardBtn.classList.remove("active");

});
const fullName = document.getElementById("fullName");

function loadUserDetails() {

    const user = localStorage.getItem("username");

    if (user) {
        fullName.value = user;
    }

}
loadUserDetails();
document.querySelector("#loginName").textContent =localStorage.getItem("username");


const currency = document.getElementById("currency");
const saveSettingsBtn = document.querySelector(".save-settings");

// Load saved currency
currency.value = localStorage.getItem("currency") || "$";

saveSettingsBtn.addEventListener("click", saveSettings);

function saveSettings() {

    // Save Currency
    localStorage.setItem("currency", currency.value);

    // Save Full Name
    localStorage.setItem("loggedInUser", fullName.value);

    // Update Navbar
    document.getElementById("loginName").textContent = fullName.value;

    // Refresh UI
    displayTransactions();
    updateCards();
    updateChart();

    alert("Settings saved successfully!");

}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);

function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    // Agar login session save kar rahe ho
    localStorage.removeItem("isLoggedIn");

    // Login page par redirect
    window.location.href = "index.html";

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", searchTransaction);


function searchTransaction() {

    const value = searchInput.value.toLowerCase().trim();

    if (value === "") {

        displayTransactions();
        updateCards();
        updateChart();
        return;
    }

    const filtered = transactions.filter((item) => {

        return (
            item.description.toLowerCase().includes(value) ||
            item.category.toLowerCase().includes(value) ||
            item.type.toLowerCase().includes(value) ||
            item.date.includes(value)
        );

    });

    displayTransactions(filtered);
    updateCards(filtered);
    updateChart(filtered);
}


const filterType = document.getElementById("filterType");

filterType.addEventListener("change", filterTransactions);

function filterTransactions() {

    const selectedType = filterType.value;

    if (selectedType === "All") {

        displayTransactions();
        updateCards();
        updateChart();
        return;
    }

    const filtered = transactions.filter((item) => {

        return item.type === selectedType;

    });

    displayTransactions(filtered);
    updateCards(filtered);
    updateChart(filtered);
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
function init() {
    displayTransactions();
    updateCards();
    updateChart();
}

init();