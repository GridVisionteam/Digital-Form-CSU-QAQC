// Initialize with empty data structures
if (!window.csuTestingChecklistResults) window.csuTestingChecklistResults = {
    lbs1: [],
    lbs2: [],
    lbs3: []
};

// Data definitions
const LBS1_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:3", Description: "LBS 1 Breaker Indication", IOA: "2", Status: "Open" },
    { No: "2", IOModuleCard: "XZ1D:4", Description: "LBS 1 Breaker Indication", IOA: "2", Status: "Close" },
    { No: "3", IOModuleCard: "XZ1D:18", Description: "LBS 1 Supervisory", IOA: "102", Status: "On" },
    { No: "4", IOModuleCard: "XZ1D:19", Description: "LBS 1 Earth Switch", IOA: "103", Status: "On" },
    { No: "5", IOModuleCard: "XZ1K:3", Description: "LBS 1 Breaker Control", IOA: "1002", Status: "Open" },
    { No: "6", IOModuleCard: "XZ1K:4", Description: "LBS 1 Breaker Control", IOA: "1002", Status: "Close" },
    { No: "7", IOModuleCard: "XZ1D:20", Description: "EFI 1", IOA: "104", Status: "On" }
];

const LBS2_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:5", Description: "LBS 2 Breaker Indication", IOA: "3", Status: "Open" },
    { No: "2", IOModuleCard: "XZ1D:6", Description: "LBS 2 Breaker Indication", IOA: "3", Status: "Close" },
    { No: "3", IOModuleCard: "XZ1D:21", Description: "LBS 2 Supervisory", IOA: "105", Status: "On" },
    { No: "4", IOModuleCard: "XZ1D:22", Description: "LBS 2 Earth Switch", IOA: "106", Status: "On" },
    { No: "5", IOModuleCard: "XZ1K:5", Description: "LBS 2 Breaker Control", IOA: "1003", Status: "Open" },
    { No: "6", IOModuleCard: "XZ1K:6", Description: "LBS 2 Breaker Control", IOA: "1003", Status: "Close" },
    { No: "7", IOModuleCard: "XZ1D:23", Description: "EFI 2", IOA: "107", Status: "On" }
];

const LBS3_ITEMS = [
    { No: "1", IOModuleCard: "XZ1D:7", Description: "LBS 3 Breaker Indication", IOA: "4", Status: "Open" },
    { No: "2", IOModuleCard: "XZ1D:8", Description: "LBS 3 Breaker Indication", IOA: "4", Status: "Close" },
    { No: "3", IOModuleCard: "XZ1D:24", Description: "LBS 3 Supervisory", IOA: "108", Status: "On" },
    { No: "4", IOModuleCard: "XZ1D:25", Description: "LBS 3 Earth Switch", IOA: "109", Status: "On" },
    { No: "5", IOModuleCard: "XZ1K:7", Description: "LBS 3 Breaker Control", IOA: "1004", Status: "Open" },
    { No: "6", IOModuleCard: "XZ1K:8", Description: "LBS 3 Breaker Control", IOA: "1004", Status: "Close" },
    { No: "7", IOModuleCard: "XZ1D:26", Description: "EFI 2 (SPARE)", IOA: "110", Status: "On" }
];

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('csuTestingChecklistResults');
    if (savedResults) {
        try {
            window.csuTestingChecklistResults = JSON.parse(savedResults);
            if (!window.csuTestingChecklistResults.lbs2) {
                window.csuTestingChecklistResults.lbs2 = [];
            }
            if (!window.csuTestingChecklistResults.lbs3) {
                window.csuTestingChecklistResults.lbs3 = [];
            }
        } catch (e) {
            console.error('Error parsing saved data:', e);
        }
    }

    // Generate rows for each table
    generateTableRows('LBS1Tbody', LBS1_ITEMS, 'lbs1', false);
    generateTableRows('LBS2Tbody', LBS2_ITEMS, 'lbs2', true);
    generateTableRows('LBS3Tbody', LBS3_ITEMS, 'lbs3', true);

    // Load any saved data
    loadPreRequisiteTestData();

    // Attach event listeners to navigation buttons
    attachNavigationEvents();

    // Setup input validation for Remote/Supervisory fields
    setupInputValidation();
});

