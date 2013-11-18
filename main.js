
var X = 800;
var Y = 600;
var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");


var squareDim = 50;
var squareOffset = 2;



var square = function(x,y,type)
{
	this.x = x;
	this.y = y;
	this.type = type;

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

	//0 is flat, 1 is mountain, 2 is water, 3 is forest
	this.types = [0,1,2,3];

	//number of cells wide
	this.width = 32;

	//number of cells high
	this.height = 16;

	//array of the world
	this.squares = [];

	this.flat =0;
	this.mountain =0;

	this.generateMap();
	console.log(this.flat + " " + this.mountain);
	this.update();

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


	//generate 10 blocks of each type of tile
	for(var i =0; i< 10; i++)
	{
		var waterX = Math.floor(Math.random()*32);
		var waterY = Math.floor(Math.random()*16);
		var mountainX = Math.floor(Math.random()*32);
		var mountainY = Math.floor(Math.random()*16);
		var forestX = Math.floor(Math.random()*32);
		var forestY = Math.floor(Math.random()*16);

		this.squares[waterX][waterY].type = 2;
		this.addTiles(waterX,waterY,2);
		this.squares[mountainX][mountainY].type = 1;
		this.addTiles(mountainX,mountainY,1);
		this.squares[forestX][forestY].type = 3;
		this.addTiles(forestX,forestY, 3);
		
		
	}
}
	





World.prototype.update = function()
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
				this.squares[i][j].draw('#310c0c');
			}
			else if(this.squares[i][j].type == 2)
			{
				this.squares[i][j].draw('#2cabe2');
			}
			else if(this.squares[i][j].type == 3)
			{
				
				this.squares[i][j].draw('#002013');
			}

			
		}
	}
}

World.prototype.addTiles = function(X,Y,type)
{
	if(X > 0 && X < 31 && Y > 1 && Y < 15)
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

