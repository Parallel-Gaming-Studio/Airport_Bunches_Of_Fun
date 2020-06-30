// JavaScript Document

game.evaluateBoard = {
	openSquares: [],
	initialUpdate: true,
	evaluating: false,
	gridShifted: false,
	timeSinceUpdate: 0.0,
	timeBetweenUpdates: 0.05,

	evalReady: function (dt) {
		// During the initial update, return true
		if (this.initialUpdate) return true;

		// Update by time since last frame (dt)
		this.timeSinceUpdate += dt;

		// If the time is greater than the update wait time
		if (this.timeSinceUpdate >= this.timeBetweenUpdates) {
			// Reset the update time
			this.timeSinceUpdate = 0.0;
			// Return ready
			return true;
		}

		// Return not ready
		return false;
	},

	FindOpenSquares: function () {
		// Find open squares from the bottom
		for (var i = game.playGrid.squares.length - 1; i >= 0; i--) {
			if (!game.playGrid.squares[i].occupied) {
				this.openSquares.unshift(game.playGrid.squares[i]);
			}
		}
	},

	FillOpenSquares: function () {
		console.log(`Open Squares: ${this.openSquares.length}`);
		// Fill open squares from the bottom
		for (var i = 0; i < this.openSquares.length; i++) {
			this.GenerateShape(this.openSquares[i]);
			this.openSquares[i].occupiedOn();
		}
		// Clear the list of open squares
		this.openSquares = [];
	},

	// Generate random shape
	GenerateShape: function (location) {
		// if (game.gameEntities.entities.length >= 81) return "Too many entities";

		var newShape;
		var getShape = randInt(0, (game.shapesList.length - 1));

		// Reduce the change of a sponsor shape
		if (getShape == 7) {
			if (randInt(0, 100) > 5) {	// 5% chance to keep the sponsor
				getShape = randInt(0, (game.shapesList.length - 1));
			}
		}

		// console.log(`Length of shapes: ${game.shapesList.length}\nPull shape ${getShape}\nLocation ${location}`);
		switch (getShape) {
			case 0:	// Circle
				// console.log(`Chose: ${game.shapesList[0]}`);
				newShape = new circle(location);
				break;
			case 1: // Heart
				// console.log(`Chose: ${game.shapesList[1]}`);
				newShape = new heart(location);
				break;
			case 2: // Pentagon
				// console.log(`Chose: ${game.shapesList[2]}`);
				newShape = new pentagon(location);
				break;
			case 3: // Rectangle
				// console.log(`Chose: ${game.shapesList[3]}`);
				newShape = new rectangle(location);
				break;
			case 4: // Square
				// console.log(`Chose: ${game.shapesList[4]}`);
				newShape = new square(location);
				break;
			case 5: // Star
				// console.log(`Chose: ${game.shapesList[5]}`);
				newShape = new star(location);
				break;
			case 6: // Triangle
				// console.log(`Chose: ${game.shapesList[6]}`);
				newShape = new triangle(location);
				break;
			case 7: // Sponsored
				// console.log(`Chose: ${game.shapesList[7]}`);
				newShape = new sponsored(location);
				break;
		}
		// Assign the newShape to the square location
		location.attachedShape = newShape;
		// Assign the square location to the newShape
		newShape.attachedSquare = location;

		return newShape;
	},

	// Remove excess entities
	RemoveExcess: function () {

		if (game.gameEntities.entities.length > 81) {
			// console.log(`Something broke`);
			var z = document.getElementsByClassName("gems");
			for (var i = 0; i < z.length; i++) {
				z[i].style.display = "none";
			}

			game.gameEntities.entities = [];

			for (var j = 0; j < game.playGrid.squares.length; j++) {
				if (game.playGrid.squares[j].attachedShape !== "undefined") {
					game.gameEntities.entities.push(game.playGrid.squares[j].attachedShape);
				}
			}

			game.gameEntities.drawEntities();

			var tempArray = [];
			var x = document.getElementsByClassName("gems");
			for (var a = 0; a < x.length; a++) {
				try {
					var testMe = x[a].style.getPropertyValue('display');
					// console.log(`My display type is: ${testMe}`);
					if (testMe == "none") {
						tempArray.push(x[a]);
					}
				} catch (e) {}
			}
			while (tempArray.length > 0) {
				tempArray.pop().remove();
			}
		}
	},

	// Perform board evaluation
	Evaluate: function () {

		// Ensure every grid square is ready for evaluation
		if (!game.playGrid.readiness()) {
			// console.log("Readiness: Not Ready");
			game.regulators.update();
			return;
		}

		if (game.regulators.regList.length == 81 && game.gameEntities.entities.length == 81 && !this.evaluating) {
			// Evaluate entities
			if (game.gameEntities.evaluateList.length > 0 && game.destinationSquare == null) {
				game.gameEntities.updateEntities();
				this.evaluating = true;
				game.playGrid.evaluateBoard();
			}
			// Evaluate pops
			if (game.playGrid.popList.length > 0) {
				game.playGrid.popShapes();
			}
			// Evaluate board
			if (game.playGrid.evaluateList.length > 0 && game.gameEntities.evaluateList.length == 0) {
				this.evaluating = true;
				game.playGrid.evaluateBoard();
			}
			// React to grid updates, evaluating the entire board
			if (this.gridShifted) {
				this.gridShifted = false;
				game.playGrid.evaluateList.push(...game.playGrid.squares);
			}
			// Update regulators
			game.regulators.update();

		} else {
			game.regulators.update();

			// Garbage Collector
			this.RemoveExcess();
		}
	}
};