// Function to setup input validation for Remote/Supervisory fields
function setupInputValidation() {
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

// Function to generate table rows for any table
function generateTableRows(tbodyId, items, dataKey, isLbs2Or3 = false) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const savedArray = dataKey === 'lbs3' 
        ? (window.csuTestingChecklistResults.lbs3 || [])
        : dataKey === 'lbs2'
            ? (window.csuTestingChecklistResults.lbs2 || [])
            : (window.csuTestingChecklistResults.lbs1 || []);

    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const saved = (savedArray && savedArray[index]) ? savedArray[index] : {};
        const row = document.createElement('tr');
        
        // Check if this is an EFI row (has AC/DC inputs)
        const isEfi = item.Description && item.Description.includes('EFI');
        let descriptionContent;
        
        if (isEfi) {
            const acValue = saved.acValue || '';
            const dcValue = saved.dcValue || '';
            descriptionContent = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 2px;">
                    <span style="font-size: 16px;">${item.Description}</span>
                    <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap; justify-content: center;">
                        <span style="font-size: 14px;">AC:</span>
                        <input type="number" disabled name="${dataKey}_ac_${index}" value="${acValue}" 
                               style="width: 50px; padding: 2px 4px; border: 2px solid #000; font-weight: bold; text-align: center;" 
                               placeholder="0" />
                        <span style="font-size: 14px;">DC:</span>
                        <input type="number" disabled name="${dataKey}_dc_${index}" value="${dcValue}" 
                               style="width: 50px; padding: 2px 4px; border: 2px solid #000; font-weight: bold; text-align: center;" 
                               placeholder="0" />
                    </div>
                </div>
            `;
        } else {
            descriptionContent = item.Description;
        }
        
        // Get saved remote and supervisory values, convert "N/A" back to "-" for display
        const remoteValue = saved.remote === 'N/A' ? '-' : (saved.remote || '');
        const supervisoryValue = saved.supervisory === 'N/A' ? '-' : (saved.supervisory || '');
        
        row.innerHTML = `
            <td style="text-align: center;">${item.No}</td>
            <td style="text-align: center;">${item.IOModuleCard}</td>
            <td style="text-align: center;">${descriptionContent}</td>
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

// Save pre-requisite test data
function savePreRequisiteTestData() {
    console.log('Saving CSU Testing Checklist data...');
    
    if (!window.csuTestingChecklistResults) {
        window.csuTestingChecklistResults = {
            lbs1: [],
            lbs2: [],
            lbs3: []
        };
    }

    // Clear arrays before saving new data
    window.csuTestingChecklistResults.lbs1 = [];
    window.csuTestingChecklistResults.lbs2 = [];
    window.csuTestingChecklistResults.lbs3 = [];

    // Save LBS 1 data
    saveTableData('LBS1Tbody', 'lbs1', window.csuTestingChecklistResults.lbs1);
    
    // Save LBS 2 data
    saveTableData('LBS2Tbody', 'lbs2', window.csuTestingChecklistResults.lbs2);

    // Save LBS 3 data
    saveTableData('LBS3Tbody', 'lbs3', window.csuTestingChecklistResults.lbs3);

    // Save to localStorage with unique key
    try {
        localStorage.setItem('csuTestingChecklistResults', JSON.stringify(window.csuTestingChecklistResults));
        console.log('Data saved successfully:', window.csuTestingChecklistResults);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Helper function to save data from a specific table
function saveTableData(tbodyId, dataKey, targetArray) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        
        // Check for AC/DC inputs (EFI rows)
        const acInput = row.querySelector(`input[name="${dataKey}_ac_${index}"]`);
        const dcInput = row.querySelector(`input[name="${dataKey}_dc_${index}"]`);
        let description = cells[2] ? cells[2].textContent.trim() : '';
        let acValue = '';
        let dcValue = '';
        
        if (acInput && dcInput) {
            acValue = acInput.value;
            dcValue = dcInput.value;
        }
        
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
            supervisory: supervisoryValue || null,
            acValue: acValue || null,
            dcValue: dcValue || null
        });
    });
}

