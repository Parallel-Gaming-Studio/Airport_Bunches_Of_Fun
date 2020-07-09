//========================================================================
// DeVry University - New Development
// PROJECT TITLE:   Airport Bunches of Fun
// PROJECT DATE:    05/04/2020
// TEAM:            Parallel Gaming Studio
// PROGRAMMERS:     Chris Medeiros
//                  Samantha Harvey
//                  Joanna Blackwell
//                  Allen Chen
//                  Mohamed Alsalaous
//                  Gerren Clark
//                  Jonathon Havens
//                  Dusty Schlotfeldt
// FILE NAME:       game.js
// DESCRIPTION:     Controls the heart of Airport Bunches of Fun
// LAST UPDATE:     05/07/2020 - Created main game.js file to work from
//========================================================================

// Initialize game object
window.game = Object.create(GameObject.prototype);

// Keybindings
game.keys = ['A', 'S', 'D', 'F', 'O', 'C'];
for (var i = 0; i < game.keys.length - 1; i++) {
    engine.input.bind(engine.key[game.keys[i]], game.keys[i]);
}

// Control bindings for testing purposes
game.controls = ['SPACE'];
for (var i = 0; i < game.controls.length; i++) {
    engine.input.bind(engine.key[game.controls[i]], game.controls[i]);
};

// Mouse bindings
game.mouse = ['LEFT', 'MIDDLE', 'RIGHT', 'WHEELDOWN', 'WHEELUP'];
for (var i = 0; i < game.mouse.length; i++) {
    // engine.input.bind(engine.button.LEFT, 'left_click');
    engine.input.bind(engine.button[game.mouse[i]], game.mouse[i]);
}

// Touch bindings
game.touch = ['START', 'MOVE', 'END', 'LEAVE', 'CANCEL'];
for (var i = 0; i < game.touch.length; i++) {
    engine.input.bind(engine.touch[game.touch[i]], game.touch[i]);
}

