// JavaScript Document

// DEBUG
// console.log("play_scene.js loaded successfully");

// Classes
class GridSquare {
    constructor(_id, top, left, width, height, column, _div) {
        this.id = _id;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
		this.column = column;
        this.right = left + width;
        this.bottom = top + height;
        this.center = new Vector2D((left + width / 2), (top + height / 2));
		this.toCenter = vecSubtract(this.center, new Vector2D(this.left, this.top));
		this.occupied = false;
		// Location within the playing grid
		this.gridColumn = null;
		this.gridRow = null;
		// Neighbor links
		this.linkTop = null;
		this.linkBottom = null;
		this.linkLeft = null;
		this.linkRight = null;
		this.linksArray = [];
		// Occupying shape
		this.attachedShape = "undefined";
		// Regulator
		this.regulator = new Regulator(15, this);
		// Store the matching shapes
		this.matchesVertical = [];
        this.matchesHorizontal = [];
        this.matchesCombined = [];
		// Reference div
		this.divReference = _div;
		// Push reference to this square
        game.playGrid.addSquare(this);
    }
    setPosition(newTop, newLeft) {
        this.top = newTop + game.playFieldGrid.posY;
        this.left = newLeft + game.playFieldGrid.posX;
		this.width = game.playFieldGrid.gridWidth;
		this.height = game.playFieldGrid.gridHeight;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        this.center = new Vector2D((this.left + this.width / 2), (this.top + this.height / 2));
		this.toCenter = vecSubtract(this.center, new Vector2D(this.left, this.top));
        this.draw();
    }
    draw() {
        // Draw the background
        engine.context.fillStyle = "rgb(232,247,248)";
        engine.context.fillStyle = "rgba(232,247,248,0.40)";
        engine.context.fillRect(this.left, this.top, this.width, this.height);
        // Draw the border
        engine.context.beginPath();
        engine.context.strokeStyle = "rgb(111, 192, 203)";
        engine.context.strokeStyle = "rgba(111, 192, 203, 0.99)";
        engine.context.lineWidth = 1;
        engine.context.moveTo(this.left, this.top);
        engine.context.lineTo(this.right, this.top);
        engine.context.lineTo(this.right, this.bottom);
        engine.context.lineTo(this.left, this.bottom);
        engine.context.lineTo(this.left, this.top);
        engine.context.stroke();
        // Draw the center point
        /* engine.context.beginPath();
        engine.context.strokeStyle = "#FF0000";
        engine.context.lineWidth = 2.5;
        engine.context.arc(this.center.x, this.center.y, 5, 0, degsToRads(360));
        engine.context.stroke(); */
    }
	// Check or set the square's occupation
	occupiedOn() { this.occupied = true; }
	occupiedOff() { this.occupied = false; }
	occupiedIsOn() { return this.occupied == true; }
    occupiedIsOff() { return this.occupied == false; }
    getSquare() { return this; }
	getShape() { return this.attachedShape; }
	setShape(shape) { this.attachedShape = shape; }
	removeShape() { this.attachedShape = "undefined"; }
	// Build links to neighboring grid squares
	buildLinks() {
		// Coordinates
		this.gridColumn = this.id % 9;
		this.gridRow = Math.floor(this.id / 9);
		
		// Neighbor links
		if (this.gridRow == 0) {
			this.linkTop = "undefined";
		} else {
			this.linkTop = game.playGrid.squares[`${parseInt(this.id) - 9}`];
		}
		if (this.gridRow == 8) {
			this.linkBottom = "undefined";
		} else {
			this.linkBottom = game.playGrid.squares[`${parseInt(this.id) + 9}`];
		}
		
		if (this.gridColumn == 0) {
			this.linkLeft = "undefined";
		} else {
			this.linkLeft = game.playGrid.squares[`${parseInt(this.id) - 1}`];
		}
		
		if (this.gridColumn == 8) {
			this.linkRight = "undefined";
		} else {
			this.linkRight = game.playGrid.squares[`${parseInt(this.id) + 1}`];
		}
		
		// Update links array
        this.linksArray = [this.linkTop, this.linkBottom, this.linkLeft, this.linkRight];
	}
	// Perform updates
	update() {
        // Ensure the regulator is ready
        // if (!this.regulator.isReady()) return;

		// Check if this grid is attached with a shape
		if (this.getShape() == "undefined") {
			// console.log(`Grid ${this.id} (${this.gridRow},${this.gridColumn}) is empty. Requesting new shape.`);
			// Search top links for the next available shape
			var current = this;
			while (current.linkTop !== "undefined") {
                if (current.linkTop.getShape() !== "undefined") {
                    // console.log(`Grid linkTop(${current.id}->${current.linkTop.id}): ${current.linkTop.getShape()}`);
                    current = current.linkTop;
                    break;
                } else {
                    current = current.linkTop;
                }
			}
			// If no shapes exist, request a shape spawn
			if (current.attachedShape == "undefined") {
				// console.log(`No shapes found. Generating a new one in spawn ${game.playSpawnSquares[this.gridColumn].id} at ${game.playSpawnSquares[this.gridColumn].center}...`);
				// Spawn
				var spawnShape = game.evaluateBoard.GenerateShape(game.playSpawnSquares[this.gridColumn].center);
				
				// If the spawn succeeded
				if (spawnShape !== "Too many entities") {
					// Attach the new shape
					this.setShape(spawnShape);
					// Notify the new shape of the attachment
                    spawnShape.attachedSquare = this;
				} else {
					// Wait
					// console.log(`Grid ${this.id} shape request failed.`);
				}
			} else {
				// Assign the shape to this square
                this.attachedShape = current.attachedShape;
				// Unassign the shape from its previous location
                current.attachedShape = "undefined";
				// Notify the shape of the new attachment
				this.attachedShape.attachedSquare = this;
            }
            // Move the assigned shape to this square
            this.attachedShape.forceMoveToLocation(this.center);
            // Notify the board evaluator that the grid has changed
            game.evaluateBoard.gridShifted = true;
		}
	}
	// Determine if the target equals any neighboring grid squares
	compareLinks(target) {
		for (var i = 0; i < this.linksArray.length; i++) {
			if (this.linksArray[i] !== "undefined") {
				if (target.id == this.linksArray[i].id) return true;
			}
		}
		return false;
    }
    // Search for unempty neighbors
	testLinks() {
		// Start the list with this grid
        this.matchesVertical = [this];
        this.matchesHorizontal = [this];
		// Vertical
		this.testTop();
		this.testBottom();
		// Horizontal
		this.testLeft();
        this.testRight();

        // Concatenate the arrays
        var matchesCombined = this.matchesVertical.concat(this.matchesHorizontal);
        // Remove the duplicate values using a set
        const matchesSet = new Set(matchesCombined);
        // Restore the array
        const matchesRestored = [...matchesSet];
        
        console.log(`Matches: ${matchesRestored.length}`);
	}
	// Test top links for matches
	testTop() {
		var current = this;
		while (current.linkTop !== "undefined") {
			this.matchesVertical.push(current.linkTop);
			current = current.linkTop;
		}
	}
	// Test bottom links for matches
	testBottom() {
		var current = this;
		while (current.linkBottom !== "undefined") {
			this.matchesVertical.push(current.linkBottom);
			current = current.linkBottom;
		}
	}
	// Test left links for matches
	testLeft() {
		var current = this;
		while (current.linkLeft !== "undefined") {
			this.matchesHorizontal.push(current.linkLeft);
			current = current.linkLeft;
		}
	}
	// Test right links for matches
	testRight() {
		var current = this;
		while (current.linkRight !== "undefined") {
			this.matchesHorizontal.push(current.linkRight);
			current = current.linkRight;
		}
    }
    // Search neighbors for matches
    testMatches() {
        // Start the list
        this.matchesCombined = [this];
        this.matchesVertical = [];
        this.matchesHorizontal = [];
		// Vertical
        this.testTopMatches();
        // console.log(`<Scene_Play>[GridSquare:TestMatches:Top]\nID: ${this.id}. Matches: ${this.matchesVertical.length}.`);
        this.testBottomMatches();
        // console.log(`<Scene_Play>[GridSquare:TestMatches:Bottom]\nID: ${this.id}. Matches ${this.matchesVertical.length}.`);
		// Horizontal
        this.testLeftMatches();
        // console.log(`<Scene_Play>[GridSquare:TestMatches:Left]\nID: ${this.id}. Matches ${this.matchesHorizontal.length}.`);
        this.testRightMatches();
        // console.log(`<Scene_Play>[GridSquare:TestMatches:Right]\nID: ${this.id}. Matches ${this.matchesHorizontal.length}.`);

        // Concatenate the arrays
        // Remove the duplicate values using a set
        // const matchesSet = new Set(matchesCombined);
        // Restore the array
        // const matchesRestored = [...matchesSet];

        if (this.matchesHorizontal.length > 1) this.matchesCombined.push(...this.matchesHorizontal);
        if (this.matchesVertical.length > 1) this.matchesCombined.push(...this.matchesVertical);
        
        // If other shapes match this shape, add this shape to the array
        if (this.matchesCombined.length > 1) this.matchesCombined.push(this);
        
        const matchesSet = new Set(this.matchesCombined);

        this.matchesCombined = [...matchesSet];

        if (this.matchesCombined.length > 2) {
            /* for (let item of matchesSet) {
                console.log(`Test Matches found: ${item.id}`);
            } */
            return matchesSet;
        }
        // console.log(`<Scene_Play>[GridSquare:TestMatches]\nID: ${this.id} found ${this.matchesCombined.length} matches: ${this.matchesCombined}\nLinks: ${this.linksArray}`);
        return "undefined";
    }
    // Test top links for matches
	testTopMatches() {
		var current = this;
		while (current.linkTop !== "undefined" && current.checkShapeType(current.linkTop)) {
			this.matchesVertical.push(current.linkTop);
			current = current.linkTop;
		}
	}
	// Test bottom links for matches
	testBottomMatches() {
		var current = this;
		while (current.linkBottom !== "undefined" && current.checkShapeType(current.linkBottom)) {
			this.matchesVertical.push(current.linkBottom);
			current = current.linkBottom;
		}
	}
	// Test left links for matches
	testLeftMatches() {
		var current = this;
		while (current.linkLeft !== "undefined" && current.checkShapeType(current.linkLeft)) {
			this.matchesHorizontal.push(current.linkLeft);
			current = current.linkLeft;
		}
	}
	// Test right links for matches
	testRightMatches() {
		var current = this;
		while (current.linkRight !== "undefined" && current.checkShapeType(current.linkRight)) {
			this.matchesHorizontal.push(current.linkRight);
			current = current.linkRight;
		}
    }
    // Check whether target's attached shape type matches this grid's attached shape type
    checkShapeType(target) {
        // console.log(`<Scene_Play>[GridSquare:CheckShapeType]\nID: ${this.id}\nThis: ${this.attachedShape.type}\nTarget: ${target.attachedShape.type}`);
        return this.attachedShape.type == target.attachedShape.type;
    }
	// Display a string for this square
	toString() {
		var s = ``;
		s += `ID: ${this.id} (${this.gridRow},${this.gridColumn})\n`;
		s += `Links:\n`;
		s += ` - Top: (${(typeof this.linkTop.gridRow !== "undefined") ? this.linkTop.gridRow : "none"},${(typeof this.linkTop.gridColumn !== "undefined") ? this.linkTop.gridColumn : "none"})\n`;
		s += ` - Bot: (${(typeof this.linkBottom.gridRow !== "undefined") ? this.linkBottom.gridRow : "none"},${(typeof this.linkBottom.gridColumn !== "undefined") ? this.linkBottom.gridColumn : "none"})\n`;
		s += ` - Lef: (${(typeof this.linkLeft.gridRow !== "undefined") ? this.linkLeft.gridRow : "none"},${(typeof this.linkLeft.gridColumn !== "undefined") ? this.linkLeft.gridColumn : "none"})\n`;
		s += ` - Rig: (${(typeof this.linkRight.gridRow !== "undefined") ? this.linkRight.gridRow : "none"},${(typeof this.linkRight.gridColumn !== "undefined") ? this.linkRight.gridColumn : "none"})`;
		console.log(`${s}`);
	}
	
};