// Load pre-requisite test data
function loadPreRequisiteTestData() {
    console.log('Data loaded from localStorage:', window.csuTestingChecklistResults);
}

// ============================================================
// CLEAR ALL FUNCTION
// ============================================================
function clearAllCSU() {
    // Clear all Remote and Supervisory text inputs in all tables
    const textInputs = document.querySelectorAll('#LBS1Tbody input[type="text"], #LBS2Tbody input[type="text"], #LBS3Tbody input[type="text"]');
    textInputs.forEach(input => {
        if (input.name && (input.name.includes('remote') || input.name.includes('supervisory'))) {
            input.value = '';
            input.dataset.previousValue = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    // Also clear any AC/DC input fields (EFI rows)
    const numberInputs = document.querySelectorAll('#LBS1Tbody input[type="number"], #LBS2Tbody input[type="number"], #LBS3Tbody input[type="number"]');
    numberInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// ============================================================
// CONFIRMATION WRAPPER
// ============================================================
function clearAllCSUWithConfirm() {
    if (confirm("⚠️ WARNING: This will clear ALL test data for the CSU Testing Checklist.\n\nThis includes:\n- All Remote and Supervisory text fields for LBS 1, LBS 2 & LBS 3\n- All AC/DC input values (EFI rows)\n\nThis action CANNOT be undone.\n\nAre you sure you want to continue?")) {
        clearAllCSU();
        alert("All data has been cleared.");
    }
}

// Navigation functions
function goToPreviousPage() {
    console.log('Going to previous page...');

    if (!savePreRequisiteTestData()) {
        alert('Error saving data. Please try again.');
        return;
    }

    const mode = localStorage.getItem('scadaMode') === 'ready' ? 'ready' : 'equipped';
    const prevPage = (mode === 'ready') ? 'RTUPowerUp.html' : 'Dummy&CESFunctionalTest.html';

    console.log('CSU Checklist → previous page (' + mode + ' mode):', prevPage);
    window.location.href = prevPage;
}

function goToNext() {
    console.log('Going to next page...');

    if (!savePreRequisiteTestData()) {
        alert('Error saving data. Please try again.');
        return;
    }

    const mode = localStorage.getItem('scadaMode') === 'ready' ? 'ready' : 'equipped';
    const nextPage = (mode === 'ready') ? 'CsuTestingChecklist_SCADA_READY.html' : 'CsuTestingChecklist2.html';

    console.log('CSU Checklist → next page (' + mode + ' mode):', nextPage);

    if (typeof navigationGuard !== 'undefined') {
        navigationGuard.markPageAsCompleted();
    }
    window.location.href = nextPage;
}

function clearAll() {
    clearAllCSU();
}

// Function to attach navigation event listeners
function attachNavigationEvents() {
    // Attach to Previous button
    const prevBtn = document.querySelector('button[onclick*="previous"], button[onclick*="Previous"], #prevBtn, .prev-btn');
    if (prevBtn) {
        prevBtn.onclick = null;
        prevBtn.addEventListener('click', goToPreviousPage);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('previous') || 
                btn.textContent.toLowerCase().includes('back')) {
                btn.onclick = null;
                btn.addEventListener('click', goToPreviousPage);
            }
        });
    }

    // Attach to Next button
    const nextBtn = document.querySelector('button[onclick*="next"], button[onclick*="Next"], #nextBtn, .next-btn');
    if (nextBtn) {
        nextBtn.onclick = null;
        nextBtn.addEventListener('click', goToNext);
    } else {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('next') || 
                btn.textContent.toLowerCase().includes('continue')) {
                btn.onclick = null;
                btn.addEventListener('click', goToNext);
            }
        });
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const onclickAttr = e.target.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('goToPreviousPage')) {
                e.preventDefault();
                e.target.onclick = null;
                goToPreviousPage();
            } else if (onclickAttr && onclickAttr.includes('goToNext')) {
                e.preventDefault();
                e.target.onclick = null;
                goToNext();
            }
        }
    });
}