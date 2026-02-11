const SCREENS = {
    menu: ['menu'],
    login: ['menu'],
    settings: ['menu', 'overlays'],
    leaderboard: ['menu', 'leaderboard'],
    character: ['character', 'overlays'],
    dungeon: ['dungeon', 'navigation', 'map', 'ui', 'overlays', 'character'],
    combat: ['dungeon', 'ui', 'overlays', 'character'],
    map: ['map', 'ui', 'overlays', 'navigation'],
    inventory: ['character', 'overlays']
};

function loadScreen(screen) {
    const files = SCREENS[screen] || ['menu'];

    document.querySelectorAll('link[id^="css-"]').forEach((link) => link.remove());

    files.forEach((file) => {
        const link = document.createElement('link');
        link.id = 'css-' + file;
        link.rel = 'stylesheet';
        link.href = '../css/' + file + '.css';
        document.head.appendChild(link);
    });
}
