// CsuTestingChecklist2.js - Unique localStorage key

// Initialize with empty data structures
if (!window.csuTestingChecklist2Results) window.csuTestingChecklist2Results = {
    dummyBreaker: [],
    others: []
};

// Data definitions for Dummy Breaker
const DUMMY_BREAKER_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:1", Description: "Dummy Breaker Indication", IOA: "1", Status: "Open" },
    { No: "2", IOModuleCard: "XZ1D:2", Description: "Dummy Breaker Indication", IOA: "1", Status: "Close" },
    { No: "3", IOModuleCard: "XZ1K:1", Description: "Dummy Breaker Control", IOA: "1001", Status: "Open" },
    { No: "4", IOModuleCard: "XZ1K:2", Description: "Dummy Breaker Control", IOA: "1001", Status: "Close" }
];

// Data definitions for Others
const OTHERS_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:17", Description: "CES", IOA: "101", Status: "ON" },
    { No: "2", IOModuleCard: "XZ1D:27", Description: "CHARGER SUMMARY ALARM", IOA: "111", Status: "ON" },
    { No: "3", IOModuleCard: "XZ1D:28", Description: "RMU AC TRIP", IOA: "112", Status: "ON" },
    { No: "4", IOModuleCard: "XZ1D:29", Description: "DIGITAL INPUT CIRCUIT FAIL", IOA: "113", Status: "ON" },
    { No: "5", IOModuleCard: "XZ1D:30", Description: "DIGITAL OUTPUT CIRCUIT FAIL", IOA: "114", Status: "ON" },
    { No: "6", IOModuleCard: "XZ1K:9", Description: "EFI MASTER RESET", IOA: "1501", Status: "ON" },
    { No: "7", IOModuleCard: "N/A", Description: "BUFFER FULL", IOA: "950", Status: "ON" },
    { No: "8", IOModuleCard: "N/A", Description: "TIME SYNC", IOA: "951", Status: "ON" },
    { No: "9", IOModuleCard: "N/A", Description: " VIRTUAL POINT FOR COMMUNICATION TO NCC FAIL", IOA: "953", Status: "ON" },
    { No: "10", IOModuleCard: "N/A", Description: "VIRTUAL POINT FOR DI1 CARD/MODULE FAIL", IOA: "954", Status: "ON" },
    { No: "11", IOModuleCard: "N/A", Description: "VIRTUAL POINT FOR DO1 CARD/MODULE FAIL", IOA: "955", Status: "ON" }
];

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('csuTestingChecklist2Results');
    if (savedResults) {
        try {
            window.csuTestingChecklist2Results = JSON.parse(savedResults);
            if (!window.csuTestingChecklist2Results.dummyBreaker) {
                window.csuTestingChecklist2Results.dummyBreaker = [];
            }
            if (!window.csuTestingChecklist2Results.others) {
                window.csuTestingChecklist2Results.others = [];
            }
        } catch (e) {
            console.error('Error parsing saved data:', e);
        }
    }

    // Generate rows for each table
    generateTableRows2('DummyBreakerTbody', DUMMY_BREAKER_ITEMS, 'dummyBreaker');
    generateTableRows2('OthersTbody', OTHERS_ITEMS, 'others');

    // Load any saved data
    loadCSU2Data();

    // Attach event listeners to navigation buttons
    attachNavigationEvents2();

    // Setup input validation for Remote/Supervisory fields
    setupInputValidation2();
});

// Function to setup input validation for Remote/Supervisory fields
function setupInputValidation2() {
    // Function to validate a single input
    function validateInput(input) {
        const value = input.value;
        
        // If empty, allow it (user can clear)
        if (value === '') {
            input.dataset.previousValue = '';
            return true;
        }
        
        // Only allow "/" or "-"
        if (value !== '/' && value !== '-') {
            const previousValue = input.dataset.previousValue || '';
            input.value = previousValue;
            // Show visual feedback
            input.style.borderColor = 'red';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 500);
            return false;
        } else {
            // Store the valid value
            input.dataset.previousValue = value;
            input.style.borderColor = 'green';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 300);
            return true;
        }
    }

    // Find all Remote and Supervisory inputs
    const allInputs = document.querySelectorAll('input[type="text"]');
    allInputs.forEach(function(input) {
        if (input.name && (input.name.includes('remote') || input.name.includes('supervisory'))) {
            // Remove existing listeners to avoid duplicates
            input.removeEventListener('input', input._validationHandler);
            
            // Create and store the handler
            const handler = function() {
                validateInput(this);
            };
            input._validationHandler = handler;
            input.addEventListener('input', handler);
            
            // Store initial value
            input.dataset.previousValue = input.value;
        }
    });
}

// Function to attach navigation event listeners
function attachNavigationEvents2() {
    // Attach to Previous button
    const prevBtn = document.querySelector('button[onclick*="previous"], button[onclick*="Previous"], #prevBtn, .prev-btn');
    if (prevBtn) {
        prevBtn.onclick = null;
        prevBtn.addEventListener('click', goToPreviousPage2);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('previous') || 
                btn.textContent.toLowerCase().includes('back')) {
                btn.onclick = null;
                btn.addEventListener('click', goToPreviousPage2);
            }
        });
    }

    // Attach to Next button
    const nextBtn = document.querySelector('button[onclick*="next"], button[onclick*="Next"], #nextBtn, .next-btn');
    if (nextBtn) {
        nextBtn.onclick = null;
        nextBtn.addEventListener('click', goToNext2);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('next') || 
                btn.textContent.toLowerCase().includes('continue')) {
                btn.onclick = null;
                btn.addEventListener('click', goToNext2);
            }
        });
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const onclickAttr = e.target.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('goToPreviousPage2')) {
                e.preventDefault();
                e.target.onclick = null;
                goToPreviousPage2();
            } else if (onclickAttr && onclickAttr.includes('goToNext2')) {
                e.preventDefault();
                e.target.onclick = null;
                goToNext2();
            }
        }
    });
}