// Declare Game Variables
// - Globals
game.frameRate = 0.0;
game.frameCount = 0.0;
game.frameTime = 0.00001;
game.frameDraw = 0.00001;
game.frameArray = [];
game.frameAvg = 0.0;
game.scale = 1.0;
game.timeoutTime = 120;					// Timeout time before returning to landing page
game.lastTimeSized = new Date();        // Used to track window resizing without window events
game.timers = [];                       // Array for all timers
// Sponsors
game.lastSponsor = ""; // Previously used sponsor
game.sponsor = ""; // Current sponsor
game.nextSponsor = ""; // Next sponsor
game.sponsorId = ""; // Current sponsor's ID
// Regulators
game.regulators = {
    regList: [],
    regIndex: -1,
    addRegulator: function (reg) {
        this.regList.unshift(reg);
        if (this.lastIndex < 0) this.lastIndex = 0;
    },
    removeRegulator: function (reg) {
        for (var i = 0; i < this.regList.length; i++) {
            if (reg == this.regList[i]) {
                this.regList.splice(i, 1);
                break;
            }
        }
    },
    update: function () {
        this.regIndex++;
        if (this.regIndex >= 0 && this.regList.length > 0) {
            if (this.regIndex >= this.regList.length) this.regIndex = 0;
            if (this.regList[this.regIndex].isReady()) {
                this.regList[this.regIndex].owner.update();
                // console.log(`Updating ${this.regList[this.regIndex].owner.id}`);
            }
        }
    }
};
// Grid Squares
game.playGrid = {
    squares: [],
    evaluateList: [],
    popList: [],
    evalInProgress: false,
    addSquare: function (newSquare) {
        this.squares.push(newSquare.getSquare());
        this.evaluateList.push(newSquare.getSquare());
    },
    linkSquares: function () {
        for (var i = 0; i < this.squares.length; i++) {
            this.squares[i].buildLinks();
        }
    },
    clearGrid: function () {
        while (this.squares.length > 0) {
            // console.log(`<Game>[PlayGrid:ClearGrid] Reg Count\nBefore ${game.regulators.regList.length}`);
            game.regulators.removeRegulator(this.squares.pop().regulator);
        }
    },
    readiness: function() {
        for (var i = 0; i < this.squares.length; i++) {
            // console.log(`Grid ${this.squares[i].id} readiness: ${this.squares[i].readyForEval}`);
            if (!this.squares[i].readyForEval) return false;
        }
        return true;
    },
    // Returns the square's index
    getIndexOf: function(arg) {
        for (var i = 0; i < this.squares.length; i++) {
            if (parseInt(arg.id) == parseInt(this.squares.id)) return i;
        }
        return -1;
    },
    // FSM - Play loop actions
    // Empty square methods and variables
    emptySquaresList: [],
    checkEmptyStarted: false,
    checkEmptyFinished: true,
    checkEmptySquares: function() {
        var testEmpty = true;
        this.checkEmptyFinished = false;
        for (var i = this.squares.length - 1; i >= 0; i--) {
            /*if (this.squares[i].getShape() == "undefined") {
                this.emptySquaresList.push(this.squares[i]);
                if (testEmpty) testEmpty = false;
            }*/
            this.squares[i].update();
        }
        this.checkEmptyFinished = true;
        return testEmpty;
    },
    // Fill the empty squares
    checkFillStarted: false,
    checkFillFinished: true,
    checkFillSquares: function() {
        this.checkFillFinished = false;
        // console.log(`Filling ${this.emptySquaresList.length} squares`);
        while (this.emptySquaresList.length > 0) {
            let x = this.emptySquaresList.pop().update();
            // x.update();
        }
        this.checkFillFinished = true;
    },

    // Truncate extra shapes and DOMs
    checkTruncateStarted: false,
    checkTruncateFinished: true,

    // Evaluate the board
    checkEvaluateStarted: false,
    checkEvaluateFinished: true,
    evaluateBoard: function () {
        this.checkEvaluateFinished = false;
        // Container to hold the grid being tested
        var gridTest;
        // Container to store all the positive matches
        var updateList = [];

        // console.log(`Evaluating\nEvaluate List Size: ${this.evaluateList.length}\n`);
        // this.evaluateList.push(...this.squares);

        for (var i = 0; i < this.evaluateList.length; i++) {
            // Store matches
            try {
            let tester = this.evaluateList[i].testMatches();
            
            if (tester !== "undefined") {
                updateList.push(...this.evaluateList[i].testMatches());
            }
            } catch (e) {}
        }

        this.evaluateList = [];

        const matchesSet = new Set(updateList);

        this.popList = [...matchesSet];

        // console.log(`Evaluating\nPop List Size: ${this.popList.length}\n`);

        game.evaluateBoard.evaluating = false;

        this.checkEvaluateFinished = true;
    },

    // Pop evaluated shapes from the board
    checkPopStarted: false,
    checkPopFinished: true,
    popShapes: function () {
        this.checkPopFinished = false;

        // console.log(`Popping\nPop List Size: ${this.popList.length}\n`);

        while (this.popList.length > 0) {
            let x = this.popList.pop().attachedShape;
            if (x !== "undefined") {
                x.popShape();
                this.popReturnable(x);
            }
        }

        this.checkPopFinished = true;
    },

    // Return moved shapes that failed evaluation
    checkReturnStarted: false,
    checkReturnFinished: true,
    checkReturnList: [],
    returnShapes: function() {
        this.checkReturnFinished = false;

        // Ensure the check return list is exactly two elements long
        if (this.checkReturnList.length > 1) {
            // Ensure the first element is NOT null
            if (this.checkReturnList[0] != null) {
                // Ensure the second element also is NOT null
                if (this.checkReturnList[1] != null) {
                    // Return the shapes to their original positions
                    let tempShapeStart = this.checkReturnList[0];
                    let tempShapeDest = this.checkReturnList[1];
                    let tempSquareStart = tempShapeStart.lastAttachedSquare;
                    let tempSquareDest = tempShapeDest.lastAttachedSquare;

                    // Assign both shapes' previous squares
                    tempShapeStart.attachedSquare = tempShapeStart.lastAttachedSquare;
                    tempShapeDest.attachedSquare = tempShapeDest.lastAttachedSquare;

                    // Assign both shapes' new squares
                    tempShapeStart.attachedSquare = tempSquareStart;
                    tempShapeDest.attachedSquare = tempSquareDest;

                    // Assign both squares' their new shapes
                    tempSquareStart.attachedShape = tempShapeStart;
                    tempSquareDest.attachedShape = tempShapeDest;

                    // Move both shapes to their new positions
                    tempShapeStart.forceMoveToLocation(tempShapeStart.attachedSquare.center);
                    tempShapeDest.forceMoveToLocation(tempShapeDest.attachedSquare.center);

                    // Remove the last attached square from each shape
                    tempShapeStart.lastAttachedSquare = "undefined";
                    tempShapeDest.lastAttachedSquare = "undefined";

                    // Clear the return list
                    this.checkReturnList = [];
                    
                } else {
                    // Shapes past evaluation, so clear the list
                    this.checkReturnList = [];
                }
            } else {
                // Shapes past evaluation, so clear the list
                this.checkReturnList = [];
            }
        } else {
            //console.log(`Too few elements in the return list: ${this.checkReturnList.length}`);
        }

        // Since the operation is complete, clear the selectors
        this.checkReturnList = [];

        this.checkReturnFinished = true;
    },
    popReturnable: function(arg) {
        for (var i = 0; i < this.checkReturnList.length; i++) {
            // console.log(`Pop Returnable : Comparing...\n${arg} <> ${this.checkReturnList[i]}`);
            if (arg === this.checkReturnList[i]) {
                this.checkReturnList = [];
                // console.log(`Pop Returnable Found`);
                break;
            }
        }
    },

    // Act on the user's input
    checkInputStarted: false,
    checkInputFinished: true,
    checkInputList: [],
    checkInput: function() {
        this.checkInputFinished = false;

        // Ensure the check input list is exactly two elements long
        if (this.checkInputList.length == 2) {
            // Ensure the first element is NOT null
            if (this.checkInputList[0] != null) {
                // Ensure the second element also is NOT null
                if (this.checkInputList[1] != null) {
                    // Temporarily store the selected shapes and their attachments, reducing the risk of items leaving scope
                    let tempSquareStart = this.checkInputList[0];
                    let tempSquareDest = this.checkInputList[1];
                    let tempShapeStart = tempSquareStart.attachedShape;
                    let tempShapeDest = tempSquareDest.attachedShape;

                    // Ensure the requested move is valid
                    if (tempSquareStart.compareLinks(tempSquareDest)) {
                        // Assign both shapes' previous squares
                        tempShapeStart.lastAttachedSquare = tempShapeStart.attachedSquare;
                        tempShapeDest.lastAttachedSquare = tempShapeDest.attachedSquare;

                        // Assign both shapes' new squares
                        tempShapeStart.attachedSquare = tempSquareDest;
                        tempShapeDest.attachedSquare = tempSquareStart;

                        // Assign both squares' their new shapes
                        tempSquareStart.attachedShape = tempShapeDest;
                        tempSquareDest.attachedShape = tempShapeStart;

                        // Move both shapes to their new positions
                        tempShapeStart.forceMoveToLocation(tempShapeStart.attachedSquare.center);
                        tempShapeDest.forceMoveToLocation(tempShapeDest.attachedSquare.center);

                        // Add both shapes to the potential return list
                        this.checkReturnList.push(tempShapeStart, tempShapeDest);

                        // Add both squares to the evaluate list
                        this.evaluateList.push(tempSquareStart, tempSquareDest);
                    }
                }
            }
        }

        // Since the input completed, clear all the selections
        game.previousSquare = null;
        game.releaseSelectedSquare();
        this.checkInputList = [];

        this.checkInputFinished = true;
    }
};
// Spawn Squares
game.playSpawnSquares = [];
// Entities
game.gameEntities = {
    entities: [],
    evaluateList: [],
    animatingList: [],
    playerMovesList: [],
    addEntity: function (newEntity) { this.entities.unshift(newEntity); },
    removeEntity: function (delEntity) {
        // console.log(`<Game>[GameEntities:RemoveEntity] Ent Count\nBefore ${this.entities.length}\nRemoving ${delEntity.id}`);
        let tempList = [];
        for (var i = 0; i < this.entities.length; i++) {
            if (delEntity != this.entities[i]) {
                tempList.push(this.entities[i]);
            } else {
                this.entities[i].destroyDiv();
            }
        }

        this.entities = [...tempList];

        // console.log(`<Game>[GameEntities:RemoveEntity] Ent Count\nAfter ${this.entities.length}`);
    },
    clearEntities: function () { this.entities = []; },
    drawEntities: function () {
        for (var i = 0; i < this.entities.length; i++) {
            // console.log(`${this.entities[i].isAlive()} ${this.entities.length}`);
            this.entities[i].draw();
        }
    },
    // Check if any shapes are moving
    entityAnimations: function() {
        return this.animatingList.length > 0;
    },
    removeAnimating: function(delEntity) {
        let tempList = [];
        for (var i = 0; i < this.animatingList.length; i++) {
            if (delEntity != this.animatingList[i]) {
                tempList.push(this.animatingList[i]);
            }
        }

        this.animatingList = [...tempList];
    },
    removePlayerMoves: function(delEntity) {
        let tempList = [];
        for (var i = 0; i < this.playerMovesList.length; i++) {
            if (delEntity != this.playerMovesList[i]) {
                tempList.push(this.playerMovesList[i]);
            }
        }
        this.player
    },
    // Returns the entity's index
    getIndexOf: function(arg) {
        for (var i = 0; i < this.entities.length; i++) {
            if (parseInt(arg.id) == parseInt(this.entities.id)) return i;
        }
        return -1;
    },
    updateEntities: function (dt) {
        var movingFound = false;
        try {
            // console.log(`<Game>[GameEntities:UpdateEntities]\nList Size: ${this.evaluateList.length}`);
            for (var i = 0; i < this.evaluateList.length; i++) {
                if (this.evaluateList[i].lastAttachedSquare !== "undefined" && this.evaluateList[i].isMoving) {
                    movingFound = true;
                    break;
                }
            }

            if (!movingFound && game.playGrid.evaluateList.length == 0) {
                for (var i = 0; i < this.evaluateList.length; i++) {
                    // console.log(`<Game>[GameEntities:UpdateEntities]\nShape ID: ${this.evaluateList[i].id}`);
                    if (this.evaluateList[i].lastAttachedSquare !== "undefined" && !this.evaluateList[i].isMoving) {
                        this.evaluateList[i].returnToLastPosition();
                    }
                }

                this.evaluateList = [];
            }
        } catch (e) {}
    },

    toString: function () { for (var i = this.entities.length - 1; i >= 0; i--) { console.log(`Entity Info:\nID: ${this.entities[i].ID()}\nType: ${this.entities[i].entityType()}\nTagged: ${this.entities[i].isTagged()}`); } }
}

