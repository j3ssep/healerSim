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
    let foodPosX = 672;
    let foodPosY = 525;
    let healerClickableArea = {
        minX: 505,
        maxX: 630,
        minY: 120,
        maxY: 450
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
        context.drawImage(inventoryImage, 658, 273, 235, 310);
    };

    foodImage.onload = function () {
        context.drawImage(foodImage, foodPosX, foodPosY, 50, 45);
    };

    setTimeout(function () {
        inventoryImage.src = "./assets/inventory.png";
    }, 300);

    setTimeout(function () {
        foodImage.src = "./assets/defaultstate.png";
    }, 500);
//Redraw inventory and foodImage function
    function redrawInvFood() {
        setTimeout(function () {
            context.drawImage(inventoryImage, 658, 273, 235, 310);
        }, 100);
        setTimeout(function () {
            context.drawImage(foodImage, foodPosX, foodPosY, 50, 45);
        }, 400);
    }
//Food streak update
    function updateCounter() {
        counterDisplay.textContent = "Current streak: " + currentStreak;
            if (currentStreak === 0 && previousStreak > currentStreak) {
                previousDisplay.textContent = "Previous streak: " + previousStreak;
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
                wormSelectedIndicator.style.display = "block";
            }
//Clears the foodImage and inventoryImage (x,y,width,height)
            context.clearRect(658, 273, 235, 310);
//Redraws foodImage and inventoryImage (x,y,width,height)
            context.drawImage(inventoryImage, 658, 273, 235, 310);
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
        wormHealerIndicator.style.display = "none";
        wormSelectedIndicator.style.display = "none";
        wormIndicator.style.display = "none";
        wormHealerToolTip.style.display ="none";
        wormToolTip.style.display = "none";
    });
//Gets rid of the default browser right click menu
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
//Menu closing upon hovering too far
    canvas.addEventListener("mousemove", function (event) {
        const healerMenuRect = healerMenu.getBoundingClientRect();
        const misMenuRect = misclickImage.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
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
//Indicator (top left) display logic
//Worm hover
        if (
            foodImage.src.endsWith("defaultstate.png") &&
            event.clientX >= canvasRect.left + foodClickableArea.minX &&
            event.clientX <= canvasRect.left + foodClickableArea.maxX &&
            event.clientY >= canvasRect.top + foodClickableArea.minY &&
            event.clientY <= canvasRect.top + foodClickableArea.maxY
            )
        {
            wormToolTip.style.display = "block";
            wormToolTip.style.left = event.clientX + "px";
            wormToolTip.style.top = event.clientY + "px";
            wormIndicator.style.display = "block";
        }
        else {
            wormIndicator.style.display = "none";
            wormToolTip.style.display = "none";
        }
//Worm selected and hovering healer
        if (
            foodImage.src.endsWith("usestate.png") &&
            event.clientX >= canvasRect.left + healerClickableArea.minX &&
            event.clientX <= canvasRect.left + healerClickableArea.maxX &&
            event.clientY >= canvasRect.top + healerClickableArea.minY &&
            event.clientY <= canvasRect.top + healerClickableArea.maxY &&
            !isMouseNearHealerMenu &&
            !isMouseNearMisMenu
            ) 
        {
            wormHealerToolTip.style.display = "block";
            wormHealerToolTip.style.left = event.clientX + "px";
            wormHealerToolTip.style.top = event.clientY + "px";
            wormHealerIndicator.style.display = "block";
            wormSelectedIndicator.style.display = "block";
        }
        else {
            wormHealerToolTip.style.display ="none";
            wormHealerIndicator.style.display = "none";
        }
//Worm selected
        if (
            foodImage.src.endsWith("usestate.png") &&
            !(event.clientX >= canvasRect.left + healerClickableArea.minX &&
            event.clientX <= canvasRect.left + healerClickableArea.maxX &&
            event.clientY >= canvasRect.top + healerClickableArea.minY &&
            event.clientY <= canvasRect.top + healerClickableArea.maxY)
        )
        {
            wormSelectedIndicator.style.display = "block";
            wormSelectedIndicator.style.display = "block";
        }
    });

    hideButton.addEventListener("click", function () {
        instructionsContainer.classList.toggle("hide-button");
    });
