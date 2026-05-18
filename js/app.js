// Y-Solutions ERP - System Runtime Core Engine

// --- 1. FIREBASE ARCHITECTURE ENGINE INITIALIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyARIpexHYJRjy_K2mjjro68sKi-hQEfswc",
    authDomain: "y-solutions-erp.firebaseapp.com",
    projectId: "y-solutions-erp",
    storageBucket: "y-solutions-erp.firebasestorage.app",
    messagingSenderId: "414095083537",
    appId: "1:414095083537:web:b5dbce7b9f255fa6bfc9b0",
    measurementId: "G-YN7E8FTX3T"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- 2. CONFIGURABLE STATE RUNTIME ENVIRONMENT ---
let activeOrderItemsList = [];
let assignedSecurityRole = "Sales"; 
const globalStaffDirectoryMockup = [
    { email: "ceo.manager@y-solutions.com", role: "Manager" },
    { email: "sales.lead@y-solutions.com", role: "Sales" },
    { email: "operations.engineer@y-solutions.com", role: "Operations" },
    { email: "hr.director@y-solutions.com", role: "HR" },
    { email: "storage.keeper@y-solutions.com", role: "Storage" }
];

// --- 3. SYSTEM AUTHENTICATION PROTOCOLS ---
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        document.getElementById('user-info').innerText = user.email;
        
        // Derive dynamic security posture parameters safely
        assignedSecurityRole = resolveClearanceLevel(user.email);
        const badge = document.getElementById('user-role-badge');
        badge.innerText = assignedSecurityRole;
        
        injectInterfaceByClearance(assignedSecurityRole);
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard-screen').classList.add('hidden');
    }
});

function resolveClearanceLevel(email) {
    const standardized = email.toLowerCase();
    if (standardized.includes("manager")) return "Manager";
    if (standardized.includes("ops") || standardized.includes("operations")) return "Operations";
    if (standardized.includes("hr")) return "HR";
    if (standardized.includes("storage")) return "Storage";
    return "Sales"; 
}

function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const err = document.getElementById('login-error');
    err.innerText = "";

    auth.signInWithEmailAndPassword(email, pass).catch(e => { err.innerText = e.message; });
}

function logout() {
    auth.signOut();
}

// --- 4. SECURE USER INTERFACE INTERCEPTOR & ROUTER ---
function injectInterfaceByClearance(role) {
    const menu = document.getElementById('nav-menu');
    menu.innerHTML = '';
    concealAllViews();

    // Mapping functional matrix criteria safely
    if (role === "Manager" || role === "HR") {
        appendNavElement("Executive Dashboard", "sec-dashboard", renderExecutiveFinancialData);
    }
    if (role === "Manager" || role === "Sales") {
        appendNavElement("Quotation System", "sec-quotation", bootstrapQuotationDropdowns);
    }
    if (role === "Manager" || role === "Operations") {
        appendNavElement("Operations Desk", "sec-operations", loadOperationsProjectQueue);
    }
    if (role === "Manager" || role === "Storage") {
        appendNavElement("Storage Catalog", "sec-storage", viewStorageInventoryCatalog);
    }
    if (role === "Manager" || role === "HR") {
        appendNavElement("HR Directory View", "sec-hr", populateHRStaffDirectory);
    }

    if (menu.firstChild) menu.firstChild.click();
}

function appendNavElement(title, sectionId, viewBootstrapCallback) {
    const link = document.createElement('a');
    link.innerText = title;
    link.onclick = () => {
        concealAllViews();
        document.getElementById(sectionId).classList.remove('hidden');
        if (viewBootstrapCallback) viewBootstrapCallback();
    };
    document.getElementById('nav-menu').appendChild(link);
}

function concealAllViews() {
    document.querySelectorAll('.module').forEach(m => m.classList.add('hidden'));
}

// --- 5. DATA MODULE WORKFLOW LOADERS ---

function renderExecutiveFinancialData() {
    const tbody = document.getElementById('revenue-body');
    tbody.innerHTML = '';
    REVENUE_DATA.forEach(r => {
        tbody.innerHTML += `<tr>
            <td><b>${r.month}</b></td>
            <td>${r.projects}</td>
            <td>${r.revenue.toLocaleString()} EGP</td>
            <td style="color:#27ae60; font-weight:600;">${r.profit.toLocaleString()} EGP</td>
        </tr>`;
    });
}

