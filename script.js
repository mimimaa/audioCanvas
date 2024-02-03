let canvas;
let context;
let container;

let audioSource;
let analyzer;

let bufferLen;
let dataArr;
let barWidth;
let barHeight;

let x;
let audioContext = new AudioContext();

function resize(){
    let box = canvas.getBoundingClientRect();
    canvas.width = box.width;
    canvas.height = box.height;
}

function drawVisualizer(){
    barWidth = 15;
    x = 0;
    for (let i = 0; i < bufferLen; i++){
        barHeight = dataArr[i] * 1.5;
        context.save();
        context.translate(canvas.width/2, canvas.height/2);
        context.rotate(i * Math.PI * 8 / bufferLen);
        let hue = i *1.2;
        context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        context.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        context.restore();
    }
    /* for (let i = 0; i < bufferLen; i++){
        barHeight = dataArr[i];
        let red = i * 7;
        let green = i * barHeight/5;
        let blue = barHeight;
        context.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        context.fillRect(x, (canvas.height - barHeight)/2, barWidth, barHeight);
        x += barWidth;
    } */
}

function render(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    analyzer.getByteFrequencyData(dataArr);

    //visualize the sound
    drawVisualizer();
    requestAnimationFrame(render);
}

function main(){
    container = document.getElementById('container');
    canvas = document.getElementById('canvas1');
    context = canvas.getContext('2d');
    let files = document.getElementById('fileupload');

    resize();
    window.addEventListener('resize', resize);

    container.addEventListener('click', function(){
        //let audio1 = new Audio();
        //audio1.src = 'explosion.wav';
        let audio1 = document.getElementById('audio1');
        audio1.src = 'sound1.mp3';

        let audioContext = new AudioContext();
        audio1.play();
        audioSource = audioContext.createMediaElementSource(audio1);
        analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 512;
        bufferLen = analyzer.frequencyBinCount;
        dataArr = new Uint8Array(bufferLen);
     
        render();
    });

    files.addEventListener('change', function(){
        let files = this.files;
        let audio1 = document.getElementById('audio1');
        audio1.src = URL.createObjectURL(files[0]);
        audio1.load();
        audio1.play();
        
        audioSource = audioContext.createMediaElementSource(audio1);
        analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 32;
        bufferLen = analyzer.frequencyBinCount;
        dataArr = new Uint8Array(bufferLen);

        render();
    });
}

window.addEventListener('load', main);
