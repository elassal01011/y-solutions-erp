const ctx = document.getElementById('salesChart');

if(ctx){

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
            label: 'Revenue',
            data: [12000,25000,18000,32000,45000,60000],
            tension:0.4,
            fill:true
        }]
    }
});

}
