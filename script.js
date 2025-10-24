const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const blurRange = document.getElementById('blurRange');
const blurValue = document.getElementById('blurValue');
const brightnessRange = document.getElementById('brightnessRange');
const brightnessValue = document.getElementById('brightnessValue');
const contrastRange = document.getElementById('contrastRange');
const contrastValue = document.getElementById('contrastValue');
const saturationRange = document.getElementById('saturationRange');
const saturationValue = document.getElementById('saturationValue');
const rotationRange = document.getElementById('rotationRange');
const rotationValue = document.getElementById('rotationValue');
const blurType = document.getElementById('blurType');
const grayscale = document.getElementById('grayscale');
const invert = document.getElementById('invert');
const sepia = document.getElementById('sepia');
const imageCanvas = document.getElementById('imageCanvas');
const imageInfo = document.getElementById('imageInfo');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let originalImage = null;
let ctx = imageCanvas.getContext('2d');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

blurRange.addEventListener('input', updateFilter);
brightnessRange.addEventListener('input', updateFilter);
contrastRange.addEventListener('input', updateFilter);
saturationRange.addEventListener('input', updateFilter);
rotationRange.addEventListener('input', updateFilter);
blurType.addEventListener('change', updateFilter);
grayscale.addEventListener('change', updateFilter);
invert.addEventListener('change', updateFilter);
sepia.addEventListener('change', updateFilter);

blurRange.addEventListener('input', () => blurValue.textContent = blurRange.value + 'px');
brightnessRange.addEventListener('input', () => brightnessValue.textContent = brightnessRange.value + '%');
contrastRange.addEventListener('input', () => contrastValue.textContent = contrastRange.value + '%');
saturationRange.addEventListener('input', () => saturationValue.textContent = saturationRange.value + '%');
rotationRange.addEventListener('input', () => rotationValue.textContent = rotationRange.value + '°');

resetBtn.addEventListener('click', resetSettings);
downloadBtn.addEventListener('click', downloadImage);

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            const maxWidth = 800;
            const maxHeight = 600;
            let { width, height } = originalImage;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            imageCanvas.width = width;
            imageCanvas.height = height;
            
            imageInfo.textContent = `${originalImage.width} × ${originalImage.height} (skaliert auf ${Math.round(width)} × ${Math.round(height)})`;
            downloadBtn.disabled = false;
            updateFilter();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateFilter() {
    if (!originalImage) return;
    
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.save();
    
    const centerX = imageCanvas.width / 2;
    const centerY = imageCanvas.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationRange.value * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    let filterString = '';
    
    if (blurRange.value > 0) {
        filterString += `blur(${blurRange.value}px) `;
    }
    
    filterString += `brightness(${brightnessRange.value}%) `;
    filterString += `contrast(${contrastRange.value}%) `;
    filterString += `saturate(${saturationRange.value}%) `;
    
    if (grayscale.checked) {
        filterString += 'grayscale(100%) ';
    }
    
    if (invert.checked) {
        filterString += 'invert(100%) ';
    }
    
    if (sepia.checked) {
        filterString += 'sepia(100%) ';
    }
    
    ctx.filter = filterString.trim();
    ctx.drawImage(originalImage, 0, 0, imageCanvas.width, imageCanvas.height);
    ctx.restore();
}

function resetSettings() {
    blurRange.value = 0;
    brightnessRange.value = 100;
    contrastRange.value = 100;
    saturationRange.value = 100;
    rotationRange.value = 0;
    blurType.value = 'blur';
    grayscale.checked = false;
    invert.checked = false;
    sepia.checked = false;
    
    blurValue.textContent = '0px';
    brightnessValue.textContent = '100%';
    contrastValue.textContent = '100%';
    saturationValue.textContent = '100%';
    rotationValue.textContent = '0°';
    
    updateFilter();
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `blurred-image-law-${new Date().getTime()}.png`;
    link.href = imageCanvas.toDataURL();
    link.click();
}
