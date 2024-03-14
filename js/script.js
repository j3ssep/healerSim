document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
    const healerMenu = document.getElementById("healerMenu");
    const misclickImage = document.getElementById("misclickImage");
    const topHealerMenu = document.getElementById("topHealerMenu");
    const middleHealerMenu = document.getElementById("middleHealerMenu");
    const bottomHealerMenu = document.getElementById("bottomHealerMenu");
    const counterDisplay = document.getElementById("counterDisplay");
    const redClick = new Image();
    redClick.src = "./assets/red_click.gif";
    const yellowClick = new Image();
    yellowClick.src = "./assets/yellow_click.gif";
    const inventoryImage = new Image();
    let backgroundImage = new Image();
    backgroundImage.src = "./assets/defaultzoom.png";
    let foodImage = new Image();
    let currentStreak = 0;
    let highestStreak = 0;
    let previousStreak = 0;
    let resetTickInterval;
    let instructionsContainer = document.getElementById("instructionsContainer");
    let hideButton = document.getElementById("hideButton");
    let healerClickableArea = {
        minX: 505,
        maxX: 630,
        minY: 120,
        maxY: 430
    };
    let foodClickableArea = {
        minX: 675,
        maxX: 720,
        minY: 530,
        maxY: 568
    };

    backgroundImage.onload = function () {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

    inventoryImage.onload = function () {
        context.drawImage(inventoryImage, 658, 263, 235, 320);
    };

    foodImage.onload = function () {
        context.drawImage(foodImage, 672, 525, 50, 45);
    };

    setTimeout(function () {
        inventoryImage.src = "./assets/inventory.png";
    }, 300);

    setTimeout(function () {
        foodImage.src = "./assets/defaultstate.png";
    }, 500);

//Food streak update
    function updateCounter() {
        counterDisplay.textContent = "Current streak: " + currentStreak;
            if (currentStreak === 0 && previousStreak > currentStreak) {
                previousDisplay.textContent = "Previous Streak: " + previousStreak;
            }
            if (currentStreak === 0 && previousStreak > highestStreak) {
                highestStreak = previousStreak;
                hiscoreDisplay.textContent = "Highest streak: " + highestStreak;
            }
    }
//Left clicking food on a healer
    function leftClickHealer() {
        clearInterval(resetTickInterval);

        resetTickInterval = setInterval(function () {
            previousStreak = currentStreak;
            currentStreak = 0;
            updateCounter();
        }, 650);

        redClick.style.position = "absolute";
        redClick.draggable = false;
        redClick.style.left = event.clientX - 8 + window.pageXOffset + "px";
        redClick.style.top = event.clientY - 8 + window.pageYOffset + "px";

        document.body.appendChild(redClick);

        setTimeout(function () {
            document.body.removeChild(redClick);
        }, 220);
        currentStreak++;
        updateCounter();
    }
//Top option in healer right click menu
    function wrongHealerOption() {
        yellowClick.style.position = "absolute";
        yellowClick.draggable = false;
        yellowClick.style.left = event.clientX - 8 + window.pageXOffset + "px";
        yellowClick.style.top = event.clientY - 8 + window.pageYOffset + "px";

        document.body.appendChild(yellowClick);

        setTimeout(function () {
            document.body.removeChild(yellowClick);
        }, 220);
        previousStreak = currentStreak;
        currentStreak = 0;
        updateCounter();
    }
//Middle option in healer right click menu
    function correctHealerOption() {
        clearInterval(resetTickInterval);

        resetTickInterval = setInterval(function () {
            previousStreak = currentStreak;
            currentStreak = 0;
            updateCounter();
        }, 650);
        
        redClick.style.position = "absolute";
        redClick.draggable = false;
        redClick.style.left = event.clientX - 8 + window.pageXOffset + "px";
        redClick.style.top = event.clientY - 8 + window.pageYOffset + "px";

        document.body.appendChild(redClick);

        setTimeout(function () {
            document.body.removeChild(redClick);
        }, 220);

        currentStreak++;
        updateCounter();
    }
//Bottom option in healer right click menu
    function cancelMenuOption() {
        previousStreak = currentStreak;
        currentStreak = 0;
        updateCounter();
    }
//Left click logic
    document.addEventListener("mousedown", function (event) {
        if (event.button === 0) {
            const canvasRect = canvas.getBoundingClientRect();
//Checks if left click happens inside healerClickableArea and food is selected      
            if (
                event.clientX >= canvasRect.left + healerClickableArea.minX &&
                event.clientX <= canvasRect.left + healerClickableArea.maxX &&
                event.clientY >= canvasRect.top + healerClickableArea.minY &&
                event.clientY <= canvasRect.top + healerClickableArea.maxY &&
                foodImage.src.endsWith("usestate.png") &&
                healerMenu.style.display == "none"
            ) {
                leftClickHealer();
            }
//Hides the menus if u click anywhere and sets the foodImage back to defaultstate
            misclickImage.style.display = "none"
            healerMenu.style.display = "none";
            foodImage.src = "./assets/defaultstate.png"
            if (
                event.clientX >= canvasRect.left + foodClickableArea.minX &&
                event.clientX <= canvasRect.left + foodClickableArea.maxX &&
                event.clientY >= canvasRect.top + foodClickableArea.minY &&
                event.clientY <= canvasRect.top + foodClickableArea.maxY
            ) {
                foodImage.src = "./assets/usestate.png";
            }
//Clears the foodImage and inventoryImage (x,y,width,height)
            context.clearRect(658, 263, 235, 320);
//Redraws foodImage and inventoryImage (x,y,width,height)
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }
    });
//Right click logic
    canvas.addEventListener("mousedown", function (event) {
        if (event.button === 2) {
            const canvasRect = canvas.getBoundingClientRect();
//Checks if right click happens inside healerClickableArea and food is selected
//If not, displays cancel menu
            if (
                event.clientX >= canvasRect.left + healerClickableArea.minX &&
                event.clientX <= canvasRect.left + healerClickableArea.maxX &&
                event.clientY >= canvasRect.top + healerClickableArea.minY &&
                event.clientY <= canvasRect.top + healerClickableArea.maxY &&
                foodImage.src.endsWith("usestate.png")
            ) {
                healerMenu.style.left = event.clientX + "px";
                healerMenu.style.top = event.clientY + "px";
                healerMenu.style.display = "block";
            } else {
                misclickImage.style.left = event.clientX + "px";
                misclickImage.style.top = event.clientY + "px";
                misclickImage.style.display = "block";
            }
        }
    });
//Gets rid of the default browser right click menu
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
//Menu closing upon hovering too far
    canvas.addEventListener("mousemove", function (event) {
        const healerMenuRect = healerMenu.getBoundingClientRect();
        const misMenuRect = misclickImage.getBoundingClientRect();

        const isMouseNearMisMenu = (
            event.clientX >= misMenuRect.left - 20 &&
            event.clientX <= misMenuRect.right + 20 &&
            event.clientY >= misMenuRect.top - 20 &&
            event.clientY <= misMenuRect.bottom + 20
        );
        const isMouseNearHealerMenu = (
            event.clientX >= healerMenuRect.left - 20 &&
            event.clientX <= healerMenuRect.right + 20 &&
            event.clientY >= healerMenuRect.top - 20 &&
            event.clientY <= healerMenuRect.bottom + 20
        );

        if (!isMouseNearHealerMenu) {
            healerMenu.style.display = "none";
        }
        if (!isMouseNearMisMenu) {
            misclickImage.style.display = "none";
        }
    });

    hideButton.addEventListener("click", function () {
        instructionsContainer.classList.toggle("hide-button");
    });
//Clickable divs within healerMenu
    topHealerMenu.addEventListener("mousedown", function () {
       if (event.button === 0) {
        wrongHealerOption();
        }
    });

    middleHealerMenu.addEventListener("mousedown", function () {
        if (event.button === 0) {
        correctHealerOption();
        }
    });

    bottomHealerMenu.addEventListener("mousedown", function () {
        if (event.button === 0) {
        cancelMenuOption();
        }
    });
//Zoom options
    zoomButton140.addEventListener("click", function () {
        backgroundImage.src = "./assets/140zoom.png"
        healerClickableArea = {
            minX: 540,
            maxX: 657,
            minY: 65,
            maxY: 480
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }, 300);
        setTimeout(function () {
            context.drawImage(foodImage, 672, 525, 50, 45)
        }, 500);
    })

    zoomButton120.addEventListener("click", function () {
        
        backgroundImage.src = "./assets/120zoom.png"
        healerClickableArea = {
            minX: 505,
            maxX: 660,
            minY: 93,
            maxY: 440
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }, 300);
        setTimeout(function () {
            context.drawImage(foodImage, 672, 525, 50, 45)
        }, 500);
    })

    zoomButton100.addEventListener("click", function () {
        backgroundImage.src = "./assets/defaultzoom.png"
        healerClickableArea = {
            minX: 505,
            maxX: 630,
            minY: 120,
            maxY: 430
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }, 300);
        setTimeout(function () {
            context.drawImage(foodImage, 672, 525, 50, 45)
        }, 500);
    })

    zoomButton80.addEventListener("click", function () {
        backgroundImage.src = "./assets/80zoom.png"
        healerClickableArea = {
            minX: 500,
            maxX: 600,
            minY: 155,
            maxY: 405
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }, 300);
        setTimeout(function () {
            context.drawImage(foodImage, 672, 525, 50, 45)
        }, 500);
    })

    zoomButton60.addEventListener("click", function () {
        backgroundImage.src = "./assets/60zoom.png"
        healerClickableArea = {
            minX: 485,
            maxX: 565,
            minY: 185,
            maxY: 390
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 263, 235, 320);
        }, 300);
        setTimeout(function () {
            context.drawImage(foodImage, 672, 525, 50, 45)
        }, 500);
    })
});