// JavaScript Document

/* Game States and transitions
 ** -- Start Scene
 **  \ - Play Scene
 ** /  \ - End Scene
 ** \____\ - Leaderboard Scene
 **        \ - Start Scene
 */
game.gameState = ['start', 'play', 'end', 'leaderboard'];
game.currState = game.gameState[0];

// Clear the screen of all elements
game.hideElements = {
    // Hide images
    images: function () {
        // Hide all <img> elements
        var y = document.getElementsByTagName("img");
        for (var i = 0; i < y.length; i++) {
            y[i].style.display = "none";
        }
        // Hide all <div> elements
        var z = document.getElementsByTagName("div");
        for (var i = 0; i < z.length; i++) {
            z[i].style.display = "none";
        }
    },
    // Erase all shape divs
    wipeShapes: function() {
        var z = document.getElementsByClassName("gems");
        var tempArray = [...z];
        while (tempArray.length > 0) {
            tempArray.pop().remove();
        }
    },
    // Hide canvas drawings
    canvas: function () {
        engine.context.clearRect(0, 0, engine.width, engine.height);
    },
    // Hide everything
    hideAll: function () {
        this.images();
        this.canvas();
        this.wipeShapes();
        // Reset leaderboard table
        game.top10players.hideTable();
        // Reset the grid array
        game.playGrid.clearGrid();
        // Reset the spawn array
        game.playSpawnSquares = [];
        // Hide the play field's grid
        game.playFieldGrid.hideGrid();
        // Reset all entities
        game.gameEntities.clearEntities();
    }
};

// Frame rate display
game.frameRateDisplay = {
    div: document.getElementById("frameRate"),
    draw: function () {
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.zIndex = 111;
    },
    update: function (frameRate) {
        this.div.innerHTML = `<em><strong>${frameRate.toFixed(0)}</strong> FPS</em>`
    }
}

