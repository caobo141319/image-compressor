document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.querySelector('.preview-container');
    const controls = document.querySelector('.controls');

    let originalFile = null;
    let compressedFile = null;

    // 处理文件上传
    uploadArea.addEventListener('click', () => imageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImageUpload(file);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // 处理图片压缩
    async function handleImageUpload(file) {
        originalFile = file;
        
        // 显示原图预览
        const originalUrl = URL.createObjectURL(file);
        originalPreview.src = originalUrl;
        originalSize.textContent = formatFileSize(file.size);

        // 显示预览区域和控制区域
        previewContainer.style.display = 'grid';
        controls.style.display = 'block';

        await compressImage();
    }

    // 压缩图片
    async function compressImage() {
        if (!originalFile) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: qualitySlider.value / 100
        };

        try {
            compressedFile = await imageCompression(originalFile, options);
            compressedPreview.src = URL.createObjectURL(compressedFile);
            compressedSize.textContent = formatFileSize(compressedFile.size);
        } catch (error) {
            console.error('压缩失败:', error);
        }
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        compressImage();
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        if (!compressedFile) return;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFile);
        link.download = 'compressed_' + originalFile.name;
        link.click();
    });

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});