class SpawnSquare {
    constructor(_id, top, left, width, height, _div) {
        this.id = _id;
        this.left = left;
        this.width = width;
        this.height = height;
        this.top = 0 - this.height;
        this.right = left + width;
        this.bottom = top + height;
        this.center = new Vector2D((left + width / 2), (top + height / 2));
		// Reference div
		this.divReference = _div;
		// Push reference to this square
        game.playSpawnSquares.push(this);
    }
    setPosition(newTop, newLeft) {
		this.width = game.playFieldGrid.gridWidth;
		this.height = game.playFieldGrid.gridHeight;
		this.top = 0 - this.height;
        this.left = newLeft + game.playFieldGrid.posX;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        this.center = new Vector2D((this.left + this.width / 2), (this.top + this.height / 2));
        this.draw();
    }
    draw() {
        // Draw the background
        // engine.context.fillStyle = "rgb(232,247,248)";
        engine.context.fillStyle = "rgba(10,62,66,0.40)";
        engine.context.fillRect(this.left, this.top, this.width, this.height);
        // Draw the border
        // engine.context.strokeStyle = "rgb(111, 192, 203)";
        engine.context.strokeStyle = "rgba(203,111,185,0.99)";
        engine.context.lineWidth = 1;
        engine.context.moveTo(this.left, this.top);
        engine.context.lineTo(this.right, this.top);
        engine.context.lineTo(this.right, this.bottom);
        engine.context.lineTo(this.left, this.bottom);
        engine.context.lineTo(this.left, this.top);
        engine.context.stroke();
        // Draw the center point
        /* engine.context.beginPath();
        engine.context.strokeStyle = "#00FFBB";
        engine.context.lineWidth = 2.5;
        engine.context.arc(this.center.x, this.center.y, 5, 0, degsToRads(360));
        engine.context.stroke(); */
    }
};