// Shapes
game.shapeRadius = 0.0;
game.shapeMaxSpeed = 20.0;
game.shapeMass = 1.1;
game.shapeScale = new Vector2D(1.0, 1.0);
game.shapeTurnRate = 0.261799; // ~15 degrees
game.shapeMaxForce = 2.0;
game.shapeFOV = degsToRads(360.0);
game.shapes = [];
game.shapesList = ["circle", "heart", "pentagon", "rectangle", "square", "star", "triangle", "sponsored"];

// - Player object information (persists through scenes)
game.player = {
    score: 0,
    initials: "ZZ",
    timeTotal: 0,   // Time in seconds
    // Reset player object variables
    reset: function () {
        this.score = 0;
        this.initials = "";
        this.timeTotal = 0;
        // Reset global score
        game.score = 0;
    }
};

// Google Analytics
/*		*** WARNING *** WARNING *** WARNING ***
 *** DO NOT UNCOMMENT THE GTAG() FUNCTIONS BEFORE DEPLOYMENT ***/
game.google = {
    load: function () {
        // Inform Google of Start Scene landing
        // gtag('event', 'screen_view', {'screen_name': 'Menu'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:load>");
    },
    start: function () {
        // Inform Google of Play Scene landing
        // gtag('event', 'screen_view', {'screen_name': 'Start'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:start>");
    },
    finish: function () {
        // Inform Google when player submits their initials (complete play through)
        // gtag('event', 'screen_view', {'screen_name': 'Finish'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:finish>");
    },
    quit: function () {
        // Inform Google of a player quitting the game
        // gtag('event', 'screen_view', {'screen_name': 'Quit'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:quit>");
    },
    timeOut: function () {
        // Inform Google of a game timeout (inactivity)
        // gtag('event', 'screen_view', {'screen_name': 'TimeOut'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:timeOut>");
    },
    leaderboard: function () {
        // Inform Google of players going straight to the leaderboard (from Start Scene)
        // gtag('event', 'screen_view', {'screen_name': 'Leaderboard'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:leaderboard>");
    }
};
/*
 *** DO NOT UNCOMMENT THE GTAG() FUNCTIONS BEFORE DEPLOYMENT ***
 *** WARNING *** WARNING *** WARNING ***
 */