function bootstrapQuotationDropdowns() {
    const select = document.getElementById('item-select');
    select.innerHTML = '<option value="0">Choose Device Catalog Asset Spec...</option>';
    HARDWARE_DATABASE.sort((a, b) => a.brand.localeCompare(b.brand)).forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.innerText = `[${item.brand}] ${item.category} - ${item.name} (${item.price} EGP)`;
        select.appendChild(option);
    });
    calculateAutomatedInvoice();
}

function loadOperationsProjectQueue() {
    const tbody = document.getElementById('ops-projects-body');
    tbody.innerHTML = '';
    
    HISTORICAL_PROJECTS.forEach(p => {
        const controlDisabled = (assignedSecurityRole !== "Manager" && assignedSecurityRole !== "Operations") ? "disabled" : "";
        tbody.innerHTML += `<tr>
            <td>#${p.id}</td>
            <td><b>${p.city}</b></td>
            <td>${p.size} m²</td>
            <td>${p.devices} Nodes</td>
            <td>
                <select class="status-select-inline" ${controlDisabled} onchange="updateProjectStateFirestore(${p.id}, this.value)">
                    <option value="Pending">Pending</option>
                    <option value="In Work" selected>In Work</option>
                    <option value="Finished">Finished</option>
                </select>
            </td>
        </tr>`;
    });
}

function viewStorageInventoryCatalog() {
    const tbody = document.getElementById('storage-body');
    tbody.innerHTML = '';
    
    // Lockdown catalog updates on unauthorized client views
    const panel = document.getElementById('storage-write-box');
    if (assignedSecurityRole !== "Manager" && assignedSecurityRole !== "Storage") {
        panel.classList.add('hidden');
    } else {
        panel.classList.remove('hidden');
    }

    HARDWARE_DATABASE.forEach(h => {
        tbody.innerHTML += `<tr>
            <td>#${h.id}</td>
            <td><span style="font-size:0.85em; padding:3px 6px; background:#eaeaea; border-radius:3px;">${h.category}</span></td>
            <td><b>${h.name}</b></td>
            <td>${h.brand}</td>
            <td>${h.price} EGP</td>
        </tr>`;
    });
}

function populateHRStaffDirectory() {
    const tbody = document.getElementById('hr-staff-body');
    tbody.innerHTML = '';
    globalStaffDirectoryMockup.forEach(staff => {
        tbody.innerHTML += `<tr>
            <td><code>${staff.email}</code></td>
            <td><span class="role-badge" style="background:#34495e;">${staff.role}</span></td>
        </tr>`;
    });
}

// --- 6. AUTOMATED QUOTATION CONFIGURATION ENGINE ---
function addItemToQuote() {
    const itemId = parseInt(document.getElementById('item-select').value);
    const qty = parseInt(document.getElementById('item-qty').value);
    
    if (!itemId || qty < 1) return alert("Select a valid item and quantity spec baseline.");

    const matchedHardwareAsset = HARDWARE_DATABASE.find(h => h.id === itemId);
    if (!matchedHardwareAsset) return;

    const existingCartIndex = activeOrderItemsList.findIndex(cart => cart.id === itemId);
    if (existingCartIndex > -1) {
        activeOrderItemsList[existingCartIndex].qty += qty;
        activeOrderItemsList[existingCartIndex].total = activeOrderItemsList[existingCartIndex].qty * matchedHardwareAsset.price;
    } else {
        activeOrderItemsList.push({
            ...matchedHardwareAsset,
            qty: qty,
            total: matchedHardwareAsset.price * qty
        });
    }
    
    renderCurrentQuotationSnapshot();
}

function renderCurrentQuotationSnapshot() {
    const tbody = document.getElementById('quote-body');
    tbody.innerHTML = '';
    
    activeOrderItemsList.forEach(item => {
        tbody.innerHTML += `<tr>
            <td>${item.name} (${item.category})</td>
            <td>${item.brand}</td>
            <td>${item.price}.00</td>
            <td>${item.qty}</td>
            <td><b>${item.total}.00</b> EGP</td>
        </tr>`;
    });
    calculateAutomatedInvoice();
}

