
document.addEventListener('DOMContentLoaded', function() {
    
    initAnimations();
    
    
    if (document.getElementById('trackingForm')) {
        initTrackingForm();
    }
    
  
    if (document.getElementById('shipmentsTable')) {
        initDashboard();
    }
    
    if (document.getElementById('managerDashboard')) {
        initManagerDashboard();
    }
});


function initAnimations() {

    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .dashboard-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initTrackingForm() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const trackingNumber = document.getElementById('trackingNumber').value;
            
       
            trackingResult.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Tracking your shipment...</p>
                </div>
            `;
            trackingResult.classList.remove('d-none');
            
          
            setTimeout(() => {
                displayTrackingResult(trackingNumber);
            }, 1500);
        });
    }
}


function displayTrackingResult(trackingNumber) {
    const trackingResult = document.getElementById('trackingResult');
    
    
    const trackingData = {
        number: trackingNumber,
        status: 'In Transit',
        origin: 'New York, USA',
        destination: 'London, UK',
        estimatedDelivery: '2023-06-15',
        weight: '5.2 kg',
        dimensions: '30x20x15 cm',
        history: [
            { date: '2023-06-10 08:30', location: 'New York Facility', status: 'Package received' },
            { date: '2023-06-11 14:15', location: 'New York Sorting Center', status: 'Package processed' },
            { date: '2023-06-12 09:45', location: 'JFK International Airport', status: 'Departed facility' },
            { date: '2023-06-13 16:20', location: 'Heathrow Airport', status: 'Arrived at destination country' },
            { date: '2023-06-14 11:30', location: 'London Sorting Center', status: 'Out for delivery' }
        ]
    };
    
    let statusClass = 'bg-warning';
    if (trackingData.status === 'Delivered') statusClass = 'bg-success';
    else if (trackingData.status === 'Pending') statusClass = 'bg-secondary';
    
    let timelineHTML = '';
    trackingData.history.forEach((item, index) => {
        const isActive = index === trackingData.history.length - 1;
        const isCompleted = index < trackingData.history.length - 1;
        
        let itemClass = 'timeline-item';
        if (isCompleted) itemClass += ' completed';
        if (isActive) itemClass += ' active';
        
        timelineHTML += `
            <div class="${itemClass}">
                <h5>${item.status}</h5>
                <p class="mb-1">${item.location}</p>
                <small class="text-muted">${item.date}</small>
            </div>
        `;
    });
    
    trackingResult.innerHTML = `
        <div class="tracking-status animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Tracking #${trackingData.number}</h3>
                <span class="badge ${statusClass} p-2">${trackingData.status}</span>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <h5>Shipment Details</h5>
                    <p><strong>Origin:</strong> ${trackingData.origin}</p>
                    <p><strong>Destination:</strong> ${trackingData.destination}</p>
                </div>
                <div class="col-md-6">
                    <h5>Package Information</h5>
                    <p><strong>Estimated Delivery:</strong> ${trackingData.estimatedDelivery}</p>
                    <p><strong>Weight:</strong> ${trackingData.weight}</p>
                    <p><strong>Dimensions:</strong> ${trackingData.dimensions}</p>
                </div>
            </div>
            
            <h5 class="mb-3">Shipment History</h5>
            <div class="status-timeline">
                ${timelineHTML}
            </div>
        </div>
    `;
}


function initDashboard() {
    
    const dashboardData = {
        totalShipments: 1247,
        delivered: 1189,
        inTransit: 45,
        pending: 13,
        recentShipments: [
            { id: 'TRK001234', origin: 'New York', destination: 'London', status: 'Delivered', lastUpdate: '2023-06-10' },
            { id: 'TRK001235', origin: 'Tokyo', destination: 'Sydney', status: 'In Transit', lastUpdate: '2023-06-11' },
            { id: 'TRK001236', origin: 'Berlin', destination: 'Paris', status: 'In Transit', lastUpdate: '2023-06-11' },
            { id: 'TRK001237', origin: 'Mumbai', destination: 'Dubai', status: 'Pending', lastUpdate: '2023-06-12' },
            { id: 'TRK001238', origin: 'São Paulo', destination: 'Mexico City', status: 'Delivered', lastUpdate: '2023-06-12' }
        ]
    };
    
    // Update dashboard stats
    document.getElementById('totalShipments').textContent = dashboardData.totalShipments.toLocaleString();
    document.getElementById('delivered').textContent = dashboardData.delivered.toLocaleString();
    document.getElementById('inTransit').textContent = dashboardData.inTransit.toLocaleString();
    document.getElementById('pending').textContent = dashboardData.pending.toLocaleString();
    
    // Populate shipments table
    const tableBody = document.querySelector('#shipmentsTable tbody');
    tableBody.innerHTML = '';
    
    dashboardData.recentShipments.forEach(shipment => {
        let statusClass = 'bg-warning';
        if (shipment.status === 'Delivered') statusClass = 'bg-success';
        else if (shipment.status === 'Pending') statusClass = 'bg-secondary';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shipment.id}</td>
            <td>${shipment.origin}</td>
            <td>${shipment.destination}</td>
            <td><span class="badge ${statusClass}">${shipment.status}</span></td>
            <td>${shipment.lastUpdate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-shipment" data-id="${shipment.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-shipment').forEach(button => {
        button.addEventListener('click', function() {
            const shipmentId = this.getAttribute('data-id');
            alert(`Viewing details for shipment: ${shipmentId}`);
            // In a real app, this would open a modal or navigate to a detail page
        });
    });
}


function initManagerDashboard() {

    const managerData = {
        performance: {
            onTimeDelivery: 98.5,
            customerSatisfaction: 4.7,
            operationalEfficiency: 92.3
        },
        teamPerformance: [
            { name: 'John Smith', completed: 124, efficiency: 95.2 },
            { name: 'Sarah Johnson', completed: 118, efficiency: 93.8 },
            { name: 'Michael Brown', completed: 132, efficiency: 96.5 },
            { name: 'Emily Davis', completed: 109, efficiency: 91.7 }
        ]
    };
    
   
    document.getElementById('onTimeDelivery').textContent = `${managerData.performance.onTimeDelivery}%`;
    document.getElementById('customerSatisfaction').textContent = `${managerData.performance.customerSatisfaction}/5`;
    document.getElementById('operationalEfficiency').textContent = `${managerData.performance.operationalEfficiency}%`;
    
    const teamTableBody = document.querySelector('#teamPerformance tbody');
    teamTableBody.innerHTML = '';
    
    managerData.teamPerformance.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.completed}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${member.efficiency}%">
                        ${member.efficiency}%
                    </div>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-chart-line"></i> Details
                </button>
            </td>
        `;
        teamTableBody.appendChild(row);
    });


    

    initCharts();
}

function initCharts() {
    console.log('Charts would be initialized here with a charting library');
}








