document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const selectFilesButton = document.getElementById('selectFilesButton');
    const searchInput = document.getElementById('searchInput');
    const mp3List = document.getElementById('mp3List');
    const audioPlayer = document.getElementById('audioPlayer');
    const errorMessage = document.getElementById('errorMessage');

    selectFilesButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const existingFiles = JSON.parse(localStorage.getItem('mp3Files')) || [];
        const newFiles = Array.from(files).map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        const allFiles = [...existingFiles, ...newFiles];
        localStorage.setItem('mp3Files', JSON.stringify(allFiles));
        populateMP3List(allFiles);
    });

    function populateMP3List(files) {
        mp3List.innerHTML = '';
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file.url;
            option.textContent = file.name;
            mp3List.appendChild(option);
        });

        if (mp3List.options.length > 0) {
            mp3List.selectedIndex = 0;
            mp3List.dispatchEvent(new Event('change'));
        }
    }

    mp3List.addEventListener('change', () => {
        const selectedOption = mp3List.options[mp3List.selectedIndex];
        audioPlayer.src = selectedOption.value;
        highlightCurrentPlaying();
        audioPlayer.play();
    });

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const options = mp3List.getElementsByTagName('option');

        Array.from(options).forEach(option => {
            const txtValue = option.textContent || option.innerText;
            option.style.display = txtValue.toLowerCase().includes(filter) ? '' : 'none';
        });
    });

    mp3List.addEventListener('keydown', (event) => {
        let newIndex;

        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                newIndex = mp3List.selectedIndex - 1;
                if (newIndex >= 0) {
                    mp3List.selectedIndex = newIndex;
                    mp3List.dispatchEvent(new Event('change'));
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                newIndex = mp3List.selectedIndex + 1;
                if (newIndex < mp3List.length) {
                    mp3List.selectedIndex = newIndex;
                    mp3List.dispatchEvent(new Event('change'));
                }
                break;
            case 'Enter':
                event.preventDefault();
                mp3List.dispatchEvent(new Event('change'));
                break;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        const currentIndex = mp3List.selectedIndex;
        if (currentIndex + 1 < mp3List.length) {
            mp3List.selectedIndex = currentIndex + 1;
            mp3List.dispatchEvent(new Event('change'));
        }
    });

    function highlightCurrentPlaying() {
        Array.from(mp3List.options).forEach(option => {
            option.classList.remove('playing');
        });
        const selectedOption = mp3List.options[mp3List.selectedIndex];
        selectedOption.classList.add('playing');
    }

    function loadStoredFiles() {
        const storedFiles = JSON.parse(localStorage.getItem('mp3Files'));
        if (storedFiles) {
            populateMP3List(storedFiles);
        }
    }

    window.addEventListener('load', loadStoredFiles);

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    }
});
