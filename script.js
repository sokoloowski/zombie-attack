let points = 0;
let hp = 3;

function updatePoints() {
    let result = `${points}`;
    while (result.length < 5) result = `0${result}`;
    document.querySelector(".score").innerText = result;
    document.querySelector(".hp").innerText = "🤍".repeat(Math.max(0, hp));
}

function escapedZombie() {
    hp--;
    miss();
}

function aim(e) {
    document.querySelector(".crosshair").style.left = `${e.pageX}px`;
    document.querySelector(".crosshair").style.top = `${e.pageY}px`;
}

function kill(e) {
    e.stopPropagation();
    points += 12;
    updatePoints();
    clearInterval(this.getAttribute("data-animation"));
    this.parentElement.removeChild(this);
}

function miss(e) {
    points -= 6;
    if (points < 0) points = 0;
    updatePoints();
}

class Zombie {
    constructor() {
        this.positionX = Math.random() * 25 + 50;
        this.positionY = window.innerWidth;
        this.size = Math.random() + 1;
        this.speed = Math.random() * 0.7 + 0.3;
    }

    animate(z) {
        let movement = setInterval(() => {
            if (["", "0%"].includes(z.style.backgroundPositionX)) {
                z.style.backgroundPositionX = "900%";
            } else {
                let c = z.style.backgroundPositionX;
                c = c.substring(0, c.length - 1) - 100;
                z.style.backgroundPositionX = `${c}%`;
            }
            let y = z.style.left;
            y = y.substring(0, y.length - 2) - 10 * this.size;
            z.style.left = `${y}px`;
            if (y < -312) {
                clearInterval(movement);
                z.parentElement.removeChild(z);
                escapedZombie();
            }
        }, 100 * this.speed);
        return movement;
    }

    spawn() {
        let zombie = document.createElement("div");
        zombie.classList.add("zombie");
        zombie.style.transform = `scale(${this.size})`;
        zombie.style.left = `${this.positionY}px`;
        zombie.style.top = `${this.positionX}vh`;
        let animation = this.animate(zombie);
        zombie.setAttribute("data-animation", animation);
        zombie.addEventListener("click", kill);
        return zombie;
    }
}

function spawnZombies() {
    updatePoints();
    setTimeout(() => {
        let zombie = new Zombie();
        document.querySelector(".board").appendChild(zombie.spawn());
        if (hp <= 0) {
            clearBoard();
        } else {
            spawnZombies();
        }
    }, 1000 * Math.random());
}

function clearBoard() {
    for (let z of document.querySelectorAll(".zombie")) {
        z.style.opacity = 0;
        z.removeEventListener("click", kill);
        clearInterval(z.getAttribute("data-animation"));
    }
    let msg = document.createElement("div");
    msg.classList.add("message");
    let msgContent = document.createTextNode("You lose!");
    msg.appendChild(msgContent);
    document.querySelector(".board").appendChild(msg);

    document.querySelector(".board").removeEventListener("click", miss);
}

function startGame(e) {
    document.querySelector(".board").addEventListener("click", miss);
    document.querySelector(".crosshair").style.display = "block";
    document.querySelector("a").style.cursor = "none";
    document.body.style.cursor = "none";
    this.remove();
    spawnZombies();
}

document.querySelector("#start").addEventListener("click", startGame);

document.body.addEventListener("mousemove", aim);
document.body.addEventListener("mousedown", (e) => {
    e.preventDefault();
});
