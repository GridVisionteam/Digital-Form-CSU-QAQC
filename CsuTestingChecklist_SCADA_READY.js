// CsuTestingChecklist3.js - JSON saves only FT_R_{1-9} keys (ALL INPUTS DISABLED)

// Initialize with empty data structures
if (!window.csuTestingChecklist3Results) window.csuTestingChecklist3Results = {};

// Data definitions for Checklist 3
const CHECKLIST_ITEMS = [
    { No: "1", Description: "Panel Light & Door Switch" },
    { No: "2", Description: "Switch Socket" },
    { No: "3", Description: "Heater" },
    { No: "4", Description: "Batery Charge Cover" },
    { No: "5", Description: "Battery Charge Sticker" },
    { No: "6", Description: "Battery Charger Reset <b>*Reset alarm and MCU processor only</b>" },
    { No: "7", Description: "AC Reading", inputType: "number" },
    { No: "8", Description: "DC Voltage Reading <b>*Without AC Input, Acceptance Criteria: 25.4 VDC and Above</b>", inputType: "number" }
];

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('csuTestingChecklist3Results');
    if (savedResults) {
        try {
            window.csuTestingChecklist3Results = JSON.parse(savedResults);
        } catch (e) {
            console.error('Error parsing saved data:', e);
        }
    }

    // Generate rows for the table
    generateTableRows('CHECKLIST', CHECKLIST_ITEMS, 'checklist3');

    // Load any saved data - THIS POPULATES THE FIELDS
    loadCSU3Data();

    // Attach event listeners to navigation buttons
    attachNavigationEvents3();

    // Disable all inputs (safety pass)
    disableAllChecklist3Inputs();
});

// Function to generate table rows
function generateTableRows(tbodyId, items, dataKey) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const descriptionContent = item.Description;
        const inputType = item.inputType || 'text';
        const isNumberInput = inputType === 'number';
        
        // JSON key format: FT_R_1, FT_R_2, ... FT_R_9
        const jsonKey = `FT_R_${index + 1}`;
        
        // Get saved value from JSON using FT_R_{n} key
        let savedValue = window.csuTestingChecklist3Results[jsonKey] || '';
        
        let testResultValue = savedValue;
        
        let testResultHTML = '';
        
        if (isNumberInput) {
            // Number input for items 8 & 9 - positive numbers only (DISABLED)
            testResultHTML = `<input type="number" name="${jsonKey}" value="${testResultValue}" 
                               style="width: 80px; text-align: center; border: 2px solid #ccc; font-weight: bold; background-color: #f5f5f5;" 
                               min="0" step="any" disabled readonly />`;
        } else {
            // Text input for items 1-7 - only "/" (DISABLED)
            testResultHTML = `<input type="text" name="${jsonKey}" value="${testResultValue}" 
                               style="width: 60px; text-align: center; border: 2px solid #ccc; font-weight: bold; background-color: #f5f5f5;" 
                               disabled readonly />`;
        }
        
        row.innerHTML = `
            <td style="text-align: center;">${item.No}</td>
            <td style="text-align: center;">${descriptionContent}</td>
            <td style="text-align: center;">${testResultHTML}</td>
        `;
        tbody.appendChild(row);
    });
}

// Safety pass: disable every input inside #CHECKLIST
function disableAllChecklist3Inputs() {
    const inputs = document.querySelectorAll('#CHECKLIST input');
    inputs.forEach(input => {
        input.disabled = true;
        input.readOnly = true;
        input.style.backgroundColor = '#f5f5f5';
        input.style.cursor = 'not-allowed';
    });
}

// ============================================================
// LOAD DATA - POPULATES THE FIELDS FROM SAVED DATA
// ============================================================
function loadCSU3Data() {
    console.log('Loading CSU3 data from window.csuTestingChecklist3Results...');
    
    if (window.csuTestingChecklist3Results && Object.keys(window.csuTestingChecklist3Results).length > 0) {
        console.log('Loading Checklist3 data from FT_R_{1-9} keys');
        populateTableFromData3('CHECKLIST', window.csuTestingChecklist3Results);
    } else {
        console.log('No Checklist3 data found');
    }

    // Re-apply disabled state after population
    disableAllChecklist3Inputs();
}