// Game functions
// Display an interactive overlay after a period of inactivity
// - Return to landing page upon a lack of interaction
game.timeoutOverlay = {
    // Handle to overlay
    div: document.getElementById("timeoutOverlay"),
    // Handle to header message
    divHeader: document.getElementById("timeoutHeader"),
    // Handle to instructions message
    divInstructions: document.getElementById("timeoutInstructions"),
    // Handle to timer
    divTimer: document.getElementById("timeoutTimer"),
    // Declare variables
    initialTime: null,
    finalTime: null,
    currentTime: null,
    initialTimerExpired: false,
    finalTimerExpired: false,
    // Initialize overlay
    init: function () {
        // Hide the overlay
        this.hideOverlay();

        // Add event listener to the main overlay div element
        this.div.addEventListener("click", function (e) {
            game.timeoutOverlay.refreshTimer();
        });

        // Initialize all variables
        this.resetTimer();
    },
    // Show the overlay and its children
    showOverlay: function () {
        this.div.style.display = "block";
        this.divHeader.style.display = "block";
        this.divInstructions.style.display = "block";
        this.divTimer.style.display = "block";
    },
    // Hide the overlay and its children
    hideOverlay: function () {
        this.div.style.display = "none";
    },
    // Update the overlay and its timers
    update: function (dt) {
        if (this.currentTime != null) {
            // Update the current time
            this.updateTime(dt);

            // Update the active timer (primary/secondary)
            if (!this.initialTimerExpired) {
                this.initialTimer(dt);
            } else if (!this.finalTimerExpired) {
                this.finalTimer(dt);
            }
        } else if (this.initialTimerExpired && this.finalTimerExpired) {
            // All timers expired - redirect
            this.expireTimer();
        }
    },
    // Initialize the primary timer and start its countdown
    initialTimer: function (dt) {
        // Check whether the time is greater than the limit
        if (this.currentTime >= this.initialTime) {
            // Reset the timer to zero
            this.currentTime = 0;
            // Flag the initial timer as complete
            this.initialTimerExpired = true;
            // Display the overlay
            this.showOverlay();
        }
    },
    // Display the secondary timer
    finalTimer: function (dt) {
        // Update the time left
        this.divTimer.innerHTML = ". . . " + Math.ceil(this.finalTime - this.currentTime) + " . . .";

        // Check whether the time is greater than the limit
        if (this.currentTime >= this.finalTime) {
            // Set the timer to null, stopping execution
            this.currentTime = null;
            // Flag the final timer as complete
            this.finalTimerExpired = true;
        }
    },
    // Update the time counter
    updateTime: function (dt) {
        this.currentTime += dt;
    },
    // Refresh the timer upon user interaction
    refreshTimer: function () {
        this.resetTimer();
        // console.log("Timer refreshed");
    },
    // Reset the timer
    resetTimer: function () {
        // Hide the overlay
        this.hideOverlay();
        // Reinitialize all variables
        this.initialTime = game.timeoutTime;
        this.finalTime = game.timeoutTime / 10;
        this.currentTime = 0;
        this.initialTimerExpired = false;
        this.finalTimerExpired = false;
    },
    // Timeout expired
    expireTimer: function () {
        // Notify Google a timeout was reached
        game.google.timeOut();
        // Redirect to the OHare landing page
        window.location.replace("http://www.flywithbutchohare.com/");
    }
};
game.timeoutOverlay.init(); // Force initialization of the timer during script load

