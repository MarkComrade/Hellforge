document.addEventListener('DOMContentLoaded', async function () {
    window.isInGame = false;

    document.body.classList.add('ready');

    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });

    // If the server session still has an active dungeon the player never properly
    // exited (i.e. they refreshed mid-run), apply the forfeit penalty immediately.
    // requireLogin on the endpoint handles the not-logged-in case (returns 401 / success:false).
    try {
        const forfeit = await postFetch('/api/dungeon/forfeit', {});
        if (forfeit?.success) {
            toast('You abandoned your run. Your loadout has been wiped.', 'error', 4000);
        }
    } catch (_) {
        // Not logged in or network error — proceed normally
    }

    if (checkOrientation()) {
        Menu();
    }
});