function populateTableFromData3(tbodyId, dataObject) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error('Table body not found:', tbodyId);
        return;
    }
    
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        const jsonKey = `FT_R_${index + 1}`;
        const savedValue = dataObject[jsonKey];
        
        if (savedValue === undefined || savedValue === null) return;
        
        const numberInput = row.querySelector(`input[type="number"][name="${jsonKey}"]`);
        const textInput = row.querySelector(`input[type="text"][name="${jsonKey}"]`);
        const targetInput = numberInput || textInput;
        
        if (targetInput) {
            let value = savedValue;
            
            targetInput.value = value;
            
            if (numberInput) {
                targetInput.dataset.lastValidValue = value;
            } else {
                targetInput.dataset.previousValue = value;
            }
        }
    });
}

// ============================================================
// NAVIGATION FUNCTIONS (VALIDATION REMOVED)
// ============================================================

function goToPreviousPage3() {
    console.log('Going to previous page from Checklist...');
    
    if (saveCSU3Data()) {
        console.log('Data saved successfully, navigating to CsuTestingChecklist.html');
        window.location.href = 'CsuTestingChecklist.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function goToNext3() {
    console.log('Navigating to next page...');
    
    if (saveCSU3Data()) {
        console.log('Data saved successfully, navigating to DIP Switch Setting.html');
        if (typeof navigationGuard !== 'undefined') {
            navigationGuard.markPageAsCompleted();
        }
        window.location.href = 'DIP Switch Setting.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

// ============================================================
// CLEAR ALL FUNCTION (no-op now since inputs are disabled)
// ============================================================
function clearAllCSU3() {
    document.querySelectorAll('#CHECKLIST input[type="text"]').forEach(input => {
        if (input.name && input.name.startsWith('FT_R_')) {
            input.value = '';
            input.dataset.previousValue = '';
        }
    });
    
    document.querySelectorAll('#CHECKLIST input[type="number"]').forEach(input => {
        if (input.name && input.name.startsWith('FT_R_')) {
            input.value = '';
            input.dataset.lastValidValue = '';
        }
    });
}

function clearAllCSU3WithConfirm() {
    alert("Inputs are disabled. Data cannot be modified on this page.");
}

// ============================================================
// SELECT ALL FUNCTION (no-op now since inputs are disabled)
// ============================================================
function selectAllCSU3() {
    alert("Inputs are disabled. Data cannot be modified on this page.");
}

// ============================================================
// SAVE DATA - Only FT_R_{1-9} keys
// ============================================================
function saveCSU3Data() {
    console.log('Saving CSU Testing Checklist 3 data...');
    
    // Reset object - only FT_R_1 to FT_R_9 keys
    window.csuTestingChecklist3Results = {};
    
    // Collect values from all inputs
    document.querySelectorAll('#CHECKLIST input').forEach(input => {
        if (input.name && input.name.startsWith('FT_R_')) {
            let value = input.value;
            window.csuTestingChecklist3Results[input.name] = value || null;
        }
    });

    // Save to localStorage
    try {
        localStorage.setItem('csuTestingChecklist3Results', JSON.stringify(window.csuTestingChecklist3Results));
        console.log('Data saved successfully:', window.csuTestingChecklist3Results);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Function to attach navigation event listeners
function attachNavigationEvents3() {
    const prevBtn = document.querySelector('button[onclick*="previous"], button[onclick*="Previous"], #prevBtn, .prev-btn');
    if (prevBtn) {
        prevBtn.onclick = null;
        prevBtn.addEventListener('click', goToPreviousPage3);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('previous') || 
                btn.textContent.toLowerCase().includes('back')) {
                btn.onclick = null;
                btn.addEventListener('click', goToPreviousPage3);
            }
        });
    }

    const nextBtn = document.querySelector('button[onclick*="next"], button[onclick*="Next"], #nextBtn, .next-btn');
    if (nextBtn) {
        nextBtn.onclick = null;
        nextBtn.addEventListener('click', goToNext3);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('next') || 
                btn.textContent.toLowerCase().includes('continue')) {
                btn.onclick = null;
                btn.addEventListener('click', goToNext3);
            }
        });
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const onclickAttr = e.target.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('goToPreviousPage3')) {
                e.preventDefault();
                e.target.onclick = null;
                goToPreviousPage3();
            } else if (onclickAttr && onclickAttr.includes('goToNext3')) {
                e.preventDefault();
                e.target.onclick = null;
                goToNext3();
            }
        }
    });
}

// Utility functions for backward compatibility
function SelectAll3() {
    selectAllCSU3();
}

function clearAll3() {
    clearAllCSU3();
}

// Re-apply disabled state on window load as a final safety net
window.addEventListener('load', disableAllChecklist3Inputs);