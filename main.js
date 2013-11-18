var squareDim = 50;
var squareOffset = 2;

var squares = [];
var tracks = [];
var trackCounter = 0;
var playerCost = 0;

var startX =0;
var startY = 0;

var endX = 0;
var endY = 0;

var stage = new PIXI.Stage(0x000000, true);
var renderer = new PIXI.CanvasRenderer(1660, 830);
stage.click = function(data)
{
	console.log("clicked!");
	var indexX = Math.floor(data.global.x/(squareDim+squareOffset));
	var indexY = Math.floor(data.global.y/(squareDim+squareOffset));
	if(areAdjacent(indexX,indexY,tracks))
	{
		if(indexX == endX && indexY == endY)
		{
			console.log("YOU WIN");
			
			// Add text.
    		var text = new PIXI.Text("YOU WON YOUR TOTAL COST WAS: $" + playerCost, {font: 'bold 40px Avro', fill: 'white', align: 'center'});
    		text.position = new PIXI.Point(renderer.width / 2, renderer.height / 2);
    		text.anchor = new PIXI.Point(0.5, 0.5);
    		graphics.beginFill(0x000000);
    		graphics.drawRect(0,0, renderer.width, renderer.height);
    		stage.addChild(text);

    		// Render the stage.
   			renderer.render(stage);
			console.log(playerCost);
		}
		else
		{
			squares[indexX][indexY].draw(0x838B8B);
 			playerCost += squares[indexX][indexY].cost;
 			tracks[trackCounter] = indexX;
 			tracks[trackCounter+1] = indexY;
 			trackCounter+=2;
		}
		
	}
}
        
      
        
        // add render view to DOM
        document.body.appendChild(renderer.view);
        
        var graphics = new PIXI.Graphics();
        stage.addChild(graphics);
        
        requestAnimFrame(animate);

        function animate() {

        renderer.render(stage);
        requestAnimFrame( animate );
        }




var square = function(x,y,type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.isBuilt = false;
	

	this.draw = function(color)
	{
		graphics.beginFill(color)
		var posX = this.x*(squareDim+squareOffset);
        var posY = this.y*(squareDim+squareOffset);
        graphics.drawRect(posX,posY,squareDim, squareDim);
	}
}


var areAdjacent = function(X, Y, tracks)
{
	if(Math.abs(X - tracks[trackCounter-2]) <= 1 && Math.abs(Y-tracks[trackCounter-1]) <= 1)
	{
		return true;
	}
}
var World = function()
{
	//Sets up the world, by generating a random map

	//0 is flat, 2 is mountain, 3 is water, 1 is forest
	this.types = [0,1,2,3];

	//number of cells wide
	this.width = 32;

	//number of cells high
	this.height = 16;

	//array of the world
	this.squares = squares;
	this.generateMap();
	console.log("MAP INTIALIZED");
	this.drawMap();
	console.log("MAP DRAWN");
	this.generateStart();
	tracks[trackCounter] = startX;
	tracks[trackCounter+1] = startY;
	trackCounter+=2;
	this.generateGoal();
	console.log("START AND END GENERATED");
}

World.prototype.generateMap = function()
{
	var picked =0;
	
	for(var i =0; i< this.width; i++)
	{
		this.squares[i] = [];
		for(var j = 0; j <this.height; j++)
		{
			this.squares[i][j] = new square(i,j,0);	
		}
	}


	//generate 10 blocks of each type of tile, rest are flat
	for(var i =0; i< 20; i++)
	{
		var waterX = Math.floor(Math.random()*32);
		var waterY = Math.floor(Math.random()*16);
		var mountainX = Math.floor(Math.random()*32);
		var mountainY = Math.floor(Math.random()*16);
		var forestX = Math.floor(Math.random()*32);
		var forestY = Math.floor(Math.random()*16);

		this.squares[waterX][waterY].type = 3;
		this.addTiles(waterX,waterY,3);
		this.squares[mountainX][mountainY].type = 2;
		this.addTiles(mountainX,mountainY,2);
		this.squares[forestX][forestY].type = 1;
		this.addTiles(forestX,forestY, 1);
	}

	for(var i =0; i< this.width; i++)
	{
		
		for(var j = 0; j <this.height; j++)
		{
			this.squares[i][j].cost = (this.squares[i][j].type*5)+5	
		}
	}
}

World.prototype.generateStart = function()
{
	var notFound = false;
	while(!notFound)
	{
		startX = Math.floor(Math.random()*this.width);
		startY = Math.floor(Math.random()*this.height);

		if(startX == 0 || startY == 0 || startX == this.width-1 || startY == this.height-1)
		{
			notFound = true;
			squares[startX][startY].draw(0X838B8B);
		}
	}
}

World.prototype.generateGoal = function()
{
	var notFound = false;
	while(!notFound)
	{
		endX = Math.floor(Math.random()*32);
		endY = Math.floor(Math.random()*16);

		if(endX != startX && endY != startY)
		{
			if(endX == 0 || endY == 0 || endX == this.width-1 || endY == this.height-1)
			{
				notFound = true;
				squares[endX][endY].draw(0X838B8B);
			}
		}

		
	}
}
	





World.prototype.drawMap = function()
{

	for(var i =0; i < this.squares.length; i++)
	{
		for(var j =0; j < this.squares[i].length; j++)
		{
			if(this.squares[i][j].type == 0)
			{
				this.squares[i][j].draw(0x01a05f);
				
			}
			else if(this.squares[i][j].type == 1)
			{
				
				this.squares[i][j].draw(0x002013);
			}
			else if(this.squares[i][j].type == 2)
			{
				
				this.squares[i][j].draw(0x310c0c);
			}
			else if(this.squares[i][j].type == 3)
			{
				
				this.squares[i][j].draw(0x2cabe2);
			}
		}
	}
}

World.prototype.addTiles = function(X,Y,type)
{
	if(X > 0 && X < 31 && Y > 0 && Y < 15)
	{
		this.squares[X-1][Y].type =type;
		this.squares[X-1][Y-1].type = type;
		this.squares[X-1][Y+1].type = type;
		this.squares[X][Y+1].type = type;
		this.squares[X][Y-1].type = type;
		this.squares[X+1][Y].type = type;
		this.squares[X+1][Y+1].type = type;
		this.squares[X+1][Y-1].type = type;
	}
}

var world = new World();

