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
game.keys = ['A', 'S', 'D', 'F'];
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
    evaluateBoard: function () {
        // Container to hold the grid being tested
        var gridTest;
        // Container to store all the positive matches
        var updateList = [];

        // console.log(`Evaluating\nEvaluate List Size: ${this.evaluateList.length}\n`);

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

        /* if (updateList.length > 0) {
            for (let item of matchesSet) {
                // console.log(`Matches found: ${item.id}`);
                item.attachedShape.lastAttachedSquare = "undefined";
            }
        } */

        // console.log(`Evaluating\nPop List Size: ${this.popList.length}\n`);

        game.evaluateBoard.evaluating = false;

    },
    evaluateSelected: function () { },
    evaluate: function () {
        var updateList = [];

        // console.log(`<Game>[PlayGrid:Evaluate:Outer]\nIn Progress: ${this.evalInProgress}\nEval List: ${this.evaluateList.length}\nEnti List: ${game.gameEntities.evaluateList.length}`);
        if (!this.evalInProgress) {






            // THIS LOOP HAS THE ISSUE - RE-EVALUATE





            for (var i = this.evaluateList.length - 1; i > 0; i--) {
                // game.gameEntities.evaluateList.length == 0 && 
                if (game.gameEntities.evaluateList.length == 0) {
                    /*var tempArray = [];
                    console.log(`<Game>[PlayGrid:Evaluate]\nTempArray Size: ${tempArray.length}\nValues: ${tempArray}`);
                    
                    this.evaluateList[i].testMatches();
                    
                    tempArray = [this.evaluateList[i].matchesCombined];
                    console.log(`<Game>[PlayGrid:Evaluate]\nTempArray Size: ${tempArray.length}\nValues: ${tempArray}`); */
                    updateList = [...this.evaluateList[i].testMatches()];
                    //updateList.concat(this.evaluateList[i].testMatches());

                    // console.log(`<Game>[PlayGrid:Evaluate]\nUpdate List: ${updateList.length}`);

                    if (updateList.length > 1) {

                        // Notify of an evaluation in progress
                        this.evalInProgress = true;
                        // Remove duplicate values
                        const updateSet = new Set(updateList);
                        // Fill the pop list
                        this.popList = [...updateSet];
                        // Return, since the whole grid is about to update
                        return;
                    } else {
                        // Clear the update list
                        updateList = [];
                    }

                    //console.log(`<Game>[PlayGrid:Evaluate:Inner]\nIn Progress: ${this.evalInProgress}\nEval List: ${this.evaluateList.length}\nEnti List: ${game.gameEntities.evaluateList.length}`);
                    // return;
                } else {
                    game.gameEntities.updateEntities();
                }
            }
        } else {
            // Check for shapes ready to be popped
            if (this.popList.length > 0) {
                for (var i = this.popList.length - 1; i >= 0; i--) {
                    // If a shape was set to pop, but has not finished its pop animation
                    if (!this.popList[i].attachedShape.popped) {
                        try {
                            // Pop the shape and remove from the entities list
                            this.popList[i].attachedShape.popShape(() => { game.gameEntities.removeEntity(this.popList[i]); });
                        } catch (e) {
                            // Skip
                        }
                    } else {
                        game.gameEntities.removeEntity(this.popList[i]);
                    }
                }

                this.popList = [];
                // Since the list is not empty, return
                return;
            }
        }

        console.log(`\n\n\n<Game>[PlayGrid:Evaluate:Final]\nCHECK HERE\n\n\nInitial Update Complete`);
        // Cancel the initial update flag
        if (game.evaluateBoard.initialUpdate) game.evaluateBoard.initialUpdate = false;

        // Cancel the evalInProgress flag
        this.evalInProgress = false;
    },
    popShapes: function () {
        // Container to hold 
        // Check for shapes ready to be popped, ensuring the evaluate list is empty
        if (this.popList.length > 0 && this.evaluateList.length < 1) {

            // console.log(`\n\nBefore\nPopList: ${this.popList.length}\n\nPopping ${this.popList[this.popList.length - 1].attachedShape}\n\n`);
            /*
            var tempScore;

            for (var i = 0; i < this.popList.length; i++) {
                try { tempScore += this.popList[i].points; } catch (e) {}
            }

            game.player.score += tempScore * this.popList.length; */

            for (var i = this.popList.length - 1; i >= 0; i--) {
                try {
                    // If a shape was set to pop, but has not finished its pop animation
                    if (!this.popList[i].attachedShape.popped) {

                        //try {
                            // Pop the shape and remove from the entities list
                            // this.popList[i].attachedShape.popShape(()=>{game.gameEntities.removeEntity(this.popList[i]);});
                            this.popList[i].attachedShape.popShape();
                        // } catch (e) {
                            // Skip
                        //}
                    } else {
                        game.gameEntities.removeEntity(this.popList[i]);
                    }
                } catch (e) {}
            }

            // console.log(`\n\nAfter\nPopList: ${this.popList.length}\n\nPopping ${this.popList[this.popList.length - 1].attachedShape}\n\n`);

            this.popList = [];
        }
    }
};
// Spawn Squares
game.playSpawnSquares = [];
// Entities
game.gameEntities = {
    entities: [],
    evaluateList: [],
    addEntity: function (newEntity) { this.entities.unshift(newEntity); },
    removeEntity: function (delEntity) {
        // console.log(`<Game>[GameEntities:RemoveEntity] Ent Count\nBefore ${this.entities.length}\nRemoving ${delEntity.id}`);
        let tempList = [];
        for (var i = 0; i < this.entities.length; i++) {
            if (delEntity != this.entities[i]) {
                tempList.push(this.entities[i]);
                //this.entities.splice(i, 1);
                //break;
            } else {
                this.entities[i].destroyDiv();
            }
        }

        // Remove the div element
        // try { setTimeout(delEntity.destroyDiv(),600); } catch(e) {}

        this.entities = [...tempList];

        // console.log(`<Game>[GameEntities:RemoveEntity] Ent Count\nAfter ${this.entities.length}`);
    },
    clearEntities: function () { this.entities = []; },
    drawEntities: function () {
        for (var i = 0; i < this.entities.length; i++) {
            // console.log(`${this.entities[i].isAlive()} ${this.entities.length}`);
            //if (this.entities[i].isAlive())
            this.entities[i].draw();
        }
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

        // this.evaluateList = [];
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

/* << TIMER EXAMPLE USAGE >>
var myTime = new Timer();
console.log(`Time: ${myTime.startTime}\nTime Left: ${myTime.timeLeft}`);
myTime.setup(2, false, "Test");
console.log(`Time: ${myTime.startTime}\nTime Left: ${myTime.timeLeft}`);
game.timers.push(myTime);
<< TIMER EXAMPLE USAGE >> */

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
    const scr1 = await $.cachedScript("scripts/scene_start.js").done((script, textStatus) => {
        // console.log(`<Game>[Start:Cache] ${textStatus}`);
    });
    const scr2 = await $.cachedScript("scripts/scene_play.js").done((script, textStatus) => {
        // console.log(`<Game>[Play:Cache] ${textStatus}`);
    });
    const scr3 = await $.cachedScript("scripts/scene_end.js").done((script, textStatus) => {
        // console.log(`<Game>[End:Cache] ${textStatus}`);
    });
    const scr4 = await $.cachedScript("scripts/scene_leaderboard.js").done((script, textStatus) => {
        // console.log(`<Game>[Leaderboard:Cache] ${textStatus}`);
    });
    const scr5 = await $.cachedScript("scripts/game_manager.js").done((script, textStatus) => {
        // console.log(`<Game>[Game Manager:Cache] ${textStatus}`);
    });
};
loadScripts();
