const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");

let interval;



async function loadModel() {
    const model = await tflite.ObjectDetector.create(
        "lite-model_efficientdet_lite0_detection_metadata_1.tflite"
    )
    
    // let results = model.detect(img);
    
    return await model;

}

playBtn.addEventListener("click", () => {    
    video.play();
    
});

pauseBtn.addEventListener("click", () => {
    video.pause();
});

const loadedModel = loadModel();
// console.log(model)
video.addEventListener('play', async () => {
    const canvas = document.querySelector("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(video.videoHeight, video.videoWidth)
    const ctx = canvas.getContext("2d");
    interval = setInterval(() => {
        ctx.drawImage(video, 0, 0);
        loadedModel.then((model) => {
            let results = model.detect(video);
            for (const result of results) {
                const prob = result.classes[0].probability;
                if (prob >= 0.6) {
                    const cls = result.classes[0].className
                    let originX =  result.boundingBox.originX;
                    let originY =  result.boundingBox.originY;
                    let width = result.boundingBox.width;
                    let height = result.boundingBox.height;

                    // Bounding box rectangle
                    ctx.lineWidth = 4;            
                    ctx.strokeStyle='#0F0';
                    ctx.strokeRect(originX, originY, width, height)

                    // Label box rectangle
                    ctx.fillStyle = '#0B0';
                    ctx.font = "16px sans-serif";
                    ctx.textBaseline = "top";
                    const label = `${cls} ${Math.round(prob * 100)}%`
                    const textWidth = ctx.measureText(label).width;
                    const textHeight = 16;
                    const textPad = 4;
                    ctx.fillRect(
                        originX, 
                        originY, 
                        textWidth + textPad, 
                        textHeight + textPad
                        )
                    ctx.fillStyle = '#000000';
                    ctx.fillText(label, originX, originY)
                }
            }
        })
    })
})

video.addEventListener("pause", () => {
    clearInterval(interval);
});