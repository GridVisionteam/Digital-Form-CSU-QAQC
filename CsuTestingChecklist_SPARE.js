// CsuTestingChecklist_SPARE.js - Save only Remote/RCB and Supervisory/ASE fields
// Data keys format: SPARE6_R_1, SPARE6_S_1, SPARE7_R_1, SPARE7_S_1, etc.

// Initialize with empty data structures
if (!window.csuTestingChecklistSpareResults) window.csuTestingChecklistSpareResults = {
    spare6: {},
    spare7: {}
};

// Data definitions for Spare6
const SPARE6_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:9", Description: "DI DB SPARE 1", IOA: "5", Status: "Open" },
    { No: "2", IOModuleCard: "XZ1D:10", Description: "DI DB SPARE 1", IOA: "5", Status: "Close" },
    { No: "3", IOModuleCard: "XZ1D:11", Description: "DI DB SPARE 2", IOA: "6", Status: "Open" },
    { No: "4", IOModuleCard: "XZ1D:12", Description: "DI DB SPARE 2", IOA: "6", Status: "Close" },
    { No: "5", IOModuleCard: "XZ1D:13", Description: "DI DB SPARE 3", IOA: "7", Status: "Open" },
    { No: "6", IOModuleCard: "XZ1D:14", Description: "DI DB SPARE 3", IOA: "7", Status: "Close" },
    { No: "7", IOModuleCard: "XZ1D:15", Description: "DI DB SPARE 4", IOA: "8", Status: "Open" },
    { No: "8", IOModuleCard: "XZ1D:16", Description: "DI DB SPARE 4", IOA: "8", Status: "Close" },
];

// Data definitions for Spare7
const SPARE7_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:31", Description: "DI SB SPARE 2", IOA: "115", Status: "ON" },
    { No: "2", IOModuleCard: "XZ1D:32", Description: "DI SB SPARE 3", IOA: "116", Status: "ON" },
    { No: "3", IOModuleCard: "XZ1K:10", Description: "CO CB SPARE 1", IOA: "1502", Status: "ON" },
    { No: "4", IOModuleCard: "XZ1K:11", Description: "CO DB SPARE 1", IOA: "1005", Status: "Open" },
    { No: "5", IOModuleCard: "XZ1K:12", Description: "CO DB SPARE 1", IOA: "1005", Status: "Close" },
    { No: "6", IOModuleCard: "XZ1K:13", Description: "CO DB SPARE 2", IOA: "1006", Status: "Open" },
    { No: "7", IOModuleCard: "XZ1K:14", Description: "CO DB SPARE 2", IOA: "1006", Status: "Close" },
    { No: "8", IOModuleCard: "XZ1K:15", Description: "CO DB SPARE 3", IOA: "1007", Status: "Open" },
    { No: "9", IOModuleCard: "XZ1K:16", Description: "CO DB SPARE 3", IOA: "1007", Status: "Close" },
];

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('csuTestingChecklistSpareResults');
    if (savedResults) {
        try {
            const parsed = JSON.parse(savedResults);
            window.csuTestingChecklistSpareResults = {
                spare6: parsed.spare6 || {},
                spare7: parsed.spare7 || {}
            };
        } catch (e) {
            console.error('Error parsing saved data:', e);
            window.csuTestingChecklistSpareResults = { spare6: {}, spare7: {} };
        }
    }

    // Generate rows for each table
    generateTableRowsSpare('Spare6Tbody', SPARE6_ITEMS, 'spare6', 6);
    generateTableRowsSpare('Spare7Tbody', SPARE7_ITEMS, 'spare7', 7);

    // Load any saved data
    loadSpareData();

    // Attach event listeners to navigation buttons
    attachNavigationEventsSpare();

    // Setup input validation for Remote/Supervisory fields
    setupInputValidationSpare();
});