function calculateAutomatedInvoice() {
    let subtotalCostBase = 0;
    activeOrderItemsList.forEach(i => subtotalCostBase += i.total);

    const clientCityLocation = document.getElementById('client-city').value;
    const determinedLogisticsCost = DELIVERY_RATES[clientCityLocation] || 0;
    
    const computedInstallationFee = subtotalCostBase * 0.15; // 15% Standard Installation
    const operationalCostSum = subtotalCostBase + computedInstallationFee + determinedLogisticsCost;
    const computedVatTax = operationalCostSum * 0.14; // 14% Government Standard VAT
    const grandInvoiceTotalValue = operationalCostSum + computedVatTax;

    document.getElementById('subtotal').innerText = subtotalCostBase.toFixed(2);
    document.getElementById('install-fee').innerText = computedInstallationFee.toFixed(2);
    document.getElementById('delivery-fee').innerText = determinedLogisticsCost.toFixed(2);
    document.getElementById('vat-fee').innerText = computedVatTax.toFixed(2);
    document.getElementById('grand-total').innerText = grandInvoiceTotalValue.toFixed(2);
}

document.getElementById('client-city').addEventListener('change', calculateAutomatedInvoice);

// --- 7. EXTERNAL FIRESTORE TRANSACTIONS ---
function submitOrder() {
    if (activeOrderItemsList.length === 0) return alert("Add line items to calculate an invoice snapshot.");
    const targetClientName = document.getElementById('client-name').value || "Unnamed Corporate Entity";
    
    const invoicePayload = {
        client: targetClientName,
        city: document.getElementById('client-city').value,
        items: activeOrderItemsList,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('orders').add(invoicePayload)
        .then(() => {
            alert(`Quotation successfully finalized! Record saved to Cloud Firestore for Storage validation.`);
            activeOrderItemsList = [];
            document.getElementById('client-name').value = '';
            renderCurrentQuotationSnapshot();
        })
        .catch(e => alert("Firestore Write Interrupted: " + e.message));
}

function updateProjectStateFirestore(projectId, chosenState) {
    if (assignedSecurityRole !== "Manager" && assignedSecurityRole !== "Operations") return;
    
    db.collection('project_status_logs').doc(`project_${projectId}`).set({
        projectId: projectId,
        status: chosenState,
        updatedBy: auth.currentUser?.email,
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => console.log(`Project Matrix Status ID ${projectId} transitioned to [${chosenState}].`))
    .catch(e => alert("State Synchronization Failure: " + e.message));
}

function submitMaintenance() {
    const client = document.getElementById('maint-client').value;
    const description = document.getElementById('maint-desc').value;

    if (!client || !description) return alert("Complete the description parameters.");

    db.collection('maintenance_requests').add({
        clientName: client,
        issueDescription: description,
        loggedBy: auth.currentUser?.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Maintenance entry successfully transmitted to field technicians.");
        document.getElementById('maint-client').value = '';
        document.getElementById('maint-desc').value = '';
    });
}

function addNewInventoryItem() {
    const name = document.getElementById('new-item-name').value;
    const brand = document.getElementById('new-item-brand').value;
    const category = document.getElementById('new-item-cat').value;
    const price = parseInt(document.getElementById('new-item-price').value);

    if (!name || !brand || !price) return alert("Enter accurate asset specifications.");

    const allocatedId = HARDWARE_DATABASE.length + 1;
    const newHardwareObject = { id: allocatedId, category: category, name: name, brand: brand, price: price };
    
    HARDWARE_DATABASE.push(newHardwareObject);
    
    db.collection('inventory_pool').doc(`item_${allocatedId}`).set(newHardwareObject)
        .then(() => {
            alert("Storage inventory collection expanded successfully.");
            viewStorageInventoryCatalog();
            document.getElementById('new-item-name').value = '';
            document.getElementById('new-item-brand').value = '';
            document.getElementById('new-item-price').value = '';
        });
}
