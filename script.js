// let objectDetector;

// async function detect() {
//     if (!objectDetector) {
//         objectDetector = await tflite.objectDetector.create(
//             "https://storage.googleapis.com/tfhub-lite-models/tensorflow/lite-model/ssd_mobilenet_v1/1/metadata/2.tflite",
//             { maxResults: 2}
//         );
//     }
//     const result = objectDetector.detect(document.querySelector("img"));

//     const boundingBox = result[0]
//     console.log(boundingBox);
// }

// detect()

const img = document.querySelector('img');
const MODEL_SIZE = [320, 320]

// async function start() {
//     // Load the model
//     const tfliteModel = await tflite.loadTFLiteModel(
//         "lite-model_efficientdet_lite0_detection_metadata_1.tflite"
//         // "https://storage.googleapis.com/tfhub-lite-models/tensorflow/lite-model/ssd_mobilenet_v1/1/metadata/2.tflite"
//     )
//     let results = await tfliteModel.predict(input);
//     // for (const result of results) {
//     //     console.log(result)
//     // }
//     console.log(await results)
    
// }

// const imgTensor = tf.browser.fromPixels(img);
// // const readyfied = tf.expandDims(imgTensor, 0)
// //                     .resize(imgTensor, [300, 300]);
// const input = tf.image.resizeBilinear(
//     imgTensor,
//     MODEL_SIZE,
//     true
//     ).div(255).expandDims(0).asType('int32')
    
// // console.log(readyfied.shape)

// // Run inference

// start();

// tflite.ObjectDetector.create(
//     "lite-model_efficientdet_lite0_detection_metadata_1.tflite"
// ).then((model) => {
//     console.log(model)
// })
const detectionCanvas = document.querySelector('canvas');
const ctx = detectionCanvas.getContext('2d')
detectionCanvas.width = img.width;
detectionCanvas.height = img.height;
console.log(img.width, img.height)
async function start() {
    const model = await tflite.ObjectDetector.create(
        "lite-model_efficientdet_lite0_detection_metadata_1.tflite"
    )
    
    let results = model.detect(img);
    
    return results

}

// results = await start();
// console.log(results)
model = start();
ctx.drawImage(img, 0, 0)
// const data = ctx.getImageData(0, 0, 640, 640).data
// console.log(data)
model.then((results) => {
    for (const res of results) {
        const prob = res.classes[0].probability
        if (prob >= 0.6) {
            const cls = res.classes[0].className
            let originX =  res.boundingBox.originX;
            let originY =  res.boundingBox.originY;
            let width = res.boundingBox.width;
            let height = res.boundingBox.height;

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