// Function to generate table rows for any table
function generateTableRowsSpare(tbodyId, items, dataKey, sectionNum) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const savedObj = window.csuTestingChecklistSpareResults[dataKey] || {};

    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const rowNum = index + 1; // 1-based row number
        const remoteKey = `SPARE${sectionNum}_R_${rowNum}`;
        const supervisoryKey = `SPARE${sectionNum}_S_${rowNum}`;

        const remoteValue = savedObj[remoteKey] || '';
        const supervisoryValue = savedObj[supervisoryKey] || '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${item.No}</td>
            <td style="text-align: center;">${item.IOModuleCard}</td>
            <td style="text-align: center;">${item.Description}</td>
            <td style="text-align: center;">${item.IOA}</td>
            <td style="text-align: center;">${item.Status}</td>
            <td style="text-align: center;">
                <input type="text" 
                       name="${remoteKey}" 
                       id="${remoteKey}"
                       value="${remoteValue}" 
                       data-key="${remoteKey}"
                       data-section="${dataKey}"
                       style="width: 60px; text-align: center; border: 2px solid #ccc; font-weight: bold;" 
                       maxlength="1" />
            </td>
            <td style="text-align: center;">
                <input type="text" 
                       name="${supervisoryKey}" 
                       id="${supervisoryKey}"
                       value="${supervisoryValue}" 
                       data-key="${supervisoryKey}"
                       data-section="${dataKey}"
                       style="width: 60px; text-align: center; border: 2px solid #ccc; font-weight: bold;" 
                       maxlength="1" />
            </td>
        `;
        tbody.appendChild(row);
    });

    // Setup validation after rows are generated
    setupInputValidationSpare();
}

// Function to setup input validation for Remote/Supervisory fields
function setupInputValidationSpare() {
    const allInputs = document.querySelectorAll('#Spare6Tbody input[type="text"], #Spare7Tbody input[type="text"]');
    allInputs.forEach(function(input) {
        // Remove existing listeners to avoid duplicates
        input.removeEventListener('input', input._validationHandler);
        input.removeEventListener('keydown', input._keydownHandler);

        // Store initial value
        input.dataset.previousValue = input.value;

        // Input handler - only allow "/" or "-"
        const handler = function() {
            const value = this.value;

            // If empty, allow it
            if (value === '') {
                this.dataset.previousValue = '';
                this.style.borderColor = '';
                return;
            }

            // Only allow "/" or "-"
            if (value !== '/' && value !== '-') {
                const previousValue = this.dataset.previousValue || '';
                this.value = previousValue;
                this.style.borderColor = 'red';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 500);
                return;
            }

            // Store the valid value
            this.dataset.previousValue = value;
            this.style.borderColor = 'green';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 300);
        };

        input._validationHandler = handler;
        input.addEventListener('input', handler);
    });
}

// ============================================================
// LOAD DATA - Populates the fields from saved data
// ============================================================
function loadSpareData() {
    console.log('Loading SPARE data...');

    // Spare6
    const spare6Data = window.csuTestingChecklistSpareResults.spare6 || {};
    populateTableFromDataSpare('Spare6Tbody', spare6Data, 6);

    // Spare7
    const spare7Data = window.csuTestingChecklistSpareResults.spare7 || {};
    populateTableFromDataSpare('Spare7Tbody', spare7Data, 7);
}

function populateTableFromDataSpare(tbodyId, dataObj, sectionNum) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error('Table body not found:', tbodyId);
        return;
    }

    const rows = tbody.querySelectorAll('tr');

    rows.forEach((row, index) => {
        const rowNum = index + 1;
        const remoteKey = `SPARE${sectionNum}_R_${rowNum}`;
        const supervisoryKey = `SPARE${sectionNum}_S_${rowNum}`;

        const remoteInput = row.querySelector(`input[name="${remoteKey}"]`);
        if (remoteInput && dataObj[remoteKey] !== undefined) {
            remoteInput.value = dataObj[remoteKey];
            remoteInput.dataset.previousValue = dataObj[remoteKey];
        }

        const supervisoryInput = row.querySelector(`input[name="${supervisoryKey}"]`);
        if (supervisoryInput && dataObj[supervisoryKey] !== undefined) {
            supervisoryInput.value = dataObj[supervisoryKey];
            supervisoryInput.dataset.previousValue = dataObj[supervisoryKey];
        }
    });
}

// ============================================================
// CLEAR ALL FUNCTION
// ============================================================
function clearAllSpare() {
    const textInputs = document.querySelectorAll('#Spare6Tbody input[type="text"], #Spare7Tbody input[type="text"]');
    textInputs.forEach(input => {
        input.value = '';
        input.dataset.previousValue = '';
        input.style.backgroundColor = '';
        input.style.borderColor = '';
    });
}

function clearAllCSU2WithConfirm() {
    let confirmMessage = "⚠️ WARNING: This will clear ALL user-entered test data for the CSU Testing Checklist - Spare.\n\n";
    confirmMessage += "This includes:\n";
    confirmMessage += "- All Remote/RCB and Supervisory/ASE text fields for Spare 6 & Spare 7\n\n";
    confirmMessage += "This action CANNOT be undone.\n\nAre you sure you want to continue?";

    if (confirm(confirmMessage)) {
        clearAllSpare();
        alert("All user-entered data has been cleared.");
    }
}

// Save Spare test data - ONLY Remote/RCB and Supervisory/ASE
function saveSpareData() {
    console.log('Saving SPARE test data (Remote/RCB and Supervisory/ASE only)...');

    const results = {
        spare6: {},
        spare7: {}
    };

    // Save Spare6
    saveTableDataSpare('Spare6Tbody', results.spare6, 6);

    // Save Spare7
    saveTableDataSpare('Spare7Tbody', results.spare7, 7);

    window.csuTestingChecklistSpareResults = results;

    try {
        localStorage.setItem('csuTestingChecklistSpareResults', JSON.stringify(results));
        console.log('Data saved successfully:', results);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Helper: save Remote/RCB and Supervisory/ASE only
function saveTableDataSpare(tbodyId, targetObj, sectionNum) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach((row, index) => {
        const rowNum = index + 1;
        const remoteKey = `SPARE${sectionNum}_R_${rowNum}`;
        const supervisoryKey = `SPARE${sectionNum}_S_${rowNum}`;

        const remoteInput = row.querySelector(`input[name="${remoteKey}"]`);
        if (remoteInput) {
            targetObj[remoteKey] = remoteInput.value.trim();
        }

        const supervisoryInput = row.querySelector(`input[name="${supervisoryKey}"]`);
        if (supervisoryInput) {
            targetObj[supervisoryKey] = supervisoryInput.value.trim();
        }
    });
}

// ============================================================
// NAVIGATION FUNCTIONS - No validation, same as main checklist
// ============================================================
function goToPreviousPage2() {
    console.log('Going to previous page...');

    if (saveSpareData()) {
        console.log('Data saved successfully, navigating to CsuTestingChecklist2.html');
        window.location.href = 'CsuTestingChecklist2.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function goToNext2() {
    console.log('Going to next page...');
    
    if (saveSpareData()) {
        console.log('Data saved successfully, navigating to CsuTestingChecklist3.html');
        if (typeof navigationGuard !== 'undefined') {
            navigationGuard.markPageAsCompleted();
        }
        window.location.href = 'CsuTestingChecklist3.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function clearAll() {
    clearAllSpare();
}

// Attach navigation event listeners
function attachNavigationEventsSpare() {
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