//   - Images
game.playBackground = {
    // Get handle to image
    image: document.getElementById("playBackground"),
    // Declare object transform information
    org_width: 1920 * game.scale,
    org_heigth: 1080 * game.scale,
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

game.playTimeBoardBG = {
    // Get handle to image
    image: document.getElementById("playTimeBoardBG"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_heigth: 350 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference))
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playTimeBoard = {
    // Get handle to div
    div: document.getElementById("playTimeBoard"),
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
    timer: new Timer(),
    playTime: new Timer(),
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.playTimeBoard.clickMe);
        this.timer.setup(150, true, "Game Timer");
        game.timers.push(this.timer);
        this.playTime.setup(0, true, "Play Time", "up");
        game.timers.push(this.playTime);
    },
    // Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (game.playTimeBoardBG.posX + game.playTimeBoardBG.width / 2) - this.width / 2;
        this.posY = game.playTimeBoardBG.posY + game.playTimeBoardBG.height - this.height - 16 * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Adjust font size
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
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    // Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    },
    startTimer: function () {
        if (this.timer.paused) {
            this.timer.unpauseTimer();
        }
        if (this.playTime.paused) {
            this.playTime.unpauseTimer();
        }
    },
    displayTimer: function () {
        this.startTimer();
        this.div.innerHTML = this.timer.displayMinuteSeconds();
    },
    resetTimer: function () {
        this.timer.setup(150, true, "Game Timer");
    }
};
game.playTimeBoard.init(); // Force initialize playTimeBoard's event listener

