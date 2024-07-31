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
    let games = JSON.parse(getCookie('games')) || [];
    const gameRecordsTableBody = document.getElementById('game-records-table').querySelector('tbody');
    
    games.forEach(game => {
        
            game.records.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestRecord = game.records[0];

            const row = document.createElement('tr');
            const gameNameCell = document.createElement('td');
            const lastPlayDateCell = document.createElement('td');
            const playTimeCell = document.createElement('td');
            const totalPlayTimeCell = document.createElement('td');
            const gameClearTimeCell = document.createElement('td');

            gameNameCell.textContent = game.name;
            lastPlayDateCell.textContent = latestRecord.date;
            playTimeCell.textContent = latestRecord.playTime;
            totalPlayTimeCell.textContent = game.totalPlayTime;
            gameClearTimeCell.textContent = game.clearTime;

            row.appendChild(gameNameCell);
            row.appendChild(lastPlayDateCell);
            row.appendChild(playTimeCell);
            row.appendChild(totalPlayTimeCell);
            row.appendChild(gameClearTimeCell);
            gameRecordsTableBody.appendChild(row);
            
        }
    );
});


document.addEventListener('DOMContentLoaded', function() {
    let games = JSON.parse(getCookie('games')) || [];
    const addGameForm = document.getElementById('play-newreport-form');
    if (addGameForm) {
        addGameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const newGameName = document.getElementById('newgame-name').value;
            const clearTime = document.getElementById('clear-time').value;

            // 新しいゲームがCookieにない場合に，入力されたゲーム情報をCookieに保存。
            if (!games.some(game => game.name === newGameName)) {
                games.push({ name: newGameName, clearTime: clearTime, totalPlayTime: 0, records: [] });
                setCookie('games', JSON.stringify(games), 7);
                alert('新しいゲームが追加されました！');
            } else {
                alert('このゲームは既に存在します！');
            }
            addGameForm.reset();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const editGameForm = document.getElementById('game-report-form');
    let games = JSON.parse(getCookie('games')) || [];
    if (editGameForm) {
        const gameSelect = document.getElementById('select-game');
        
        // ゲーム選択肢を生成
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.name;
            option.textContent = game.name;
            gameSelect.appendChild(option);
        });
        
        editGameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedGameName = gameSelect.value;
            const date = document.getElementById('date').value;
            const playTime = parseFloat(document.getElementById('play-time').value);

            const gameIndex = games.findIndex(game => game.name === selectedGameName);
            if (gameIndex !== -1) {
                // 総プレイ時間に新しいプレイ時間を加算
                games[gameIndex].totalPlayTime += playTime;
                games[gameIndex].records.push({ date, playTime });

                // 更新されたデータをCookieに保存
                setCookie('games', JSON.stringify(games), 7);
                alert('ゲーム情報が更新されました！');
            } else {
                alert('選択されたゲームが見つかりません！');
            }
            editGameForm.reset();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let games = JSON.parse(getCookie('games')) || [];
    
    const selectGameDelete = document.getElementById('select-game-delete');
    if (selectGameDelete) {
        // ゲーム選択肢を生成
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.name;
            option.textContent = game.name;
            selectGameDelete.appendChild(option);
        });

        const deleteGameForm = document.getElementById('delete-game-form');
        deleteGameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedGameName = selectGameDelete.value;
            games = games.filter(game => game.name !== selectedGameName);
            setCookie('games', JSON.stringify(games), 7);
            alert('ゲーム情報が削除されました！');

            // ページをリロードして最新の情報を表示
            location.reload();
        });
    }
});
