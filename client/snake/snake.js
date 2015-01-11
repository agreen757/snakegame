$(document).ready(function(){
    
    window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
    
    
    
    var canvas = $("#canvas")[0];
    //console.log('in here')
    var context = canvas.getContext('2d');
    //var interval = 60;
    var runstat = "running";
    var isPaused = false;
    
    var snakeArray;  //Global snake
    
    function looper(interval){
        if(!interval){
            interval = 90;
            console.log('null interval')
        }
        main_loop = setInterval(function(){
            
            if(!isPaused){
                //console.log(navigator.userAgent)
                return requestAnimFrame(colorSnake(interval))
            }
            
        },interval)
    }
    
    //This starts the snake game
    
    function game(){
        //set direction of snake
        d = "right"
        //Create the snake
        createSnake();
        snakeFood();
        
        //Initiate animation of the snake
        if(typeof main_loop != "undefined") clearInterval(main_loop);
        
        //This function only set off the loop if its not curretnly 
        //paused by line 181
        looper()
        
    }
    
    //Initiate game 
    game()
    
    var cw = 10; //Global cell(snake segment) width
    
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var food;
    var score = 0;
    
    
    
    
    function createSnake(){
        
        var snakeLength = 5;  
        snakeArray = [];

        for(var i=snakeLength-1;i>=0;i--){
            snakeArray.push({x:i,y:0});
            //console.log(i)
        }
    }
    
    
    function snakeFood(){
        food = {
            x: Math.round(Math.random()*(w-cw+snakeArray[0].x)/cw),
            y: Math.round(Math.random()*(h-cw+snakeArray[0].y)/cw)
        }
    }
    //make first food
    snakeFood()
    
    //Give the snake a color
    function colorSnake(interval){
        //console.log(interval)
        //snakeFood()
        //entire canvas color
        context.fillStyle = "#eee"
        context.fillRect(0, 0, w, h);
        
        //border color
        context.strokeStyle = "black"
        context.strokeRect(0, 0, w, h);
        
        //Snake movement section*********
        var newx = snakeArray[0].x;
        var newy = snakeArray[0].y;
        
        //Set direction of the snake
        switch (d) {
            case 'right':
                // code
                newx++;
                break;
            case 'left':
                newx--;
                break;
            case 'up':
                newy--;
                break;
            case 'down':
                newy++;
                break;
            
            default:
                // code
        }
        
        //Game Over function
        if(newx == -1 || newx == w/cw || newy == -1 || newy == h/cw || collision(newx,newy,snakeArray)){
            interval = 60;
            score = 0;
            game();
            return;
        }
        
        //Give snake ability to eat food
        
        if(newx == food.x && newy == food.y){
            
            //This works by creating a new head instead
            //a tail to lengthen the snake
            var tail = {x:newx,y:newy};
            
            //This makes more food
            score++;
            interval -= 5;
            clearInterval(main_loop)
            looper(interval)
            
            snakeFood();
            
        }
        else{
            var tail = snakeArray.pop();
            tail.x = newx;
            tail.y = newy;
        }
        
        
        snakeArray.unshift(tail)
        
        
        //*********************************
        
        _.each(snakeArray, function(i){
            painter(i.x,i.y)
        })
        /*for(var i=0;i<snakeArray.length;i++){
            
            var c = snakeArray[i];
            //paint snake
            painter(c.x,c.y)
            
        }*/
        
        //paint the food
        painter(food.x,food.y)
        
        //display the score
        var scoreText = "Score: " + score;
        context.fillText(scoreText,5,h - 5)
        /*setTimeout(function(){
            requestAnimationFrame(colorSnake)  
        },60);*/
    }
    
    function painter(x,y){
        context.fillStyle = "blue"
        context.fillRect(x*cw, y*cw, cw, cw);
        
        //Create borders
        context.strokeStyle = "white";
		context.strokeRect(x*cw, y*cw, cw, cw);
    }
    
    
    function collision(x,y,array){
        
        //Did not use underscore function here due to _.each not returning properly
        for(var i=0;i<array.length;i++){
            
            if(array[i].x == x && array[i].y == y){
                return true;
            }
            
        }
        return false;
    }
    
    $('canvas').click(function(){
        interval = 60;
        score = 0;
        game();
        return;
    })
    
    
    //Add some key functions to control the snake
    
    $(document).keydown(function(k){
        var key = k.which;
        
        //console.log(key)
        
        if(key == "32"){
            if(!isPaused){
                isPaused = true;
            }
            else{
                isPaused = false;
            }
            /*
            if(runstat == "running"){
                console.log('should pause')
                clearInterval(main_loop);
                runstat = "paused"
            }
            else if(runstat == "paused"){
                setInterval(colorSnake,100);
                runstat = "running"
            }*/
        }
        
        
        if(key == "37" && d != "right"){
            d = "left";
        }
        else if(key == "38" && d != "down"){
            d = "up";
        }
        else if(key == "39" && d != "left"){
            d = "right";
        }
        else if(key == "40" && d != "up"){
            d = "down";
        }
    })
    
})