//Tutorial Overlay
game.tutorialOverlay = {
    div: document.getElementById("tutorialOverlay"),
    divContent: document.getElementById("tutorialContent"),
    closeButton: document.getElementById("tutorialCloseButton"),
    org_header_size: 90,
    org_select_size: 53,
    org_action_size: 80,
    org_closer_size: 60,
    open: function () {
        this.div.style.display = "block";
        this.divContent.style.display = "block";
        this.div.style.height = "100%";
        console.log("<Game:Tutorial> Open");
    },
    close: function () {
        this.div.style.height = "0%";
        console.log("<Game:Tutorial> Close");
    },
    tester: (key) => {
        console.log('Key: ${key}');
    },
    resize: function () {
        this.divContent.style.fontSize = this.org_select_size * (1 - Math.max(engine.widthProportion, engine.heightProportion)) + "px";
        this.closeButton.style.fontSize = this.org_closer_size * (1 - Math.max(engine.widthProportion, engine.heightProportion)) + "px";
    }
};

// Sponsor control
game.sponsors = {
    sponsorArray: ['ARGO TEA', 'AUNTIE ANNES', 'BROOKSTONE', 'BSMOOTH', 'BURRITO BEACH', 'CHICAGO SPORTS', 'CNN', 'COACH', 'DUNKIN DONUTS', 'DUTY FREE STORE', 'FIELD', 'HUDSON', 'MAC COSMETICS', 'NUTS ON CLARK', 'ROCKY MOUNTAIN CHOCOLATE', 'SARAHS CANDIES', 'SHOE HOSPITAL', 'SPIRIT OF THE RED HORSE', 'TALIE'],
    sponsor: '',
    sponsorId: '',
    sponsored: '',
    sponsoredId: '',
    sponsoredUpdate: function () {
        this.sponsored = this.sponsorArray[Math.floor(Math.random() * (this.sponsorArray.length))];
    },
    update: function () {
        this.sponsor = this.sponsorArray[Math.floor(Math.random() * (this.sponsorArray.length))];
        game.sponsor = this.sponsor;
    },
    // Get the sponsor
    getSponsor: function () {
        switch (this.sponsor) {
            case "ARGO TEA":
                this.sponsorId = "sponsorArgo";
                break;
            case "AUNTIE ANNES":
                this.sponsorId = "sponsorAuntieAnnes";
                break;
            case "BROOKSTONE":
                this.sponsorId = "sponsorBrookstone";
                break;
            case "BSMOOTH":
                this.sponsorId = "sponsorBSmooth";
                break;
            case "BURRITO BEACH":
                this.sponsorId = "sponsorBurritoBeach";
                break;
            case "CHICAGO SPORTS":
                this.sponsorId = "sponsorChicagoSports";
                break;
            case "CNN":
                this.sponsorId = "sponsorCNN";
                break;
            case "COACH":
                this.sponsorId = "sponsorCoach";
                break;
            case "DUNKIN DONUTS":
                this.sponsorId = "sponsorDunkinDonuts";
                break;
            case "DUTY FREE STORE":
                this.sponsorId = "sponsorDutyFreeStore";
                break;
            case "FIELD":
                this.sponsorId = "sponsorField";
                break;
            case "HUDSON":
                this.sponsorId = "sponsorHudson";
                break;
            case "MAC COSMETICS":
                this.sponsorId = "sponsorMacCosmetics";
                break;
            case "NUTS ON CLARK":
                this.sponsorId = "sponsorNutsOnClark";
                break;
            case "ROCKY MOUNTAIN CHOCOLATE":
                this.sponsorId = "sponsorRockyMountainChocolate";
                break;
            case "SARAHS CANDIES":
                this.sponsorId = "sponsorSarahsCandies";
                break;
            case "SHOE HOSPITAL":
                this.sponsorId = "sponsorShoeHospital";
                break;
            case "SPIRIT OF THE RED HORSE":
                this.sponsorId = "sponsorSpiritOfTheRedHorse";
                break;
            case "TALIE":
                this.sponsorId = "sponsorTalie";
                break;
            default:
                this.sponsorId = "__INVALID__";
                break;
        }
        // Update the game's sponsor
        game.sponsorId = this.sponsorId;

        // Return the sponsor ID
        return this.sponsorId;
    },
    // Get the sponsor
    getSponsored: function () {
        this.sponsoredUpdate();
        switch (this.sponsored) {
            case "ARGO TEA":
                this.sponsoredId = "sponsorArgo";
                break;
            case "AUNTIE ANNES":
                this.sponsoredId = "sponsorAuntieAnnes";
                break;
            case "BROOKSTONE":
                this.sponsoredId = "sponsorBrookstone";
                break;
            case "BSMOOTH":
                this.sponsoredId = "sponsorBSmooth";
                break;
            case "BURRITO BEACH":
                this.sponsoredId = "sponsorBurritoBeach";
                break;
            case "CHICAGO SPORTS":
                this.sponsoredId = "sponsorChicagoSports";
                break;
            case "CNN":
                this.sponsoredId = "sponsorCNN";
                break;
            case "COACH":
                this.sponsoredId = "sponsorCoach";
                break;
            case "DUNKIN DONUTS":
                this.sponsoredId = "sponsorDunkinDonuts";
                break;
            case "DUTY FREE STORE":
                this.sponsoredId = "sponsorDutyFreeStore";
                break;
            case "FIELD":
                this.sponsoredId = "sponsorField";
                break;
            case "HUDSON":
                this.sponsoredId = "sponsorHudson";
                break;
            case "MAC COSMETICS":
                this.sponsoredId = "sponsorMacCosmetics";
                break;
            case "NUTS ON CLARK":
                this.sponsoredId = "sponsorNutsOnClark";
                break;
            case "ROCKY MOUNTAIN CHOCOLATE":
                this.sponsoredId = "sponsorRockyMountainChocolate";
                break;
            case "SARAHS CANDIES":
                this.sponsoredId = "sponsorSarahsCandies";
                break;
            case "SHOE HOSPITAL":
                this.sponsoredId = "sponsorShoeHospital";
                break;
            case "SPIRIT OF THE RED HORSE":
                this.sponsoredId = "sponsorSpiritOfTheRedHorse";
                break;
            case "TALIE":
                this.sponsoredId = "sponsorTalie";
                break;
            default:
                this.sponsoredId = "__INVALID__";
                break;
        }

        // Return the sponsor ID
        return this.sponsoredId;
    }
};
game.sponsors.update(); // Initialize first sponsor

// Tag nearby shapes
game.tagShapesWithinViewRange = function (shape, range) {
    tagNeighbors(shape, game.shapes, range);
}

async function loadScripts() {
    // Load scripts synchronously
    const scr1 = await $.cachedScript("scripts/scene_start.js?v=0.0.1").done((script, textStatus) => {
        // console.log(`<Game>[Start:Cache] ${textStatus}`);
    });
    const scr2 = await $.cachedScript("scripts/scene_play.js?v=0.0.1").done((script, textStatus) => {
        // console.log(`<Game>[Play:Cache] ${textStatus}`);
    });
    const scr3 = await $.cachedScript("scripts/scene_end.js?v=0.0.1").done((script, textStatus) => {
        // console.log(`<Game>[End:Cache] ${textStatus}`);
    });
    const scr4 = await $.cachedScript("scripts/scene_leaderboard.js?v=0.0.1").done((script, textStatus) => {
        // console.log(`<Game>[Leaderboard:Cache] ${textStatus}`);
    });
    const scr5 = await $.cachedScript("scripts/game_manager.js?v=0.0.1").done((script, textStatus) => {
        // console.log(`<Game>[Game Manager:Cache] ${textStatus}`);
    });
};
loadScripts();
