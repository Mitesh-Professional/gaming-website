const routes = ['/index.html','/pages/about.html','/pages/contact.html','/game-list.html','/pages/privacy-policy.html','/pages/terms-conditions.html','/games/tetris.html','/games/pacman.html','/games/space-invaders.html','/games/snake.html']

let route = window.location.pathname;

if (routes.includes(route)) {
    console.log(`${route} is in the list.`);
} else {
    console.log(`${route} is NOT in the list.`);
}