// Function to generate table rows for any table
function generateTableRows2(tbodyId, items, dataKey) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const savedArray = dataKey === 'dummyBreaker' 
        ? (window.csuTestingChecklist2Results.dummyBreaker || [])
        : (window.csuTestingChecklist2Results.others || []);

    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const saved = (savedArray && savedArray[index]) ? savedArray[index] : {};
        const row = document.createElement('tr');
        
        // Get saved remote and supervisory values, convert "N/A" back to "-" for display
        const remoteValue = saved.remote === 'N/A' ? '-' : (saved.remote || '');
        const supervisoryValue = saved.supervisory === 'N/A' ? '-' : (saved.supervisory || '');
        
        row.innerHTML = `
            <td style="text-align: center;">${item.No}</td>
            <td style="text-align: center;">${item.IOModuleCard}</td>
            <td style="text-align: center;">${item.Description}</td>
            <td style="text-align: center;">${item.IOA}</td>
            <td style="text-align: center;">${item.Status}</td>
            <td style="text-align: center;">
                <input type="text" name="${dataKey}_remote_${index}" value="${remoteValue}" 
                       style="width: 60px; text-align: center; border: 2px solid #ccc; font-weight: bold;" 
                        />
            </td>
            <td style="text-align: center;">
                <input type="text" name="${dataKey}_supervisory_${index}" value="${supervisoryValue}" 
                       style="width: 60px; text-align: center; border: 2px solid #ccc; font-weight: bold;" 
                        />
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Save CSU2 test data
function saveCSU2Data() {
    console.log('Saving CSU2 test data...');
    
    if (!window.csuTestingChecklist2Results) {
        window.csuTestingChecklist2Results = {
            dummyBreaker: [],
            others: []
        };
    }

    // Clear arrays before saving new data
    window.csuTestingChecklist2Results.dummyBreaker = [];
    window.csuTestingChecklist2Results.others = [];

    // Save Dummy Breaker data
    saveTableData2('DummyBreakerTbody', 'dummyBreaker', window.csuTestingChecklist2Results.dummyBreaker);
    
    // Save Others data
    saveTableData2('OthersTbody', 'others', window.csuTestingChecklist2Results.others);

    // Save to localStorage with unique key
    try {
        localStorage.setItem('csuTestingChecklist2Results', JSON.stringify(window.csuTestingChecklist2Results));
        console.log('Data saved successfully:', window.csuTestingChecklist2Results);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Helper function to save data from a specific table
function saveTableData2(tbodyId, dataKey, targetArray) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        
        const description = cells[2] ? cells[2].textContent.trim() : '';
        const ioa = cells[3] ? cells[3].textContent.trim() : '';
        const status = cells[4] ? cells[4].textContent.trim() : '';
        
        // Get remote value - convert "-" to "N/A" for storage
        const remoteInput = row.querySelector(`input[name="${dataKey}_remote_${index}"]`);
        let remoteValue = remoteInput ? remoteInput.value : '';
        // If value is "-", store as "N/A"
        if (remoteValue === '-') {
            remoteValue = 'N/A';
        }
        
        // Get supervisory value - convert "-" to "N/A" for storage
        const supervisoryInput = row.querySelector(`input[name="${dataKey}_supervisory_${index}"]`);
        let supervisoryValue = supervisoryInput ? supervisoryInput.value : '';
        // If value is "-", store as "N/A"
        if (supervisoryValue === '-') {
            supervisoryValue = 'N/A';
        }
        
        targetArray.push({
            Description: description,
            IOA: ioa,
            Status: status,
            remote: remoteValue || null,
            supervisory: supervisoryValue || null
        });
    });
}

// Load CSU2 test data
function loadCSU2Data() {
    console.log('Data loaded from localStorage:', window.csuTestingChecklist2Results);
}

// ============================================================
// CLEAR ALL FUNCTION
// ============================================================
function clearAllCSU2() {
    // Clear all Remote and Supervisory text inputs in all tables
    const textInputs = document.querySelectorAll('#DummyBreakerTbody input[type="text"], #OthersTbody input[type="text"]');
    textInputs.forEach(input => {
        if (input.name && (input.name.includes('remote') || input.name.includes('supervisory'))) {
            input.value = '';
            input.dataset.previousValue = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

// ============================================================
// CONFIRMATION WRAPPER
// ============================================================
function clearAllCSU2WithConfirm() {
    if (confirm("⚠️ WARNING: This will clear ALL test data for the CSU Testing Checklist 2.\n\nThis includes:\n- All Remote and Supervisory text fields for Dummy Breaker & Others\n\nThis action CANNOT be undone.\n\nAre you sure you want to continue?")) {
        clearAllCSU2();
        alert("All data has been cleared.");
    }
}

// Navigation functions
function goToPreviousPage2() {
    console.log('Going to previous page...');
    
    if (saveCSU2Data()) {
        console.log('Data saved successfully, navigating to CsuTestingChecklist.html');
        window.location.href = 'CsuTestingChecklist.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function goToNext2() {
    console.log('Going to next page...');
    
    if (saveCSU2Data()) {
        console.log('Data saved successfully, navigating to CsuTestingChecklist_SPARE.html');
        if (typeof navigationGuard !== 'undefined') {
            navigationGuard.markPageAsCompleted();
        }
        window.location.href = 'CsuTestingChecklist_SPARE.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function clearAll() {
    clearAllCSU2();
}