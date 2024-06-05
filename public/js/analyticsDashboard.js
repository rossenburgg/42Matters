document.addEventListener('DOMContentLoaded', function() {
    let earningsChart;

    function renderChart(data) {
        const ctx = document.getElementById('earningsChart').getContext('2d');
        if (earningsChart) {
            earningsChart.destroy(); // Destroy existing chart instance
        }
        earningsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Earnings Over Time',
                    data: data.earnings,
                    backgroundColor: 'rgba(29, 185, 84, 0.2)',
                    borderColor: '#1DB954',
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E0E0E0'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E0E0E0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#E0E0E0'
                        }
                    }
                }
            }
        });
    }

    // Fetch analytics data and render chart
    fetch('/api/analytics/data')
        .then(response => response.json())
        .then(data => {
            console.log('Analytics data:', data); // Debug message

            // Check if data is valid before rendering chart
            if (data.labels && data.labels.length > 0 && data.earnings && data.earnings.length > 0) {
                renderChart(data);
            } else {
                console.error('Invalid data format for Chart.js:', data); // Debug message
                toastr.error('Invalid data format for Chart.js');
            }

            // Populate performance metrics table
            const taskMetrics = document.getElementById('taskMetrics');
            if (data.tasks && data.tasks.length > 0) {
                data.tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.description}</td>
                        <td>${task.amountEarned} USDT</td>
                        <td>${task.commission} USDT</td>
                        <td>${task.status}</td>
                    `;
                    taskMetrics.appendChild(row);
                });
            } else {
                console.error('Invalid data format for task metrics:', data); // Debug message
                toastr.error('Invalid data format for task metrics');
            }
        })
        .catch(error => {
            console.error('Error fetching analytics data:', error);
            toastr.error('Failed to load analytics data');
        });
});
