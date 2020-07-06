// JavaScript Document

// DEBUG
// console.log("scene_leaderboard.js loaded successfully");

//   - Images
game.leaderboardBackground = {
    //Get handle
    image: document.getElementById("mainBackground"),
    //Declare object information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    //Adjust transformation
    resize: function () {
        this.width = engine.width;
        this.height = engine.height;
    },
    //Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardPlayerScore = {
    //Get handle
    image: document.getElementById("leaderboardScore"),
    //Declare object information
    org_width: 575 * game.scale,
    org_height: 365 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    //Adjust transformation
    resize: function () {
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = 30 * engine.preserveAspectRatio;
        this.posY = 325 * engine.preserveAspectRatio;
    },
    //Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.finalPlayerScore = {
    //Get handle
    div: document.getElementById("finalPlayerScore"),
    //Declare object information
    org_width: 150 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 325,
    org_posY: 82,
    posX: 0,
    posY: 0,
    //Declare variables
    org_font_size: 74,
    font_size: 0,
    //Initialize the object
    init: function () {
        //Add event listener
        this.div.addEventListener("click", game.finalPlayerScore.clickMe);
    },
    textResize: function () {
        // Declare references to screen objects
        var mySpan = $("#leaderScoreSpan");
        var myDiv = $("#finalPlayerScore");

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
    //Adjust tranformation
    resize: function () {

        this.width = game.leaderboardPlayerScore.width * 0.8;
        this.height = this.org_height * engine.preserveAspectRatio;

        //attach left side
        this.posX = game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width / 2 - this.width / 2;
        this.posY = game.leaderboardPlayerScore.posY + game.leaderboardPlayerScore.height / 2 - this.height / 2;

        //adjust font
        this.textResize();
    },
    //draw object
    draw: function () {
        this.updateScore();
        this.adjustStyle();
    },
    //apply changes
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
    //Update/display score
    updateScore: function () {
        this.div.innerHTML = Math.max(0, game.player.score);
    },
    //Handle user interaction
    clickMe: function () {
        //Refresh timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.finalPlayerScore.init();

game.leaderboardSponsor = {
    // Get handle
    image: document.getElementById("SponsorsBox"),
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = engine.width - this.width;
        this.posY = engine.height - this.height;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardSponsorLogo = {
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
        this.width = game.leaderboardSponsor.width * 0.70;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.leaderboardSponsor.posX + 35 * engine.preserveAspectRatio;
        this.posY = game.leaderboardSponsor.posY + game.leaderboardSponsor.height / 2 - this.height / 3;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image(), this.posX, this.posY, this.width, this.height);
    }
};

//Leaderboard Table
game.top10players = {
    //Get handles
    div: document.getElementById("top10table"),
    //divHeader: document.getElementById("top10header"),
    divBoard: document.getElementById("top10board"),
    boardElements: null,
    //Declare object information
    org_width: 0,
    org_height: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_font_size: 54,
    font_size: 0,
    org_table_font_size: 36,
    table_font_size: 0,
    org_padding: 5,
    //padding: 0,
    //Array to hold items
    divArray: [],
    //table commplete
    tableBuilt: false,
    //Initialize
    init: function () {
        //Add event listener
        this.div.addEventListener("click", game.top10players.clickMe);
    },
    //Adjust transformation
    resize: function () {
        this.width = (game.leaderboardSponsor.posX - (game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width)) - 100 * engine.preserveAspectRatio;
        this.height = engine.height;

        // Attach Left Side
        this.posX = (game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width) + 50 * engine.preserveAspectRatio;
        this.posY = 0;

        // Adjust the height of the table's container
        //this.divBoard.style.height = engine.height - (this.divHeader.offsetTop + this.divHeader.offsetHeight) - 50 * engine.preserveAspectRatio;
        
        // Update font size
        this.font_size = this.org_font_size * engine.preserveAspectRatio;
        this.table_font_size = this.org_table_font_size * engine.preserveAspectRatio;

        //Update padding sizes
        //this.padding = this.org_padding * engine.preserveAspectRatio;
    },
    // Apply changes via CSS
    adjustStyle: function () {
        if (!this.tableBuilt) {
            this.buildTable();
        }
        this.resize();
        
        this.boardElements = document.getElementsByName("top10s");
        
        for (var i = 0; i < this.boardElements.length; i++) {
            if (this.boardElements[i].tagName.toLowerCase() == "td") {
                this.boardElements[i].style.display = "table-cell";
                this.boardElements[i].style.fontSize = this.table_font_size + "px";
                this.boardElements[i].style.padding = this.padding;
            } else if (this.boardElements[i].tagName.toLowerCase() == "th") {
                this.boardElements[i].style.display = "table-cell";
                this.boardElements[i].style.fontSize = this.font_size + "px";
            } else if (this.boardElements[i].tagName.toLowerCase() == "tr") {
                this.boardElements[i].style.display = "table-row";
            } else if (this.boardElements[i].tagName.toLowerCase() == "tbody") {
                this.boardElements[i].style.display = "table-row-group";
            } else if (this.boardElements[i].tagName.toLowerCase() == "table") {
                this.boardElements[i].style.display = "table";
            } else {
                this.boardElements[i].style.display = "block";
                this.boardElements[i].style.fontSize = this.font_size + "px";
            }
        }
        
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
    },
    // Hide the table and clear
    hideTable: function () {
        this.divArray = [];
        this.divBoard.innerHTML = '';
        this.div.style.display = "none";
        this.tableBuilt = false;
    },
    // Build the table
    buildTable: function () {
        var place = "";
        var divPrefix = '<div id="lbContainerDiv';
        var tablePrefix = '<table><tr><th colspan="3" name="top10s">TOP PLAYERS</th></tr>';
        var rowPrefix = '<tr>';
        var dataPrefix = '<td class="top-10-data"';
        var tableBuilder = '';
        var placeHolder = '';
        var scoreHolder = '';

        //AJAX query
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "scripts/leaderboard.php", true);
        ajax.send();

        // Perform actions when AJAX completes (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200 && game.currState == 'leaderboard') {
                // Parse and store the JSON message from PHP
                var leaders = JSON.parse(this.responseText);

                //open div
                tableBuilder += divPrefix + place + '" class="table-container" style="height:100%;" name="top10s">' + tablePrefix;

                for (var i = 0; i < leaders.length; i++) {
                    place = i + 1;

                    placeHolder = leaders[i].user.toString();
                    scoreHolder = leaders[i].score.toString();

                    if (game.player.initials.toString() == placeHolder && game.player.score.toString() == scoreHolder) {
                        tableBuilder += rowPrefix + dataPrefix + " style='background-color: #ed1d65;' name='top10s'>" + place + "</td>" + dataPrefix + " style='background-color: #ed1d65;' name='top10s'>" + leaders[i].user + "</td>" + dataPrefix + " style='background-color: #ed1d65;' name='top10s'>" + scoreHolder + "</td></tr>";
                    } else {
                        tableBuilder += rowPrefix + dataPrefix + " name='top10s'>" + place + "</td>" + dataPrefix + " name='top10s'>" + leaders[i].user + "</td>" + dataPrefix + " name='top10s'>" + scoreHolder + "</td></tr>";
                    }

                }
                //close table
                tableBuilder += "</table>"

                //close div
                tableBuilder += "</div>";

                game.top10players.divArray.push("lbContainerDiv");
                game.top10players.divBoard.innerHTML = tableBuilder;

                // Disable extra queries
                game.top10players.tableBuilt = true;
                
                // Force refresh the table's styles
                game.top10players.adjustStyle();
            }
        }
    },
    // Handle user interaction
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.top10players.init();

//   - Buttons
game.leaderboardRetryButton = {
    // Get handle to image
    image: document.getElementById("leaderboardRetryButton"),
    // Declare object transform information
    org_width: 237 * game.scale,
    org_height: 114 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Initialize the object
    init: function () {
        // Add event listener
        this.image.addEventListener("click", game.leaderboardRetryButton.retry);
    },
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        
        // Remove an additional 25 (proportionate) from the X-position to match the shadow
        this.posX = game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width - this.width - 25 * engine.preserveAspectRatio;
        this.posY = game.leaderboardPlayerScore.posY + game.leaderboardPlayerScore.height + 25 * engine.preserveAspectRatio;
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
    // Actions when clicking
    retry: function () {
        // Inform Google the player is starting a new game
        game.google.start();
        // Clear the initials on the End Scene
        game.endPlayerInitials.clearInitials();
        // Hide all elements
        game.hideElements.hideAll();
        // Set the game state to Play Scene
        game.currState = game.gameState[1];
        // Reset the player object
        game.player.reset();
        // Reset leaderboard table
        game.top10players.hideTable();
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
        // Redraw all elements
        game.drawOnce();
    }
};
game.leaderboardRetryButton.init();