//Clickable divs within healerMenu
    topHealerMenu.addEventListener("mousedown", function (event) {
       if (event.button === 0) {
        wrongHealerOption();
        }
    });

    middleHealerMenu.addEventListener("mousedown", function (event) {
        if (event.button === 0) {
        correctHealerOption();
        }
    });

    bottomHealerMenu.addEventListener("mousedown", function (event) {
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
        redrawInvFood();
    })

    zoomButton120.addEventListener("click", function () {
        
        backgroundImage.src = "./assets/120zoom.png"
        healerClickableArea = {
            minX: 505,
            maxX: 660,
            minY: 93,
            maxY: 465
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        redrawInvFood();
    })

    zoomButton100.addEventListener("click", function () {
        backgroundImage.src = "./assets/defaultzoom.png"
        healerClickableArea = {
            minX: 505,
            maxX: 630,
            minY: 120,
            maxY: 450
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        redrawInvFood();
    })

    zoomButton80.addEventListener("click", function () {
        backgroundImage.src = "./assets/80zoom.png"
        healerClickableArea = {
            minX: 500,
            maxX: 600,
            minY: 155,
            maxY: 425
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        redrawInvFood();
    })

    zoomButton60.addEventListener("click", function () {
        backgroundImage.src = "./assets/60zoom.png"
        healerClickableArea = {
            minX: 485,
            maxX: 565,
            minY: 185,
            maxY: 405
        };
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        redrawInvFood();
    })
    toggleToolTip.addEventListener("click", function(){
        if (document.getElementById("toggleToolTip").textContent === "Mouse tooltip off"){
            wormHealerToolTip.style.opacity = 0;
            wormToolTip.style.opacity = 0;
            document.getElementById("toggleToolTip").textContent = "Mouse tooltip on"
        }
        else {
            wormHealerToolTip.style.opacity = 1;
            wormToolTip.style.opacity = 1;
            document.getElementById("toggleToolTip").textContent = "Mouse tooltip off"
        }
    })
    foodPos.addEventListener("click", function(){
        let currentFoodPos = parseInt(document.getElementById("foodPos").textContent.replace("Food position: ", ""));
        let foodPos = (currentFoodPos % 6) + 1;
        document.getElementById("foodPos").textContent = "Food position: " + foodPos.toString();
        if (foodPos === 1){
            foodPosY = 525;
            foodClickableArea = {
            minX: 675,
            maxX: 720,
            minY: 530,
            maxY: 568
            }
            redrawInvFood();
        }
        if (foodPos === 2){
            foodPosY = 488;
            foodClickableArea = {
                minX: 675,
                maxX: 720,
                minY: 492,
                maxY: 530
                }
                redrawInvFood();
        }
        if (foodPos === 3){
            foodPosY = 452;
            foodClickableArea = {
                minX: 675,
                maxX: 720,
                minY: 454,
                maxY: 492
                }
                redrawInvFood();
        }
        if (foodPos === 4){
            foodPosY = 415;
            foodClickableArea = {
                minX: 675,
                maxX: 720,
                minY: 416,
                maxY: 454
                }
                redrawInvFood();
        }
        if (foodPos === 5){
            foodPosY = 375;
            foodClickableArea = {
                minX: 675,
                maxX: 720,
                minY: 378,
                maxY: 416
                }
                redrawInvFood();
        }
        if (foodPos === 6){
            foodPosY = 333;
            foodClickableArea = {
                minX: 675,
                maxX: 720,
                minY: 340,
                maxY: 378
                }
                redrawInvFood();
        }
    });
});