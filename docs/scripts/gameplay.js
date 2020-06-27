// JavaScript Document

// Testing function
game.startShapeTester = false;
game.shapeTester = {
	isReady: false,
	counter: 0,
	myEntity: null,
	myMover: null,
	myShape: null,
	myTriangle: null,
	id: null,		// int
	pos: null,		// Vector2D
	radius: null,	// double
	scale: null,	// Vector2D
	type: null,		// typeEnum
	tag: null,		// boolean
	velocity: null,	// Vector2D
	maxSpeed: null,	// double
	heading: null,	// Vector2D
	mass: null,		// double
	turnRate: null,	// double
	maxForce: null,	// double
	width: null,	// double
	height: null,	// double
	init: function() {
		this.id = 0;						// int
		this.pos = new Vector2D(317, 600);	// Vector2D
		this.radius = 20;					// double
		this.scale = new Vector2D(1,1);		// Vector2D
		this.type = typeEnum.type_entity;	// typeEnum
		this.tag = false;					// boolean
		this.velocity = new Vector2D();		// Vector2D
		this.maxSpeed = 10.0;				// double
		this.heading = new Vector2D(0,1);	// Vector2D
		this.mass = 1.0;					// double
		this.turnRate = 2.5;				// double
		this.maxForce = 5.0;				// double
		this.width = 20.0;					// double
		this.height = 20.0;					// double
	},
	testReady: function() {
		/* // NULL values
		console.log(`<ShapeTester>[TestReady(NULL):Entity]`);
		this.testEntity();
		console.log(`<ShapeTester>[TestReady(NULL):Mover]`);
		this.testMover();
		console.log(`<ShapeTester>[TestReady(NULL):Shape]`);
		this.testShape();
		// - Draw shapes
		console.log(`<ShapeTester>[TestReady(NULL):Triangle]`);
		this.testTriangle();
		console.log(`<ShapeTester>[TestReady(NULL):Circle]`);
		this.testCircle();
		console.log(`<ShapeTester>[TestReady(NULL):Heart]`);
		this.testHeart();
		console.log(`<ShapeTester>[TestReady(NULL):Pentagon]`);
		this.testPentagon();
		console.log(`<ShapeTester>[TestReady(NULL):Rectangle]`);
		this.testRectangle();
		console.log(`<ShapeTester>[TestReady(NULL):Square]`);
		this.testSquare();
		console.log(`<ShapeTester>[TestReady(NULL):Star]`);
		this.testStar();
		// Initialized values
		this.init();
		this.toString();
		console.log(`<ShapeTester>[TestReady(INIT):Entity]`);
		this.testEntity();
		console.log(`<ShapeTester>[TestReady(INIT):Mover]`);
		this.testMover();
		console.log(`<ShapeTester>[TestReady(INIT):Shape]`);
		this.testShape();
		// - Draw shapes
		console.log(`<ShapeTester>[TestReady(INIT):Triangle]`);
		this.testTriangle();
		console.log(`<ShapeTester>[TestReady(INIT):Circle]`);
		this.testCircle();
		console.log(`<ShapeTester>[TestReady(INIT):Heart]`);
		this.testHeart();
		console.log(`<ShapeTester>[TestReady(INIT):Pentagon]`);
		this.testPentagon();
		console.log(`<ShapeTester>[TestReady(INIT):Rectangle]`);
		this.testRectangle();
		console.log(`<ShapeTester>[TestReady(INIT):Square]`);
		this.testSquare();
		console.log(`<ShapeTester>[TestReady(INIT):Star]`);
		this.testStar();
		// Display information for each entity
		game.gameEntities.toString();*/
	},
	testEntity: function() {
		// constructor(_id, boundingRadius, position, scale, type, tag)
		// console.log(`<ShapeTester>[TestEntity]`);
		if (this.id == null) {
			this.myEntity = new baseGameEntity();
		} else {
			this.myEntity = new baseGameEntity(this.id, this.radius, this.pos, this.scale, this.type, this.tag);
		}
	},
	testMover: function() {
		// constructor(position, radius, velocity, maxSpeed, heading, mass, scale, turnRate, maxForce, type)
		// console.log(`<ShapeTester>[TestMover]`);
		if (this.id == null) {
			this.myMover = new movingEntity();
		} else {
			this.myMover = new movingEntity(this.pos, this.radius, this.velocity, this.maxSpeed, this.heading, this.mass, this.scale, this.turnRate, this.maxForce, typeEnum.type_moving_entity);
		}
	},
	testShape: function() {
		// constructor(pos, type, width, height)
		// console.log(`<ShapeTester>[TestShape]`);
		if (this.id == null) {
			this.myShape = new Shape();
		} else {
			this.myShape = new Shape(this.pos, typeEnum.type_shape, this.width, this.height);
		}
	},
	testTriangle: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestTriangle]`);
		if (this.id == null) {
			this.myTriangle = new triangle();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myTriangle = new triangle(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testCircle: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestCircle]`);
		if (this.id == null) {
			this.myCircle = new circle();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myCircle = new circle(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testHeart: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestHeart]`);
		if (this.id == null) {
			this.myHeart = new heart();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myHeart = new heart(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testPentagon: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestPentagon]`);
		if (this.id == null) {
			this.myPentagon = new pentagon();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myPentagon = new pentagon(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testRectangle: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestTriangle]`);
		if (this.id == null) {
			this.myRectangle = new rectangle();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myRectangle = new rectangle(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testSquare: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestSquare]`);
		if (this.id == null) {
			this.mySquare = new square();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.mySquare = new square(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	testStar: function() {
		// constructor(pos)
		// console.log(`<ShapeTester>[TestStar]`);
		if (this.id == null) {
			this.myStar = new star();
		} else {
			// console.log(`Spawner ${this.counter}'s center at ${game.playSpawnSquares[this.counter].center}`)
			this.myStar = new star(game.playSpawnSquares[this.counter].center);
			this.counter++;
		}
	},
	toString: function () {
		console.log(`Test Attributes
		ID: ${this.id}
		Pos: ${this.pos}
		Radius: ${this.radius}
		Scale: ${this.scale}
		Type: ${this.type}
		Tag: ${this.tag}
		Velocity: ${this.velocity}
		MaxSpeed: ${this.maxSpeed}
		Heading: ${this.heading}
		Mass: ${this.mass}
		TurnRate: ${this.turnRate}
		MaxForce: ${this.maxForce}
		Width: ${this.width}
		Height: ${this.height}`);
	}
};

game.evaluateBoard = {
	openSquares: [],
	initialUpdate: true,
	evaluating: false,
	gridShifted: false,
	timeSinceUpdate: 0.0,
	timeBetweenUpdates: 0.05,

	evalReady: function(dt) {
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

	FindOpenSquares: function() {
		// Find open squares from the bottom
		for (var i = game.playGrid.squares.length-1; i >= 0; i--) {
			if (!game.playGrid.squares[i].occupied) {
				this.openSquares.unshift(game.playGrid.squares[i]);
			}
		}/*
		this.openSquares.unshift(game.playGrid.squares[42]);
		this.openSquares.unshift(game.playGrid.squares[43]);*/
	},
	
	FillOpenSquares: function() {
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
	GenerateShape: function(location) {
		// if (game.gameEntities.entities.length >= 81) return "Too many entities";
		
		var newShape;
		var getShape = randInt(0, (game.shapesList.length-1));

		// Reduce the change of a sponsor shape
		if (getShape == 7) {
			if (randInt(0, 100) > 10) {	// 10% chance to keep the sponsor
				getShape = randInt(0, (game.shapesList.length-1));
			}
		}

		// console.log(`Length of shapes: ${game.shapesList.length}\nPull shape ${getShape}\nLocation ${location}`);
		switch(getShape) {
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
	
	// Perform board evaluation
	Evaluate: function() {

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

			if (game.gameEntities.entities.length > 81) {
				for (items in game.gameEntities.entities) {
					if (!items.attachedSquare) {
						// game.playGrid.popList.push(items);
						game.gameEntities.removeEntity(items);
					}
				}
				console.log("FOUND EXCESS");
				// game.playGrid.popShapes();
			}
		}

		/* if (this.initialUpdate) {
			// Wait for all the grids, regulators, and shapes before evaluating
			if (game.regulators.regList.length == 81 && game.gameEntities.entities.length == 81) {
				
				// Evaluate the entire board
				if (!game.playGrid.evaluateBoard()) {
					// Pop any shapes registered as matches
					if (game.playGrid.popList.length > 0) {
						game.playGrid.popShapes();
					} else {
						// Finish the initial update
						this.initialUpdate = false;
					}
				}

				// this.initialUpdate = false;

				//console.log(`<Gameplay>[EvaluateBoard:Evaluate] Initial Updates\nHmm: ${hmm}`);
			}
		} else {
			console.log(`<Gameplay>[EvaluateBoard:Evaluate] Live`);
			
			game.playGrid.evaluateBoard();
			if (game.playGrid.popList.length > 0) {
				game.playGrid.popShapes();
			} else if (game.gameEntities.evaluateList.length > 0) {
				game.gameEntities.updateEntities();
			} else {
				
			}
		} */
	}
};

/*---------------------evaluateCursor---------------------------------\
| - Checks whether the provided mouse location is within the playing
|   field
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.evaluateCursor = function(pos) {
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
game.getShapeAtPosition = function(cursorPos) {
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
game.getSquareAtPosition = function(cursorPos) {
	console.log(`Find square at ${cursorPos}`);
	var testSquare;
	for (var i = 0; i < game.playGrid.squares.length; i++) {
		testSquare = game.playGrid.squares[i];
		if (vec2DDistance(testSquare.center, cursorPos) < testSquare.width/2) {
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
game.selectShape = function(pos) {
	if (!game.evaluateCursor(pos)) return;
	try {
		game.selectedShape = game.getShapeAtPosition(pos);
		console.log(`Selected shape ${game.selectedShape.entityType()}`);
		
	} catch (e) {
		console.log("No shape selected");
		game.selectedShape = null;
	}
}

/*---------------------selectStartSquare------------------------------\
| - Attempt to select a square at the location of the provided mouse
|   click.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.selectStartSquare = function(pos) {
	if (!game.evaluateCursor(pos)) return;
	try {
		game.startSquare = game.getSquareAtPosition(pos);
		console.log(`Selected square ${game.startSquare.id}`);
	} catch (e) {
		console.log("No square selected");
		game.startSquare = null;
	}
}

/*---------------------selectDestinationSquare------------------------\
| - Attempt to select a square at the location of the provided mouse
|   release.
| - arg types: Vector2D
\--------------------------------------------------------------------*/
game.selectDestinationSquare = function(pos) {
	if (!game.evaluateCursor(pos)) return;
	try {
		game.destinationSquare = game.getSquareAtPosition(pos);
		console.log(`Selected square ${game.destinationSquare.id}`);

		// Check if the destination square is the same as the start square - SPONSORS test
		if (game.destinationSquare == game.startSquare) {
			console.log(`Same Square! No action taken.`);
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
game.releaseSelectedShape = function(pos) {
	if (game.selectedShape) {
		game.selectedShape.moveShapeToLocation(pos);
		// game.selectedShape = null;
	}
}

/*---------------------releaseSelectedSquare--------------------------\
| - If a square is selected, release the selection when the shape
|   actions are complete.
\--------------------------------------------------------------------*/
game.releaseSelectedSquare = function() {
	if (game.startSquare) game.startSquare = null;	// TODO : Add attachments updates
	if (game.destinationSquare) game.destinationSquare = null;
}