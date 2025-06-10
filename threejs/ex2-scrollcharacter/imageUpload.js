export class ImageUpload {
  constructor(character) {
    this.character = character;
    this.photoUpload = document.querySelector('.photo-upload');
    this.closeButton = this.photoUpload.querySelector('#close-btn');
    this.fileInput = this.photoUpload.querySelector('input[type="file"]');
    this.uploadBtn = this.photoUpload.querySelector('#upload-btn');
    this.selectedFile = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.hide());
    }
    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        this.selectedFile = e.target.files[0] || null;
      });
    }
    if (this.uploadBtn) {
      this.uploadBtn.addEventListener('click', () => {
        if (this.selectedFile) {
          this.uploadPhoto(this.selectedFile);
        } else {
          alert('이미지 파일을 선택해주세요.');
        }
      });
    }
  }

  show() {
    this.photoUpload.classList.remove('hidden');
  }

  hide() {
    this.photoUpload.classList.add('hidden');
    this.fileInput.value = '';
    this.selectedFile = null;
  }

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(
        `https://web-production-6707e.up.railway.app/api/upload`,
        {
          method: 'POST',
          body: formData
        });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || '업로드 실패');
        throw new Error(error);
      }

      // const data = await response.json();
      this.hide();
      this.character.setFaceTexture();
    } catch (err) {
      console.error(err);
    }
  }
}