
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
			var last = 0;
			var twolast = 1;

			if(j > 2)
			{
				last = this.squares[i][j-1].type;
				twolast = this.squares[i][j-2].type;
			}
			else if(j == 1 && i >0)
			{
				last = this.squares[i][j-1].type;
				twolast = this.squares[i-1][15].type;
			}
			else if(j ==0 && i > 1)
			{
				last = this.squares[i-1][15].type;
				twolast = this.squares[i-1][14].type;
			}

			if(last != twolast)
			{
				 picked = this.types[Math.round(Math.random()*3)];
			}
			else if(last == twolast)
			{
				var prob = Math.round(Math.random()*100);
				
				if(prob == 20)
				{
					 picked = last;
					 console.log(prob);
				}
				else if(prob > 20)
				{
					var prob2 = Math.round(Math.random()*3);
					while(prob2 != last)
					{
						prob2 = Math.round(Math.random()*3);
					}
					 picked = prob2;
				}
			}
			this.squares[i][j] = new square(i,j,picked);
			
		}
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

var world = new World();

