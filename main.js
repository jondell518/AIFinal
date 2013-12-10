var squareDim = 50;
var squareOffset = 2;

var squares = [];
var tracks = [];
var AItracks = [];
var trackCounter = 0;
var AItrackCounter = 0;
var playerCost = 0;

var frameDelay = 30;
var frameCount = 0;
var trainCounter = 0;

var startX =0;
var startY = 0;

var endX = 0;
var endY = 0;

var lastX = 0;
var lastY = 1;

var gameOver = false;
var gameWon = false;
var stage = new PIXI.Stage(0x000000, true);
var renderer = new PIXI.CanvasRenderer(1660, 830);
stage.click = function(data)
{
	
	var indexX = Math.floor(data.global.x/(squareDim+squareOffset));
	var indexY = Math.floor(data.global.y/(squareDim+squareOffset));
	if(areAdjacent(indexX,indexY,tracks, trackCounter))
	{
		if(indexX == endX && indexY == endY)
		{
			gameWon = true;
			playerCost += squares[indexX][indexY].cost;
			
			
		}
		else
		{
			squares[indexX][indexY].type = 4;
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
    if(frameCount == frameDelay)
    {
    	world.moveTrain();
    	frameCount = 0;
    }
    
    renderer.render(stage);
    if(gameWon)
    {

		// Add text.
		var text = new PIXI.Text("YOU WON YOUR TOTAL COST WAS: $" + playerCost + "\n" + "THE AI's TOTAL COST WAS: $" + world.search.solutionNode.costSoFar, {font: 'bold 40px Avro', fill: 'white', align: 'center'});
		text.position = new PIXI.Point(renderer.width / 2, renderer.height / 2);
		text.anchor = new PIXI.Point(0.5, 0.5);
		graphics.beginFill(0x000000);
		graphics.drawRect(0,0, renderer.width, renderer.height);
		stage.addChild(text);

		// Render the stage.
		renderer.render(stage);
		console.log(playerCost);
    	
    }
    else if(gameOver)
    {
    	// Add text.
		var text = new PIXI.Text("YOU LOST TRY AGAIN NEXT TIME", {font: 'bold 40px Avro', fill: 'white', align: 'center'});
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
    	requestAnimFrame( animate );
    	frameCount++;
    }          
}




var square = function(x,y,type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.isBuilt = false;
	this.alreadyInFringe = false;
	

	this.draw = function(color)
	{
		graphics.beginFill(color)
		var posX = this.x*(squareDim+squareOffset);
        var posY = this.y*(squareDim+squareOffset);
        graphics.drawRect(posX,posY,squareDim, squareDim);
	}
}


var areAdjacent = function(X, Y, tracks, trackCounter)
{
	if(Math.abs(X - tracks[trackCounter-2]) <= 1 && Math.abs(Y-tracks[trackCounter-1]) <= 1)
	{
		return true;
	}
}

var aiAdjacent = function(X1, Y1, X2, Y2)
{
	if(Math.abs(X1 - X2) <= 1 && Math.abs(Y1-Y2) <= 1)
	{
		return true;
	}
}





var World = function()
{

	this.showAI = false;
	this.showAI = confirm("Show the AI Solution?"); 
	
	//Sets up the world, by generating a random map

	//0 is flat, 2 is mountain, 3 is water, 1 is forest
	this.types = [0,1,2,3];

	//number of cells wide
	this.width = 32;

	//number of cells high
	this.height = 16;

	this.generateMap();
	console.log("MAP INTIALIZED");
	console.log("MAP DRAWN");
	this.generateStart();
	this.search = new Search();
	tracks[trackCounter] = startX;
	tracks[trackCounter+1] = startY;
	trackCounter+=2;
	this.drawMap();
	this.generateGoal();

	
	this.search.findSolution();

	if(this.showAI)
	{
		this.drawAIsolution(this.search.solutionNode);
	}
	
	console.log("START AND END GENERATED");
	
}

World.prototype.generateMap = function()
{
	var picked =0;
	
	for(var i =0; i< this.width; i++)
	{
		squares[i] = [];
		for(var j = 0; j <this.height; j++)
		{
			squares[i][j] = new square(i,j,0);	
		}
	}


	//generate 20 blocks of each type of tile, rest are flat
	for(var i =0; i< 20; i++)
	{
		var waterX = Math.floor(Math.random()*this.width);
		var waterY = Math.floor(Math.random()*this.height);
		var mountainX = Math.floor(Math.random()*this.width);
		var mountainY = Math.floor(Math.random()*this.height);
		var forestX = Math.floor(Math.random()*this.width);
		var forestY = Math.floor(Math.random()*this.height);

		squares[waterX][waterY].type = 3;
		this.addTiles(waterX,waterY,3);
		squares[mountainX][mountainY].type = 2;
		this.addTiles(mountainX,mountainY,2);
		squares[forestX][forestY].type = 1;
		this.addTiles(forestX,forestY, 1);
	}

	for(var i =0; i< this.width; i++)
	{
		
		for(var j = 0; j <this.height; j++)
		{
			squares[i][j].cost = (squares[i][j].type*5)+5	
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
			squares[startX][startY].type = 4;
		}
	}
}

World.prototype.generateGoal = function()
{
	var notFound = false;
	while(!notFound)
	{
		endX = Math.floor(Math.random()*this.width);
		endY = Math.floor(Math.random()*this.height);

		if(endX != startX && endY != startY)
		{
			if(endX == 0 || endY == 0 || endX == this.width-1 || endY == this.height-1)
			{
				notFound = true;
				squares[endX][endY].draw(0xfff000);

				
			}
		}
	}
}
	





World.prototype.drawMap = function()
{

	for(var i =0; i < squares.length; i++)
	{
		for(var j =0; j < squares[i].length; j++)
		{
			if(squares[i][j].type == 0)
			{
				squares[i][j].draw(0x01a05f);
				
			}
			else if(squares[i][j].type == 1)
			{
				
				squares[i][j].draw(0x002013);
			}
			else if(squares[i][j].type == 2)
			{
				
				squares[i][j].draw(0x310c0c);
			}
			else if(squares[i][j].type == 3)
			{
				
				squares[i][j].draw(0x2cabe2);
			}
			else if(squares[i][j].type == 4)
			{
				squares[i][j].draw(0x838B8B);
			}
		}
	}
}

World.prototype.addTiles = function(X,Y,type)
{
	if(X > 0 && X < this.width-1 && Y > 0 && Y < this.height-1)
	{
		squares[X-1][Y].type =type;
		squares[X-1][Y-1].type = type;
		squares[X-1][Y+1].type = type;
		squares[X][Y+1].type = type;
		squares[X][Y-1].type = type;
		squares[X+1][Y].type = type;
		squares[X+1][Y+1].type = type;
		squares[X+1][Y-1].type = type;
	}
}

World.prototype.moveTrain = function()
{
	try
	{
		if(squares[tracks[trainCounter]][tracks[trainCounter+1]] != null && tracks.length > 2)
		{
			
			squares[tracks[lastX]][tracks[lastY]].draw(0x838B8B);

			lastX = trainCounter;
			lastY = trainCounter+1;

			squares[tracks[trainCounter]][tracks[trainCounter+1]].draw(0x000000);

		
		
		trainCounter+=2;
		frameCount = 0;
		}
	}
	catch(e)
	{
		gameOver = true;
		console.log("gameOver");
	}
	
}

World.prototype.drawAIsolution = function(solution)
{
	
	while(solution.parent != null)
	{
		squares[solution.state.x][solution.state.y].type = 4;
		squares[solution.state.x][solution.state.y].draw(0x838B8B);
		solution = solution.parent;
	}
}


var node = function(state, parent, stepCost)
{
	this.state = state;
	this.parent = parent;
	this.closed = false;
	if(parent == null)
	{
		this.cost =0;
		this.costSoFar =0;
	}
	else
	{
		this.cost = stepCost;
		this.costSoFar = parent.costSoFar + this.cost;
	}


	this.straightLine = function()
	{
		var h = 1;

		var X = Math.abs(this.state.x - endX);
		var Y = Math.abs(this.state.y - endY);

		var XYsquared = Math.pow(X,2) + Math.pow(Y,2);

		h = Math.sqrt(XYsquared);


		return h;
	}

	this.aStarCost = this.costSoFar + this.straightLine();


}


var Search = function()
{
	this.fringe = [];
	this.expanded = [];
	this.totalCost = 0;
	this.solution = false;
	this.cutoff = 50000;
	this.counter = 0;
	this.built = [];
	this.solutionNode = null;


	this.findSolution = function()
	{
		this.startNode = new node(squares[startX][startY], null, 0);
		console.log(this.startNode);
		this.fringe.push(this.startNode);

		while(this.fringe.length > 0)
		{
			var index = this.chooseFromFringe();
			
			this.currentNode = this.fringe[index];
			this.fringe.splice(index,1);
			
			if(this.currentNode.state.x == endX && this.currentNode.state.y == endY)
			{
				this.solution = true;
				this.totalCost = this.currentNode.costSoFar;
				console.log(this.currentNode);
				this.solutionNode = this.currentNode;
				break;
			}
			else if(Math.abs(this.currentNode.state.x-endX) == 1 && Math.abs(this.currentNode.state.y - endY) == 1)
			{
				console.log("NEXT TO GOAL!");
				console.log("PROCEEDING TO GOAL");
				this.solution = true;
				this.solutionNode = new node(squares[endX][endY],this.currentNode, squares[endX][endY].cost);
				break;
			}


			for(var i = this.currentNode.state.x - 1; i <= this.currentNode.state.x + 1; i++) 
			{
				for(var j = this.currentNode.state.y - 1; j <= this.currentNode.state.y + 1; j++) 
				{					
					if(!(this.currentNode.state.x == i && this.currentNode.state.y == j) && i >= 0 && i < 32 && j >= 0 && j < 16 && !this.alreadyInFringe(new node(squares[i][j], this.currentNode, squares[i][j].cost))) 
					{	
			    		this.fringe.push(new node(squares[i][j],this.currentNode,squares[i][j].cost));
					}
				 }
			}
				
			
			this.counter++;
			
		}

		if(this.solution)
		{
			console.log("SOLUTION FOUND");
			console.log("TOTALCOST FOR THE AI: " + this.totalCost);
		}
	}

	this.chooseFromFringe = function()
	{
		//Sorts the array so that the smallest astar cost is the first element, then returns 0
		this.fringe.sort(function(a,b){return a.aStarCost-b.aStarCost});
			
		
		return 0;
	}

	//loops through the fringe, checks to make sure this exact node is not already present
	//two nodes are identical if there astar costs are the same, as they must have the same cost to get there and to the goal
	this.alreadyInFringe = function(tempNode)	
	{
		for(var i = 0; i < this.fringe.length; i++)
		{
			if(this.fringe[i].aStarCost == tempNode.aStarCost)
			{
				return true;
			}
		}
		return false;
	}
}


var world = new World();

