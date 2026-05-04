document.addEventListener('DOMContentLoaded', async function () {
    window.isInGame = false;

    document.body.classList.add('ready');

    
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });

    
    
    
    try {
        const forfeit = await postFetch('/api/dungeon/forfeit', {});
        if (forfeit?.success) {
            toast('You abandoned your run. Your loadout has been wiped.', 'error', 4000);
        }
    } catch (_) {
        
    }

    if (checkOrientation()) {
        Menu();
    }
});