game.playTitle = {
    // Get handle to image
    image: document.getElementById("titleWhite"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_heigth: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTimeBoardBG.posY + game.playTimeBoardBG.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playScoreBoard = {
    // Get handle to image
    image: document.getElementById("scoreBoard"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_heigth: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTitle.posY + game.playTitle.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playScore = {
    // Get handle to div element
    div: document.getElementById("playerScore"),
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
        this.div.addEventListener("click", game.playScore.clickMe);
    },
    textResize: function () {
        // Declare references to screen objects
        var mySpan = $("#playScoreSpan");
        var myDiv = $("#playerScore");

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

        // Set the player score to the proper size
        $("#playerScore").css("font-size", this.font_size).html(mySpan.html());
    },
    // Adjust the object's transform
    resize: function () {

        this.width = game.playScoreBoard.width * 0.8;
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (game.playScoreBoard.posX + game.playScoreBoard.width / 2) - this.width / 2;
        this.posY = game.playScoreBoard.posY + game.playScoreBoard.height * 0.32;

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

game.playFieldBackground = {
    // Get handle to image
    image: document.getElementById("playField"),
    // Declare object transform information
    org_width: 1026 * game.scale,
    org_heigth: 940 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (((game.playTitle.posX + game.playTitle.width) + game.playSponsor.posX) / 2) - (this.width / 2);
        this.posY = engine.height / 2 - this.height / 2;
    },
    // Draw the object
    draw: function () {
        this.resize();
        // engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsor = {
    // Get handle
    image: document.getElementById("sponsorsBox"),
    // Declare object information
    org_width: 340 * game.scale,
    org_height: 620 * game.scale,
    width: 0,
    height: 0,
    org_posX: 0,
    org_posY: 0,
    posX: 0,
    posY: 0,
    // Adjust transformation
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width - this.width;
        this.posY = engine.height - this.height;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsorLogo = {
    // Get handle
    image: function () {
        return document.getElementById(game.sponsors.getSponsor());
    },
    // Declare object information
    org_width: 200 * game.scale,
    org_height: 200 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1590,
    org_posY: 785,
    posX: 0,
    posY: 0,
    // Adjust transformation
    resize: function () {
        this.width = game.playSponsor.width * 0.70;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.playSponsor.posX + 35 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playSponsor.posY + game.playSponsor.height / 2 - this.height / 3;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image(), this.posX, this.posY, this.width, this.height);
    }
};

game.playFieldGrid = {
    // Get handle to div
    div: document.getElementById("playGrid"),
	spawnDiv: document.getElementById("playSpawn"),
    // Define transform information
    org_width: 1026 * game.scale,
    org_height: 940 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	gridWidth: 0,
	gridHeight: 0,
    gridArray: [],
	spawnArray: [],
    // Adjust transformation
    resize: function () {
        // Set div size equal to play field background
        this.width = game.playFieldBackground.width;
        this.height = game.playFieldBackground.height;

        // Position div on top of play field background
        this.posX = game.playFieldBackground.posX;
        this.posY = game.playFieldBackground.posY;
		
		// Update grid square dimensions
		this.gridWidth = Math.floor(game.playFieldGrid.width / 9 - 2);
		this.gridHeight = Math.floor(game.playFieldGrid.height / 9 - 2);
		
		// Update bounding box information
		this.top = this.posY;
		this.bottom = this.posY + this.height;
		this.left = this.posX;
		this.right = this.posX + this.width;
    },
    draw: function () {
		// Set the field's transform
        this.adjustStyle();
		
		if (this.gridArray.length == 0 || this.spawnArray.length == 0) {
			// Clear the arrays
			this.hideGrid();
			// Build the grid and spawners
			this.buildGrid();	
			// Build grid links
			game.playGrid.linkSquares();
		}
		// Resize grid divs
		this.resizeArrayElements();
		// Reposition grid squares
        this.adjustGrid();
		// Reposition spawn squares
		this.adjustSpawn();
    },
    adjustStyle: function () {
        this.resize();
		// Grid Area
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 3;
		// Spawn Area
		this.spawnDiv.style.position = "absolute";
        this.spawnDiv.style.display = "block";
        this.spawnDiv.style.left = this.posX.toString() + "px";
        this.spawnDiv.style.top = (-this.gridHeight - 15 * (1 - Math.max(engine.widthProportion, engine.heightProportion))) + "px";
        this.spawnDiv.style.width = this.width + "px";
        this.spawnDiv.style.height = this.gridHeight + 2 + "px";
        this.spawnDiv.style.zIndex = 3;
    },
	resizeArrayElements: function() {
		// Temporary DOM reference
		var domReference;
		// Grid divs
		for (var i = 0; i < this.gridArray.length; i++) {
			domReference = document.getElementById(this.gridArray[i]);
			domReference.style.width = this.gridWidth + "px";
			domReference.style.height = this.gridHeight + "px";
		}
		// Spawn divs
		for (var i = 0; i < this.spawnArray.length; i++) {
			domReference = document.getElementById(this.spawnArray[i]);
			domReference.style.width = this.gridWidth + "px";
			domReference.style.height = this.gridHeight + "px";
		}
	},
	hideGrid: function() {
		this.gridArray = [];
		this.spawnArray = [];
	},
    buildGrid: function () {
        var containerNum = "";
        var divPrefix = '<div id="gemGridDiv'
		var spawnPrefix = '<div id="spawnGridDiv'
        var gridBuilder = '';
		var spawnBuilder = '';
		var row = 0;
		var col = -1;
        for (var i = 0; i < 81; i++) {
			if (i == 9 + (9*row)) {
				col -= 8;
				row++;
			} else {
				col++;
			}
			
			if (row == 0) {
				spawnBuilder += spawnPrefix + i + '" class="spawn-container" style="display:inline-block; width:' + this.gridWidth + 'px;height: ' + this.gridHeight + 'px;margin:0px;"></div>';
				
				game.playFieldGrid.spawnArray.push("spawnGridDiv" + i);
				
				var spawnSquare = new SpawnSquare(`${i}`, 0, this.spawnDiv.style.offsetLeft, this.gridWidth, this.gridHeight, this.spawnArray[i]);
			}
			
            gridBuilder += divPrefix + i + '" class="gem-container" style="display:inline-block; width:' + this.gridWidth + 'px;height: ' + this.gridHeight + 'px;margin:0px;"></div>';

			game.playFieldGrid.gridArray.push("gemGridDiv" + i);
			
            var gridSquare = new GridSquare(`${i}`, 0, 0, this.gridWidth, this.gridHeight, col.toFixed(0), this.gridArray[i]);
        };
		
		// Close the spawn container
		spawnBuilder += "</div>";
		
		// Close the grid container
		gridBuilder += "</div>";
		
		// Publish the grid squares
        game.playFieldGrid.div.innerHTML = gridBuilder;
		// Publish the spawn squares
		game.playFieldGrid.spawnDiv.innerHTML = spawnBuilder;
    },
    adjustGrid: function () {
        // Update Grid Square Objects
        var z = document.getElementsByClassName("gem-container");
        for (var i = 0; i < z.length; i++) {
            var dom = z[i];
            game.playGrid.squares[i].setPosition(dom.offsetTop, dom.offsetLeft);
            game.playGrid.squares[i].draw();
        }
    },
	adjustSpawn: function () {
        // Update Spawn Square Objects
		var z = document.getElementsByClassName("spawn-container");
        for (var i = 0; i < z.length; i++) {
            var dom = z[i];
            game.playSpawnSquares[i].setPosition(-this.gridHeight, dom.offsetLeft);
            game.playSpawnSquares[i].draw();
        }
	}
};

// - Gems
game.playBackground = {
    // Get handle to image
    image: document.getElementById("playBackground"),
    // Declare object transform information
    org_width: 1920 * game.scale,
    org_heigth: 1080 * game.scale,
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

game.gemTriangle = {
	// Get handle to image
    image: document.getElementById("gemTriangle"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemStar = {
	// Get handle to image
    image: document.getElementById("gemStar"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemHeart = {
	// Get handle to image
    image: document.getElementById("gemHeart"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemSquare = {
	// Get handle to image
    image: document.getElementById("gemSquare"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemCircle = {
	// Get handle to image
    image: document.getElementById("gemCircle"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemPentagon = {
	// Get handle to image
    image: document.getElementById("gemPentagon"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};

game.gemRectangle = {
	// Get handle to image
    image: document.getElementById("gemRectangle"),
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
}

game.gemSponsor = {
	// Get type for this sponsor
	type: null,
	// Get handle to image
    image: function () {
		var newSponsor = game.sponsors.getSponsored();
		this.type = getTypeByName(newSponsor);
        return document.getElementById(`${"gem_"+newSponsor}`);
    },
    // Declare object transform information
    org_width: 99 * game.scale,
    org_heigth: 99 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
    // Draw the object
    draw: function () {
        this.resize();
    }
};