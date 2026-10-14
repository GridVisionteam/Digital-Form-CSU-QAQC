// Initialize with empty data structures
if (!window.dipSwitchTestResults) window.dipSwitchTestResults = {
    dipSwitch: []
};

// Data definitions for DIP Switch Setting — ONLY ITEM 1 REMAINS
const DIP_SWITCH_ITEMS = [
    { No: "1", Description: "EARTH FAULT INDICATOR : EMG / EASI-R", SwitchNumber: "1" }
];

// Alias function for keyboard shortcut compatibility
function savePreRequisiteTestData() {
    return saveDipSwitchData();
}

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('dipSwitchTestResults');
    if (savedResults) {
        try {
            window.dipSwitchTestResults = JSON.parse(savedResults);
            if (!window.dipSwitchTestResults.dipSwitch) {
                window.dipSwitchTestResults.dipSwitch = [];
            }
        } catch (e) {
            console.error('Error parsing saved data:', e);
        }
    }

    // Generate rows for the table
    generateTableRows('CHECKLIST', DIP_SWITCH_ITEMS, 'dipSwitch');

    // Load any saved data
    loadDipSwitchTestData();

    // Attach event listeners to navigation buttons
    attachNavigationEventsDIP();
});

// Function to attach navigation event listeners
function attachNavigationEventsDIP() {
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

// Function to generate table rows
function generateTableRows(tbodyId, items, dataKey) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const savedArray = window.dipSwitchTestResults[dataKey] || [];

    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const saved = (savedArray && savedArray[index]) ? savedArray[index] : {};
        const row = document.createElement('tr');
        
        const descriptionContent = item.Description;
        const switchNumber = item.SwitchNumber;
        
        const remoteChecked = saved.remote ? 'checked' : '';
        
        // Create image HTML based on switch number
        let imageHtml = '';
        if (switchNumber === "1") {
            imageHtml = `<img src="images/DIP_Switch_ EMG-EASI-R.png" alt="Switch 1" style="width: 300px; height: auto;" />`;
        } else {
            // Fallback to text if image not available
            imageHtml = switchNumber;
        }
        
        row.innerHTML = `
            <td style="text-align: center;">${item.No}</td>
            <td style="text-align: center;">${descriptionContent}</td>
            <td style="text-align: center;">${imageHtml}</td>
            <td style="text-align: center;"><input type="checkbox" name="${dataKey}_remote_${index}" ${remoteChecked} disabled /></td>
        `;
        tbody.appendChild(row);
    });
}

// Save DIP Switch test data
function saveDipSwitchData() {
    console.log('Saving DIP Switch test data...');
    
    if (!window.dipSwitchTestResults) {
        window.dipSwitchTestResults = {
            dipSwitch: []
        };
    }

    // Clear array before saving new data
    window.dipSwitchTestResults.dipSwitch = [];

    // Save table data
    saveTableData('CHECKLIST', 'dipSwitch', window.dipSwitchTestResults.dipSwitch);

    // Save to localStorage
    try {
        localStorage.setItem('dipSwitchTestResults', JSON.stringify(window.dipSwitchTestResults));
        console.log('Data saved successfully:', window.dipSwitchTestResults);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Helper function to save data from the table
function saveTableData(tbodyId, dataKey, targetArray) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        
        // Get description from the cell
        const description = cells[1] ? cells[1].textContent.trim() : '';
        const switchNumber = cells[2] ? cells[2].textContent.trim() : '';
        
        // Get remote checkbox value
        const remoteCheckbox = row.querySelector(`input[name="${dataKey}_remote_${index}"]`);
        const isRemoteChecked = remoteCheckbox ? remoteCheckbox.checked : false;
        
        targetArray.push({
            Description: description,
            SwitchNumber: switchNumber,
            remote: isRemoteChecked
        });
    });
}

// Load DIP Switch test data
function loadDipSwitchTestData() {
    console.log('Data loaded from localStorage for DIP Switch:', window.dipSwitchTestResults);
}

// ============================================================
// CLEAR ALL FUNCTION
// ============================================================
function clearAllCSU3() {
    const checkboxes = document.querySelectorAll('#CHECKLIST input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

// ============================================================
// CONFIRMATION WRAPPER
// ============================================================
function clearAllCSU3WithConfirm() {
    if (confirm("⚠️ WARNING: This will clear ALL test data for the DIP Switch Setting.\n\nThis includes:\n- All Result checkbox selections\n\nThis action CANNOT be undone.\n\nAre you sure you want to continue?")) {
        clearAllCSU3();
        alert("All data has been cleared.");
    }
}

// ============================================================
// NAVIGATION FUNCTIONS - ALL VALIDATION REMOVED
// ============================================================
function goToPreviousPage() {
    console.log('Going to previous page from DIP Switch Setting...');

    if (!saveDipSwitchData()) {
        alert('Error saving data. Please try again.');
        return;
    }

    const mode = localStorage.getItem('scadaMode') === 'ready' ? 'ready' : 'equipped';
    const prevPage = (mode === 'ready')
        ? 'CsuTestingChecklist_SCADA_READY.html'
        : 'CsuTestingChecklist3.html';

    console.log('DIP Switch Setting → previous page (' + mode + ' mode):', prevPage);
    window.location.href = prevPage;
}

function goToNext() {
    if (!saveDipSwitchData()) {
        alert('Error saving data. Please try again.');
        return;
    }

    const mode = localStorage.getItem('scadaMode') === 'ready' ? 'ready' : 'equipped';
    const nextPage = (mode === 'ready') ? 'generatePDF.html' : 'VirtualAlarmTest.html';

    localStorage.setItem('DIP Switch Setting.html_completed', 'true');
    window.location.href = nextPage;
}

function clearAll3() {
    clearAllCSU3();
}