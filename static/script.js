let tempCtx = document.getElementById('tempChart').getContext('2d');
let humidityCtx = document.getElementById('humidityChart').getContext('2d');

let tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: 'red',
            backgroundColor: 'rgba(255,0,0,0.2)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: { y: { min: 0, max: 50 } }
    }
});

let humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity (%)',
            data: [],
            borderColor: 'blue',
            backgroundColor: 'rgba(0,0,255,0.2)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: { y: { min: 0, max: 100 } }
    }
});

let currentCity = "Kolhapur";

async function fetchData(city) {
    let res = await fetch(`/data?city=${city}`);
    let json = await res.json();

    if(json.error) {
        alert("Error fetching data: " + JSON.stringify(json.details));
        return;
    }

    let time = new Date().toLocaleTimeString();

    // Update latest numbers
    document.getElementById('tempValue').textContent = json.temperature;
    document.getElementById('humidityValue').textContent = json.humidity;

    // Temperature chart
    tempChart.data.labels.push(time);
    tempChart.data.datasets[0].data.push(json.temperature);
    if(tempChart.data.labels.length > 10){
        tempChart.data.labels.shift();
        tempChart.data.datasets[0].data.shift();
    }
    tempChart.update();

    // Humidity chart
    humidityChart.data.labels.push(time);
    humidityChart.data.datasets[0].data.push(json.humidity);
    if(humidityChart.data.labels.length > 10){
        humidityChart.data.labels.shift();
        humidityChart.data.datasets[0].data.shift();
    }
    humidityChart.update();
}


// Initial load
fetchData(currentCity);
setInterval(() => fetchData(currentCity), 5000);

// Change city
document.getElementById('fetchBtn').addEventListener('click', () => {
    let city = document.getElementById('cityInput').value.trim();
    if(city){
        currentCity = city;
        fetchData(currentCity);
    }
});
