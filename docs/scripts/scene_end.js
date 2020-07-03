// JavaScript Document

// DEBUG
// console.log("scene_end.js loaded successfully");
// Start End Scene

// Images
//End_Scene Play background 
game.endBackground = {
    // Get handle to image
    image: document.getElementById("mainBackground"),
    // Declare object transform information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = engine.width;
        this.height = engine.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//   - Buttons
// Left Panel
//End_Scene Time Board Background
game.endTimeBoardBG = {
    // Get handle to image
    image: document.getElementById("endTimeBoardBG"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 350 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference));
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Time Left
game.endPlayerTimeBoard = {
    // Get handle to div
    div: document.getElementById("endPlayerTimeBoard"),
    // Declare object transform information
    org_width: 200 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 150,
    org_posY: 82,
    posX: 0,
    posY: 0,
    // Declare member variables
    org_font_size: 82,
    font_size: 0,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.endPlayerTimeBoard.clickMe);
    },
    // Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = (game.endTimeBoardBG.posX + game.endTimeBoardBG.width/2) - this.width/2;
        this.posY = game.endTimeBoardBG.posY + game.endTimeBoardBG.height - this.height - 16 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        // Adjust font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.adjustStyle();
        this.displayTimer();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    displayTimer: function () {
        if (!game.playTimeBoard.playTime.paused) {
            game.playTimeBoard.playTime.pauseTimer();
        }
        this.div.innerHTML = game.playTimeBoard.playTime.displayMinuteSeconds();
    },
    resetTimer: function () {
        game.playTimeBoard.playTime.setup(1, true, "Play Time", "up");
    }
};
game.endPlayerTimeBoard.init(); // Force initialize endPlayerTimeBoard's event listener