/*---------------------evaluateCursor---------------------------------\
| - Checks whether the provided mouse location is within the playing
|   field
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.evaluateCursor = function (pos) {
	// Playing field's bounding pox
	var grid = game.playFieldGrid;

	if (pos.x > grid.left && pos.x < grid.right && pos.y > grid.top && pos.y < grid.bottom) {
		//console.log(`<Gameplay>[EvaluateCursor:Passed]\nCursor:\n[${pos.x},${pos.y}]\nGrid:\nX: [${grid.left.toFixed(0)} - ${grid.right.toFixed(0)}] ${pos.x > grid.left && pos.x < grid.right}\nY: [${grid.top.toFixed(0)} - ${grid.bottom.toFixed(0)}] ${pos.y > grid.top && pos.y < grid.bottom}`);
		return true;
	}
	//console.log(`<Gameplay>[EvaluateCursor:Failed]\nCursor:\n[${pos.x},${pos.y}]\nGrid:\nX: [${grid.left.toFixed(0)} - ${grid.right.toFixed(0)}] ${pos.x > grid.left && pos.x < grid.right}\nY: [${grid.top.toFixed(0)} - ${grid.bottom.toFixed(0)}] ${pos.y > grid.top && pos.y < grid.bottom}`);
	return false;
}

/*---------------------getShapeAtPosition-----------------------------\
| - Given a position on the screen when the mouse is clicked, this
|   method returns the shape found with its bounding radius over that
|   position.
| - If there is no shape at the position, the method returns NULL.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.getShapeAtPosition = function (cursorPos) {
	//console.log(`Find shape at ${cursorPos}`);
	var testEntity;
	for (var i = 0; i < game.gameEntities.entities.length; i++) {
		testEntity = game.gameEntities.entities[i];
		if (vec2DDistance(testEntity.center, cursorPos) < testEntity.bRadius()) {
			//if (testEntity.isAlive()) {
			return testEntity;
			//}
		}
	}
	return null;
}

/*---------------------getSquareAtPosition-----------------------------\
| - Given a position on the screen when the mouse is clicked, this
|   method returns the square found with its bounding radius over that
|   position.
| - If there is no square at the position, the method returns NULL.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.getSquareAtPosition = function (cursorPos) {
	// console.log(`Find square at ${cursorPos}`);
	var testSquare;
	for (var i = 0; i < game.playGrid.squares.length; i++) {
		testSquare = game.playGrid.squares[i];
		if (vec2DDistance(testSquare.center, cursorPos) < testSquare.width / 2) {
			//if (testSquare.isAlive()) {
			return testSquare;
			//}
		}
	}
	return null;
}

/*---------------------selectedShape----------------------------------\
| - Maintains a reference to the currently selected shape
\--------------------------------------------------------------------*/
game.selectedShape = null;

/*---------------------selectedSquare---------------------------------\
| - Maintains a reference to the currently selected square
\--------------------------------------------------------------------*/
// Origin Square
game.startSquare = null;
// Destination Square
game.destinationSquare = null;

/*---------------------selectShape------------------------------------\
| - Attempt to select a shape at the location of the provided mouse
|   click.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.selectShape = function (pos) {
	if (!game.evaluateCursor(pos) || !game.playGrid.readiness()) return false;
	if (game.startSquare != null || game.destinationSquare != null) return false;
	try {
		game.selectedShape = game.getShapeAtPosition(pos);
		// console.log(`Selected shape ${game.selectedShape.entityType()}`);
		return true;
	} catch (e) {
		// console.log("No shape selected");
		game.selectedShape = null;
		return false;
	}
	return false;
}

/*---------------------selectStartSquare------------------------------\
| - Attempt to select a square at the location of the provided mouse
|   click.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.selectStartSquare = function (pos) {
	if (!game.evaluateCursor(pos)) return;
	if (game.startSquare != null || game.destinationSquare != null) return;
	try {
		game.startSquare = game.getSquareAtPosition(pos);
		// console.log(`Selected square ${game.startSquare.id}`);
	} catch (e) {
		// console.log("No square selected");
		game.startSquare = null;
	}
}

/*---------------------selectDestinationSquare------------------------\
| - Attempt to select a square at the location of the provided mouse
|   release.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.selectDestinationSquare = function (pos) {
	if (!game.evaluateCursor(pos)  || !game.playGrid.readiness()) return false;
	if (game.startSquare == null && game.destinationSquare != null) {
		game.destinationSquare = null;
		return false;
	} else if (game.startSquare != null && game.destinationSquare != null) {
		game.destinationSquare = null;
	}
	try {
		game.destinationSquare = game.getSquareAtPosition(pos);
		// console.log(`Selected square ${game.destinationSquare.id}`);

		// Check if the destination square is the same as the start square - SPONSORS test
		if (game.destinationSquare == game.startSquare) {
			// console.log(`Same Square! No action taken.`);
			// game.destinationSquare.checkForSponsor(game.destinationSquare);
			game.startSquare = null;
			game.destinationSquare = null;
			return false;
		}
		return true;
	} catch (e) {
		console.log("No square selected");
		game.startSquare = null;
		game.destinationSquare = null;
	}

	return false;
}

/*---------------------releaseSelectedShape---------------------------\
| - If a shape is selected, release the selection when the player
|   releases the mouse.
\--------------------------------------------------------------------*/
game.releaseSelectedShape = function (pos) {
	if (game.selectedShape) {
		game.selectedShape.moveShapeToLocation(pos);
		// game.selectedShape = null;
	}
}

/*---------------------releaseSelectedSquare--------------------------\
| - If a square is selected, release the selection when the shape
|   actions are complete.
\--------------------------------------------------------------------*/
game.releaseSelectedSquare = function () {
	if (game.startSquare) game.startSquare = null;	// TODO : Add attachments updates
	if (game.destinationSquare) game.destinationSquare = null;
}