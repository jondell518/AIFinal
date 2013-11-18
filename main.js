
var X = 800;
var Y = 600;
var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");




var squareDim = 50;
var squareOffset = 2;

var squares = [];
var playerCost = 0;

var rndX =0;
var rndY = 0;




var square = function(x,y,type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.isBuilt = false;
	

	this.draw = function(color)
	{
		ctx.fillStyle = color;
		var posX = this.x*(squareDim+squareOffset);
        var posY = this.y*(squareDim+squareOffset);
        ctx.fillRect(posX,posY,squareDim, squareDim);
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
	this.generateGoal();
	console.log("START AND END GENERATED");

	c.addEventListener('click',function(evt){
    	var indexX = Math.floor(evt.clientX/(squareDim+squareOffset));
    	var indexY = Math.floor(evt.clientY/(squareDim+squareOffset));
   	 	squares[indexX][indexY].draw("#838B8B");
   	 	playerCost += squares[indexX][indexY].cost;
   	});

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
	for(var i =0; i< 10; i++)
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
		rndX = Math.floor(Math.random()*this.width);
		rndY = Math.floor(Math.random()*this.height);

		if(rndX == 0 || rndY == 0 || rndX == this.width-1 || rndY == this.height-1)
		{
			notFound = true;
			squares[rndX][rndY].draw("#838B8B");
		}
	}
}

World.prototype.generateGoal = function()
{
	var notFound = false;
	while(!notFound)
	{
		var newRX = Math.floor(Math.random()*32);
		var newRY = Math.floor(Math.random()*16);

		if(newRX != rndX && newRY != rndY)
		{
			if(newRX == 0 || newRY == 0 || newRX == this.width-1 || newRY == this.height-1)
			{
				notFound = true;
				squares[newRX][newRY].draw("#838B8B");
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
				this.squares[i][j].draw('#01a05f');
				
			}
			else if(this.squares[i][j].type == 1)
			{
				
				this.squares[i][j].draw('#002013');
			}
			else if(this.squares[i][j].type == 2)
			{
				
				this.squares[i][j].draw('#310c0c');
			}
			else if(this.squares[i][j].type == 3)
			{
				
				this.squares[i][j].draw('#2cabe2');
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

