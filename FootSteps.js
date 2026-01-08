const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.connect(audioContext.destination);

// 100個のソースを管理するためのキャッシュ
const audioSources = new Map();

// すべてのリストアイテム（li）に対してイベントを設定
document.querySelectorAll('.imgliclass').forEach(li => {
    const audio = li.querySelector('audio');

    // ホバーまたはクリックで解析開始
    li.addEventListener('mouseenter', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // このaudio要素がまだAudioContextに接続されていなければ接続する
        if (!audioSources.has(audio)) {
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            audioSources.set(audio, source);
        }

        audio.play();
        startAnalyzing();
    });

    li.addEventListener('mouseleave', () => {
        if (!loopBox.checked) {
            sound.pause();
            sound.currentTime = 0;
        }
    });
});

const dataArray = new Float32Array(analyser.frequencyBinCount);

function startAnalyzing() {
    analyser.getFloatTimeDomainData(dataArray);

    let sumSquares = 0.0;
    for (let i = 0; i < dataArray.length; i++) {
        sumSquares += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    const percent = Math.min(100, rms * 100); // シンプルな%変換例

    // 全体のコンソールか、特定の表示エリアに数値を出す
    console.log(`音量: ${percent.toFixed(1)}%`);

    if (!audioContext.allPaused) { // 全て止まっていない限りループ
        requestAnimationFrame(startAnalyzing);
    }
}



const volumeBar = document.getElementById('volumeBar');
const volumeValue = document.getElementById('volumeValue');

function startAnalyzing() {
    analyser.getFloatTimeDomainData(dataArray);

    let sumSquares = 0.0;
    for (let i = 0; i < dataArray.length; i++) {
        sumSquares += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // 10%を100%にする調整（元のrms * 100 * 25 ＝ rms * 2500）
    let percent = rms * 2500;
    let finalPercent = Math.min(100, percent);

    // --- ここで色と幅を同時に更新 ---
    // 120(緑) から音量が上がるほど 0(赤) に近づける計算
    let hue = 360 - (finalPercent * 3.6);

    volumeBar.style.background = `hsl(${hue}, 80%, 50%)`;
    volumeBar.style.height = finalPercent + '%';
    // ----------------------------

    volumeValue.innerText = Math.round(finalPercent) + '%';

    requestAnimationFrame(startAnalyzing);
}










// IMG と SOUND を配列でまとめる
const items = Array.from({ length: 100 }, (_, i) => {
    const num = i + 1;
    return {
        img: document.getElementById(`IMG${num}`),
        sound: document.getElementById(`SOUND${num}`)
    };
});

const loopBox = document.getElementById('loopBox');

// 共通処理をまとめる
items.forEach(({ img, sound }, index) => {
    if (!img || !sound) return;

    img.addEventListener('mouseover', () => {

        sound.currentTime = 0;
        sound.play()
            .then(() => {
                console.log(`音を再生しました: IMG${index + 1}`);
            })
            .catch(err => {
                console.error(`音の再生に失敗しました: IMG${index + 1}`, err);
            });
    });

    img.addEventListener('mouseout', () => {
        if (!loopBox.checked) {
            sound.pause();
            sound.currentTime = 0;
        }
        sound.loop = false;
        // sound.pause();
        // sound.currentTime = 0;
    });
});



////↓画像サイズ変更コード↓
const targets = document.querySelectorAll('.imgClass');

document.getElementById('btn-large').addEventListener('click', () => {
    targets.forEach(el => {
        el.style.width = '600px';
        el.style.height = 'auto';
    });
});

document.getElementById('btn-medium').addEventListener('click', () => {
    targets.forEach(el => {
        el.style.width = '300px';
        el.style.height = 'auto';
    });
});

document.getElementById('btn-small').addEventListener('click', () => {
    targets.forEach(el => {
        el.style.width = '100px';
        el.style.height = 'auto';
    });
});

document.getElementById('btn-SUPsmall').addEventListener('click', () => {
    targets.forEach(el => {
        el.style.width = '600px';
        el.style.height = '10px';
    });
});


const toggleBtn = document.getElementById('toggleBtn');
const listContainer = document.getElementById('listContainer');

// ボタンクリック時のイベント
toggleBtn.addEventListener('click', () => {
    // 'horizontal' クラスがあれば消し、なければ付ける（トグル）
    listContainer.classList.toggle('horizontal');

    if (listContainer.classList.contains('horizontal')) {
        toggleBtn.textContent = '縦並びにする';
    } else {
        toggleBtn.textContent = '横並びにする';
    }
});








