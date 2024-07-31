// Cookieの値を設定する関数
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}
// Cookieの値を取得する関数
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

// Cookieの値を削除する関数
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}



document.addEventListener('DOMContentLoaded', function() {
    const selectGameChart = document.getElementById('select-game-chart');
    const playTimeChartElement = document.getElementById('playTimeChart').getContext('2d');
    let chartInstance;

    // Cookieからゲームデータを取得
    let games = JSON.parse(getCookie('games')) || [];

    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.name;
        option.textContent = game.name;
        selectGameChart.appendChild(option);
    });

    function drawChart(gameName) {
        const selectedGame = games.find(game => game.name === gameName);
        if (selectedGame) {
            const playTimeData = {};
            selectedGame.records.forEach(record => {
                if (!playTimeData[record.date]) {
                    playTimeData[record.date] = 0;
                }
                playTimeData[record.date] += parseFloat(record.playTime);
            });

            const labels = Object.keys(playTimeData).sort();
            const data = labels.map(date => playTimeData[date]);

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(playTimeChartElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'プレイ時間 (時間)',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '日付'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'プレイ時間 (時間)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    selectGameChart.addEventListener('change', function() {
        drawChart(this.value);
    });

    if (games.length > 0) {
        selectGameChart.value = games[0].name;
        drawChart(games[0].name);
    }
});