// Maintain live game data (timers, scores, etc.)
game.gameController = {
    gsStart: function (dt) {
        // Start Scene

        //Reset Game Timer
        game.playTimeBoard.resetTimer();

        //Reset Play time
        game.endPlayerTimeBoard.resetTimer();

        // DEBUG TESTER
        if (game.startShapeTester) {
            game.startShapeTester = false;
        }
        // DEBUG TESTER

        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
                // Set the new game state to Play Scene
                game.currState = game.gameState[1];
                // Reset the player
                game.player.reset();
                // Hide all elements
                game.hideElements.hideAll();
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
                // Redraw all elements
                game.drawOnce();
            }
        }
    },
    gsPlay: function (dt) {
        // Play Scene

        //Start game timers
        if (!game.playTimeBoard.timer._timerExpired) {
            game.playTimeBoard.displayTimer();
        } else {
            // Clear the initials on the End Scene
            game.endPlayerInitials.clearInitials();
            // Update game state to End Scene
            game.currState = game.gameState[2];
            // Hide all elements
            game.hideElements.hideAll();
            // Refresh timeout
            game.timeoutOverlay.refreshTimer();
            // Redraw all elements
            game.drawOnce();
        }

        // Touch Events
        for (var i = 0; i < game.touch.length; i++) {
            if (engine.input.pressed(game.touch[i])) {
                for (var j = 0; j < Object.keys(engine.input.activeTouches).length; j++) {
                    var touchInfo = engine.input.getTouch(j);
                    if (touchInfo.type == "START") {
                        // Perform actions when start is pressed
                        if (game.selectShape(new Vector2D(touchInfo.x, touchInfo.y))) {
                            game.selectStartSquare(new Vector2D(touchInfo.x, touchInfo.y));
                        }
                        game.timeoutOverlay.refreshTimer();
                    } else if (touchInfo.type == "END") {
                        // Perform actions when end is pressed
                        if (game.selectDestinationSquare(new Vector2D(touchInfo.x, touchInfo.y))) {
                            game.releaseSelectedShape(new Vector2D(touchInfo.x, touchInfo.y));
                        }
                        game.timeoutOverlay.refreshTimer();
                    }
                }
            }
        }

        // Mouse Events
        if (engine.input.pressed(game.mouse[0])) {
            // Select the shape at the mouse click location
            // console.log(`Clicked left mouse at ${new Vector2D(engine.input.mouse.x, engine.input.mouse.y)}`);
            if (game.selectShape(new Vector2D(engine.input.mouse.x, engine.input.mouse.y))) {
                game.selectStartSquare(new Vector2D(engine.input.mouse.x, engine.input.mouse.y));
            }
            game.timeoutOverlay.refreshTimer();
        }
        if (engine.input.released(game.mouse[0])) {
            // Release the shape upon mouse release and move the shape to the release location
            // console.log(`Released left mouse at ${new Vector2D(engine.input.mouse.x, engine.input.mouse.y)}`);
            if (game.selectDestinationSquare(new Vector2D(engine.input.mouse.x, engine.input.mouse.y))) {
                game.releaseSelectedShape(new Vector2D(engine.input.mouse.x, engine.input.mouse.y));
            }
            game.timeoutOverlay.refreshTimer();
        }

        // DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
                // Clear the initials on the End Scene
                game.endPlayerInitials.clearInitials();
                // Update game state to End Scene
                game.currState = game.gameState[2];
                // Hide all elements
                game.hideElements.hideAll();
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
                // Redraw all elements
                game.drawOnce();
            }
        }

        // Evaluate the board with enforced load balancing
        if (game.evaluateBoard.evalReady(dt)) {
            // Fix shape selectors
            if (game.startSquare == null && game.destinationSquare != null) game.destinationSquare = null;
            // Updated Regulated Items
            game.regulators.update();
            // Evaluate the board
            game.evaluateBoard.Evaluate();
        }
    },
    gsEnd: function (dt) {
        // End Scene

        //Reset Game Timer
        game.playTimeBoard.resetTimer();

        //Pause Play Time
        game.playTimeBoard.playTime.paused = true;
		
        // Handle the initials animation
        game.endPlayerInitials.animateInitials(dt);

        // DEBUG TESTER
        if (game.startShapeTester) {
            game.startShapeTester = false;
        }
        // DEBUG TESTER

        // DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
                // Clear the initials on the End Scene
                game.endPlayerInitials.clearInitials();
                // Update game state to Leaderboard Scene
                game.currState = game.gameState[3];
                // Hide all elements
                game.hideElements.hideAll();
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
                // Redraw all elements
                game.drawOnce();
            }
        }
    },
    gsLeaderboard: function (dt) {
        // Leaderboard Scene

        //Reset Game Timer
        game.playTimeBoard.resetTimer();

        //Reset Play time
        game.endPlayerTimeBoard.resetTimer();

        // DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
                // Update game state to Start Scene
                // Reset player object
                game.player.reset();
                // Reset leaderboard table
                game.top10players.hideTable();
                // Update game state to Start Scene
                game.currState = game.gameState[0];
                // Hide all elements
                game.hideElements.hideAll();
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
                // Redraw all elements
                game.drawOnce();
            }
        }
    }
};

// Update
// - Heavy performance impact
// - Limit actions that do not require real-time updates
// - Executes every frame
game.update = function (dt) {
    // Determine frame rate
    this.frameCount += 1;
    this.frameTime += dt;

    // Regulated Updates
    // - ~1 Second
    if (this.frameTime >= 1.0) {
        this.frameTime = 0.00001;
        this.frameRate = this.frameCount;
        this.frameCount = 0;
        this.frameArray.unshift(this.frameRate);
        if (this.frameArray.length > 5) this.frameArray.pop();
        let frameSum = 0.0;
        for (var i = 0; i < this.frameArray.length; i++) { frameSum += this.frameArray[i]; }
        this.frameAvg = frameSum / this.frameArray.length;
    }
    // - ~5 Seconds
    // Temporarily draw and update sponsors
    this.frameDraw += dt;
    if (this.frameDraw >= 5.0) {
        this.drawOnce();
        this.frameDraw = 0.00001;
        this.sponsors.update();
    }
    game.frameRateDisplay.update(this.frameAvg);
    // Monitor game states
    switch (game.currState) {
        case 'start':
            this.gameController.gsStart(dt);
            break;
        case 'play':
            this.gameController.gsPlay(dt);
            break;
        case 'end':
            this.gameController.gsEnd(dt);
            break;
        case 'leaderboard':
            this.gameController.gsLeaderboard(dt);
            break;
        default:
            this.gameController.gsStart(dt);
            break;
    };

    // Update all timers
    for (var i = 0; i < game.timers.length; i++) {
        game.timers[i].update(dt);
        // DEBUG
        /*if (game.timers[i].timerExpired) {
            console.log(game.timers[i].toString());
        }
        console.log(game.timers[i].displayMinuteSeconds());*/
    }

    // Force a draw when the window resizes
    if (this.lastTimeSized < (engine.timeSizing)) {
        this.drawOnce();
        this.lastTimeSized = Date.now();
    }

    // Maintain Game Timeout
    game.timeoutOverlay.update(dt);

    // Handle mouse clicks
    for (var i = 0; i < game.mouse.length; i++) {
        if (engine.input.pressed(game.mouse[i])) {
            // Refresh the overlay's timer
            game.timeoutOverlay.refreshTimer();
        }
    }
};

