class triangle extends Shape {
    constructor(pos) {
		// Position
		var _position = (typeof pos !== "undefined") ? pos : new Vector2D();
		// Type
		var _type = typeEnum.type_gem_triangle;
		// Shape Reference
		var _targetShape = game.gemTriangle;
		// Image
		var _image = _targetShape.image;
		// Width
		var _width = _targetShape.width;
		// Height
		var _height = _targetShape.height;
		
		// Initialize parent
        super(_position, _type, _width, _height);
		
		// Define circle's attributes
        this.image = _image;
        this.type = _type;
        this.points = 120;
		
		// Shape Div Builder
		var _divOpen = `<div id="${this.type}_${this.ID()}" class="gems" style="top:${this.position.y}px;left:${this.position.x}px;width:${this.width}px;height:${this.height}px;background-image: url('${this.image.src}');">`;
		$("#baseCanvas").after(_divOpen);
		this.domElement = document.getElementById(`${this.type}_${this.ID()}`);
		this.setDOM(this.domElement);
		this.setOrigin(_targetShape);
		this.adjustStyles();
    }
	
	/*---------------------draw-------------------------------------------\
	| /\ Inherited from baseGameEntity /\
    | - Override the draw function.
	| - Note: Not all entity classes or subclasses require a draw.
    \--------------------------------------------------------------------*/
	draw() {
		this.adjustStyles();
		// console.log(`<Triangle>[Draw] Image: ${this.image.id}\nX: ${this.center.x} | Y: ${this.center.y}\nW: ${this.width} | H: ${this.height}`);
		// console.log(`<Triangle>[Draw] Image: ${this.image.id}\nX: ${this.position.x} | Y: ${this.position.y}\nX: ${this.center.x} | Y: ${this.center.y}`);
		// console.log(`<Triangle>[Draw] ID: ${this.ID()}\nStatus: A:${this.isAlive()} S:${this.isSpawning()} D: ${this.isDead()}\nX: ${this.center.x} | Y: ${this.center.y}\nW: ${this.width} | H: ${this.height}`);
		
		// engine.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
		// super.draw();
	}
	
	/*---------------------destroyDiv-------------------------------------\
    | - Removes this shape's div element from the page
    \--------------------------------------------------------------------*/
	destroyDiv() {
		this.domElement.remove();
	}

	/*---------------------getPoints--------------------------------------\
    | - Returns triangle's point value
    \--------------------------------------------------------------------*/
	getPoints() { return this.points; }
}