//End_Scene Title Background
game.endTitle = {
    // Get handle to image
    image: document.getElementById("titleWhite"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endTimeBoardBG.posY + game.endTimeBoardBG.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Game Points Background
game.endGamePoints = {
    // Get handle to image
    image: document.getElementById("endGamePoints"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endTitle.posY + game.endTitle.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Player Score
game.endPlayerScore = {
    // Get handle to div element
    div: document.getElementById("endPlayerScore"),
    // Declare object transform information
    org_width: 200 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Declare member variables
    org_font_size: 82,
    font_size: 0,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.endPlayerScore.clickMe);
    },
    textResize: function() {
        // Declare references to screen objects
        var mySpan = $("#endPlayerScoreSpan");
        var myDiv = $("#endPlayerScore");
        
        // Initialize the span
        mySpan.css("font-size", this.org_font_size);
        mySpan.html(myDiv.html());
        
        // Reduce the font size until the span is the correct width
        if (mySpan.width() > this.width) {
                while (mySpan.width() > this.width) {
                // Get the font size as an integer, base 10
                this.font_size = parseInt(mySpan.css("font-size"), 10);
                // Reduce the font size by 1
                mySpan.css("font-size", this.font_size - 1);
            }
        } else if (this.font_size < this.org_font_size) {
            // Reset the font size to normal
            this.font_size = this.org_font_size;
            // Reduce the font size by 1
            mySpan.css("font-size", this.font_size);
        }
        mySpan.css("font-size", this.font_size);
        // Reduce the font size until the span is the correct height
        if (mySpan.height() > this.height) {
            while (mySpan.height() > this.height) {
                // Get the font size as an integer, base 10
                this.font_size = parseInt(mySpan.css("font-size"), 10);
                // Reduce the font size by 1
                mySpan.css("font-size", this.font_size - 1);
            }
        }
        
        mySpan.css("font-size", this.font_size);
        // Set the player score to the proper size
        myDiv.css("font-size", this.font_size).html(mySpan.html());
    },
    // Adjust the object's transform
    resize: function () {

        this.width = game.endGamePoints.width * 0.8;
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (game.endGamePoints.posX + game.endGamePoints.width/2) - this.width/2;
        this.posY = game.endGamePoints.posY + game.endGamePoints.height * 0.32;
        
        // Adjust font size
        this.textResize();
    },
    // Draw the object
    draw: function () {
        this.updateScore();
        this.adjustStyle();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
    },
    // Update the score with the player's score
    updateScore: function () {
        this.div.innerHTML = Math.max(0, game.player.score);
    },
    // Handle user interaction
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.endPlayerScore.init(); // Force initialize the object's event listener

// Game Over Area
//End_Scene Game Over
game.endGameOver = {
    // Get handle to image
    image: document.getElementById("endGameOver"),
    // Declare object transform information
    org_width: 1323 * game.scale,
    org_height: 210 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Adjust the object's transform
    resize: function () {

        this.width = game.endKeyboardBackground.width;
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = game.endKeyboardBackground.posX;
        this.posY = game.endKeyboardBackground.posY + (game.endKeyboardBackground.height * 0.05 * (1 - (this.height / game.endKeyboardBackground.height)));
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Intials Background
game.endInitialsBG = {
    // Get handle to image
    image: document.getElementById("endInitials"),
    // Declare object transform information
    org_width: 811 * game.scale,
    org_height: 103 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (game.endKeyboardBackground.posX + game.endKeyboardBackground.width - this.width / 2) / 1.7;
        this.posY = (game.endGameOver.posY + game.endGameOver.height) + (game.endKeyboardBackground.height * 0.05 * (1 - (this.height / game.endKeyboardBackground.height)));
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Player Score
game.endPlayerInitials = {
    // Get handle to div element
    div: document.getElementById("endPlayerInitials"),
    // Declare object transform information
    org_width: 811 * game.scale,
    org_height: 103 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Declare member variables
    org_font_size: 82,
    font_size: 0,
    score: 0,
    initials: "",
	// Animation variables
	lastUpdate: 0,
	toggleUpdate: 0.35,
	showUpdate: false,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.endPlayerInitials.clickMe);
		// Empty the initials
        this.initialsValue = "";
        // Display the empty initials
        this.div.innerHTML = this.initialsValue;
		// Reset the last update
        this.lastUpdate = 0;
    },
    // Adjust the object's transform
    resize: function () {

        this.width = game.endInitialsBG.width * 0.3;
        this.height = game.endInitialsBG.height * 0.95;

        this.posX = game.endInitialsBG.posX + game.endInitialsBG.width - this.width;
        this.posY = game.endInitialsBG.posY + game.endInitialsBG.height * 0.025;

        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.adjustStyle();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
        this.div.style.fontSize = this.font_size + "px";
    },
    // Update and display the player's initials
    updateInitials: function (letter) {
        // Add to or reset initials, limiting 2 letters
        if (this.initials.length < 2 && this.initials != "") {
            this.initials += letter;
        } else {
            this.initials = letter;
        }
        // Display and set the player's initials
        this.div.innerHTML = this.initials;
        game.player.initials = this.initials;
    },
    // Clear and hid the initials
    clearInitials: function () {
        this.initials = "";
        this.div.innerHTML = this.initials;
    },
	// Animate the initials value
	animateInitials: function(dt) {
		// Update the time since the last update
		this.lastUpdate += dt;
		// Update the visible characters after toggleUpdate milliseconds
		if (this.lastUpdate >= this.toggleUpdate) {
			// Display/hide an underscore in the initials field
			if (this.initials.length < 2) {
				// Display
				if (!this.showUpdate) {
					this.initialsValue = this.initials + "_";
				} else {
					// Hide
					this.initialsValue = this.initials;
				}
				// Toggle the update
				this.showUpdate = !this.showUpdate;
			} else {
				this.initialsValue = this.initials;
			}
			// Reset the last update time
			this.lastUpdate = 0;
		}
		// Write to the div element
		this.div.innerHTML = this.initialsValue;
	},
    // Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.endPlayerInitials.init(); // Force initialize the event listener

//End_Scene Keypad Background
game.endKeyboardBackground = {
    // Get handle to image
    image: document.getElementById("endKeyboardBackground"),
    // Declare object transform information
    org_width: 1323 * game.scale,
    org_height: 870 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = ((engine.width - (game.endTitle.posX + game.endTitle.width)) + (this.width / 2)) / 4;
        this.posY = engine.height - this.height + 5;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endKeyboardKeys = {
    // Get handle to image
    div: document.getElementById("endKeypad"),
    // Declare object transform information
    org_width: 94 * game.scale,
    org_height: 102 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    keyArray: [],
    btnMargin: 5,
    btnWidth: 0,
    btnHeight: 0,
    btnPerRow: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = game.endKeyboardBackground.width * 0.95;
        this.height = (game.endSubmitButton.posY - (game.endInitialsBG.posY + game.endInitialsBG.height)) * 0.75;

        this.posX = game.endKeyboardBackground.posX + game.endKeyboardBackground.width * 0.025;
        this.posY = (game.endInitialsBG.posY + game.endInitialsBG.height) + (game.endKeyboardBackground.height * 0.1 * (1 - (this.height / game.endKeyboardBackground.height)));

        this.btnWidth = this.width / 14.1;

        for (var i = 0; i < this.keyArray.length; i++) {
            var domElement = document.getElementById(this.keyArray[i]);
            domElement.style.width = this.btnWidth + "px";
            domElement.style.display = "inline-block";
        }
    },
    // Draw the object
    draw: function () {
        this.adjustStyle();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        if (this.keyArray.length == 0) this.buildKeypad();
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
    },
    // Hide keypad and clear arrays
    hideKeypad: function () {
        this.keyArray = [];
    },
    // Build the keypad
    buildKeypad: function () {
        var letter = "";

        // Loop through the alphabet
        for (var i = 0; i < 26; i++) {
            // Identify the letter of the button
            letter = String.fromCharCode(65 + i);

            // endKeyboardKey_A
            this.keyArray.push("endKeyboardKey_" + String.fromCharCode(65 + i));
        }

        // Define the number of buttons per row
        this.btnPerRow = Math.ceil(this.keyArray.length / 2);

        // Apply user interaction to the inner elements of each button
        // Get a list of all the images
        var imgElement = this.div.getElementsByTagName("img");
        for (var i = 0; i < imgElement.length; i++) {
            // Check the element's name
            if (imgElement[i].id.substring(0, 15) == "endKeyboardKey_") {
                for (var j = 0; j < 26; j++) {
                    // Create an identity matching string
                    var myKey = "endKeyboardKey_" + String.fromCharCode(65 + j);
                    if (imgElement[i].id == myKey) {
                        // Give the element a name for easy identification
                        imgElement[i].name = String.fromCharCode(65 + j);
                        // Add a click event to the element
                        imgElement[i].addEventListener("click", function (e) {

                            // Reset timeout overlay timer
                            game.timeoutOverlay.refreshTimer();
                            // Add letter to the player's initials
                            game.endPlayerInitials.updateInitials(e.srcElement.name);
                        });
                    }
                }
            }
        }
    }
};

// Buttons
// End_Scene Submit Button
game.endSubmitButton = {
    // Get handle to image
    image: document.getElementById("submitButton"),
    // Declare object transform information
    org_width: 215 * game.scale,
    org_height: 86 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.endSubmitButton.clickMe);
    },
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = (game.endKeyboardBackground.posX + game.endKeyboardBackground.width - this.width) * 0.97;
        this.posY = (game.endKeyboardBackground.posY + game.endKeyboardBackground.height - this.height) * 0.95;
    },
    // Draw the object
    draw: function () {
        this.adjustStyle();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.image.style.position = "absolute";
        this.image.style.display = "block";
        this.image.style.left = this.posX.toString() + "px";
        this.image.style.top = this.posY.toString() + "px";
        this.image.style.width = this.width + "px";
        this.image.style.height = this.height + "px";
        this.image.style.zIndex = 1;
    },

    clickMe: function () {
		game.timeoutOverlay.refreshTimer();
        //AJAX
        var ajax = new XMLHttpRequest();
        // Send player's initials and score to the database
        ajax.open("GET", "scripts/insert_score.php?u=" + game.player.initials + "&s=" + game.player.score, true);
        ajax.send();

        // Await response completion (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // DEBUG
                console.log(this.responseText);

                // TRANSITION
                // Clear the initials on the End Scene
                game.endPlayerInitials.clearInitials();
                // Change game state to Leaderboard Scene
                game.currState = game.gameState[3];
                // Hide all elements
                game.hideElements.hideAll();
                // Redraw all elements
                game.drawOnce();
                // Inform Google the player completed a playthrough
                game.google.finish();
            }
        }
    }
};
game.endSubmitButton.init(); // Force initialize object on first script load 