// Draw functions
// - Static
//   - Draw static assets once, if they are active
//   - Light performance impact
//   - Useful during scene transitions and small animations
game.drawOnce = function () {
    game.frameRateDisplay.draw();
    // Draw based on the GameState
    switch (this.currState) {
        case 'start':
            // Draw images on the canvas
            this.startBackground.draw();
            this.ABoFTitle.draw();

            // Display buttons
            this.startButton.adjustStyle();
            this.leaderboardButton.adjustStyle();
            this.quitButton.adjustStyle();
            this.menuButton.adjustStyle();
            break;
        case 'play':
            // Draw images on the canvas
            this.playBackground.draw();
            // Left Panel Backgrounds
            this.playTimeBoardBG.draw();
            this.playTitle.draw();
            this.playScoreBoard.draw();
            // Left Panel Text
            this.playTimeBoard.draw();
            this.playScore.draw();

            // Sponsors
            this.playSponsor.draw();
            this.playSponsorLogo.draw();

            // Gems
            this.gemTriangle.draw();
            this.gemStar.draw();
            this.gemHeart.draw();
            this.gemSquare.draw();
            this.gemCircle.draw();
            this.gemPentagon.draw();
            this.gemRectangle.draw();
            this.gemSponsor.draw();

            // Playing Field
            this.playFieldBackground.draw();
            this.playFieldGrid.draw();
            this.gameEntities.drawEntities();

            // Display buttons
            this.menuButton.adjustStyle();
            break;
        case 'end':
            // Draw images on the canvas
            this.endBackground.draw();
            this.endTimeBoardBG.draw();
            this.endTitle.draw();
            this.endGamePoints.draw();
            this.endPlayerScore.draw();
            this.endKeyboardBackground.draw();
            this.endGameOver.draw();
            this.endInitialsBG.draw();
            this.endPlayerInitials.draw();

            // Display buttons
            this.endSubmitButton.adjustStyle();
            this.menuButton.adjustStyle();
            // Keypad
            this.endKeyboardKeys.draw();
            // Time
            this.endPlayerTimeBoard.draw();
            break;
        case 'leaderboard':
            // Draw images on the canvas
            this.leaderboardBackground.draw();
            this.leaderboardPlayerScore.draw();
            this.leaderboardSponsor.draw();
            this.leaderboardSponsorLogo.draw();
            this.finalPlayerScore.draw();
            this.top10players.adjustStyle();
            // Display buttons
            this.menuButton.adjustStyle();
            this.leaderboardRetryButton.adjustStyle();
            break;
        default:
            break;
    }
    // DEBUG
    console.log("<GAME> Loaded Scene: " + this.currState);
};
//   - First draw event
window.onload = function () {
    game.drawOnce();
}

// - Animation
//   - Draw animations
//     - Heavy performance impact
//     - Only use when animating the full screen
//     - Draws every frame
game.draw = function () {
    // Draw based on the GameState
    switch (this.currState) {
        case 'start':
            break;
        case 'play':
            break;
        case 'end':
            break;
        case 'leaderboard':
            break;
        default:
            break;
    }
};

// Window loses focus
window.onblur = function () {
    // Pause the game
    return game.stop();
};

// Window gains focus
window.onfocus = function () {
    // Force redraw of all elements
    game.run();
    // Unpause the game
    return game.drawOnce();
};

// First draw event
window.game.drawOnce();

// Fade out the overlay and spinner
$("#fadeOutLoader").delay(1000).fadeOut(1000);
$("#fadeOutOverlay").delay(1000).fadeOut(1000);

// Run Game
game.run(); // Force game to start on first script load