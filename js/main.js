window.onload = function() {	

	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");	

	// VARIABLES GLOBALES
	// cursor global
	var mouseX = 0;
	var mouseY = 0;
	var insideX = 0;
	var insideY = 0;

	// escenario global
	context.fillText("loading...", 40, 140);
	console.log("Starting game...");
	var canvasPos = getPosition(canvas);
	let factor = 0;
	let altoEscenario = (canvas.height / 3) * 2; // dos terceras partes del alto del canvas
	let horizonteX = canvas.height / 3;
	var fps = 60;
	let frames = 0;
	var board = new Board();
	// protagonista global
	var img = {};
	let altoSalto = 30;
	let jumpingTimeControl = 0;
	let breathInc = 0.1;
	let breathDir = 1;
	let breathAmt = 0;
	let breathMax = 2;
	let breathInterval = setInterval(updateBreath, 1000 / fps);
	breathInterval = setInterval(updateBreath, 50000 );
	var maxEyeHeight = 14;
	var curEyeHeight = maxEyeHeight;
	var eyeOpenTime = 0;
	var timeBtwBlinks = 40;
	var blinkUpdateTime = 50;                    
	var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
	var fpsInterval = setInterval(updateFPS, 1000);

	// Triggers
	document.getElementById("start-button").onclick = function() {
		startGame();
	}
	canvas.addEventListener("mousemove", setMousePosition, false);
	canvas.addEventListener("mousedown", salta, false);
	addEventListener("keydown", function(e){
		console.log("Codeando el press 32");
		if (e.keyCode === 32){
			salta();
  		}
  	});

	// Fondo del juego
	function Board(){
	  	this.x = 0;
	  	this.y = canvas.height / 3;
	  	this.width = canvas.width;
	  	this.height = (canvas.height / 3) * 2;
	  	this.score = 0;
	  	this.img = new Image();
	  	this.img.src = 'images/marSmall.jpg';  	

	  	this.img.onload = function(){
	  		this.draw();
	  	}.bind(this); // cambiar el apuntador de img a Board

	  	this.move = function(){
				
	  		this.x--;
	  		if(this.x < -canvas.width) this.x = 0;
	  	}

	  	this.draw = function(){

			if (!(frames%160 == 0)) return;

  			this.move();
  			context.drawImage(this.img, this.x, this. y, this.width, this.height);
			context.drawImage(this.img, (this.x + this.width), this. y, this.width, this.height);			
	  	}

	  	this.drawScore = function(){
	  		this.score = Math.floor(frames/60);
	  		context.font = "50px Avenir";
	  		context.fillStyle = "orange";
	  		context.fillText("Puntos: " + this.score, this.width/2, this.y + 50);
	  	}
	}
	
	function circulo(){
  	this.x = insideX;
  	this.y = insideY;
  	this.radio = 20;
		this.height = (canvas.height / 3) * 2;
		
  	this.move = function(){			
  		this.x--;
  		if(this.x < -canvas.width) this.x = 0;
  	}

  	this.draw = function(){
			if (!(frames%160 == 0)) return;
  		this.move(); 		

			radio2 = (( mouseY - 200 ) / 10 ) + 20;

			context.beginPath();
		// context.arc(350, 200, 50, 0, 2 * Math.PI, true);
			context.arc(insideX, insideY, radio2, 0, 2 * Math.PI, true);
			context.fillStyle = "green";
			context.fill();
  	}  	
  }


	// Inicio del juego
	function startGame(){		
		// manejo de los enemigos / bombas
		let bombas = 8;
		let radio = 40;
		let radio2 = 0;
		let inicioX = [0,100,200,300,400,500,600,700];
		let inicioY = [0,0,0,0,0,0,0,0];
		let finX = [0,100,200,300,400,500,600,700];
		let finY = [600,600,600,600,600,600,600,600];	
		let distance = 0;
		let kaboom = false;
		// manejo del protagonista		
		loadImage("leftArm");
		loadImage("legs");
		loadImage("torso");
		loadImage("rightArm");
		loadImage("head");
		loadImage("hair");		
		loadImage("leftArm-jump");
		loadImage("legs-jump");
		loadImage("rightArm-jump");
		loadImage("marSmall");		
	}
	
	var totalResources = 9;
	var numResourcesLoaded = 0;
	var charX = (canvas.width / 2 );
	var charY = (canvas.height / 2);
	
	var numFramesDrawn = 0;
	var curFPS = 0;
	var jumping = false;		

	function loadImage(name) {
	  img[name] = new Image();
	  img[name].onload = function() { 
		  resourceLoaded();
	  }		
		if (name == "marSmall") img[name].src = "images/" + name + ".jpg";
		else img[name].src = "images/" + name + ".png";
	  console.log("Cargando imagen " + name);
	}

	function resourceLoaded() {
	  numResourcesLoaded += 1;
	  if(numResourcesLoaded === totalResources) {
			console.log("Recursos Cargados... \n Iniciando juego");	
	  	update();	  		
	  }
	}

	function update() {
		// NOTA IMPORTANTE :::*** SALE MAS BARATO EN CPU DIBUJAR SOBRE EL CANVAS QUE ESTARLO LIMPIANDO CON CLEARRECT
		board.draw();
		board.drawScore();
		// context.clearRect(0, 0, canvas.width, canvas.height);
	 	drawLine(board.y);
	 	drawCircle();
	 	// dibujaBala();	 	
	 	redraw();
		setInterval(update, 1000 / fps); 
		frames ++;
	 	// console.log(" Y: " + ObjetivoY + " X: " + ObjetivoX + " XF: " + ObjetivoXFinal + " YF: " + ObjetivoYFinal);		
	}

	function setMousePosition(e) {
		// mouseX = e.clientX;
		// mouseY = e.clientY;
		mouseX = e.clientX - canvasPos.x;
		mouseY = e.clientY - canvasPos.y;
		context.clearRect(25,25,600,100);
		context.fillText(" mouseX: " + mouseX + "mouseY: " + mouseY, 50, 50);
		context.fillText(" horizonteX: " + horizonteX, 60, 60);
		if (mouseY >= horizonteX && mouseY < canvas.height) {
			if (mouseX > 0 && mouseX < canvas.width){
				insideX = mouseX;
				insideY = mouseY;
				factor = ( mouseY * 20 ) / canvas.height;
				factor = (factor / 10) + .25;
				context.fillText("factor: " + factor + " insideX: " + insideX + "insideY: " + insideY, 80, 80);
			}			
		}				
	}  	

	function drawLine(limiteSuperior){
		context.beginPath();		
		context.moveTo(0,limiteSuperior);
		context.lineTo(canvas.width,limiteSuperior);
		context.stroke();
	}

	function drawCircle(){	
		if (!(frames%160 == 0)) return;
		context.beginPath();
		// context.arc(350, 200, 50, 0, 2 * Math.PI, true);
		context.arc(insideX, insideY, 10 * factor, 0, 2 * Math.PI, true);
		context.fillStyle = "yellow";
		context.fill();
	}

	function dibujaBala(){				
		for (b = 0; b < bombas; b++){			
			context.beginPath();
			context.arc(inicioX[b]	, inicioY[b], radio, 0, 2 * Math.PI, true);			
			context.fillStyle = "black";

			// distance = Math.sqrt(  Math.pow( (inicioX[b] − insideX) , 2 ) + Math.pow((inicioY[b] − insideY) , 2 )   ) − (radio2 + radio);

			distance =( Math.sqrt( Math.pow( inicioX[b]-insideX, 2)  + Math.pow( inicioY[b]-insideY, 2) )  ) - (radio2 + radio);

			if (distance < 15){
				context.fillStyle = "red";
			}			
	  		context.fill();	  	
			
		}
		for (b = 0; b < bombas; b++){
			// inicioX[b] += 10;
			inicioY[b] += .050;
		}
		for (b = 0; b < bombas; b++){
			if (inicioY[b] > finY[b]){
				inicioY[b] = 0;
				// multiplos de 50 desde 0 hasta 300
				let destino = (Math.floor(   (Math.random() * 7)   )) * 50
				// por lo menos debe comenzar en 200
				destino = destino + 200 				
				finY[b] = destino;	
			}
		}				

		// revisar colision				
		
	}	

	function getPosition(el) {
	  var xPosition = 0;
	  var yPosition = 0;
	 
	  while (el) {
	    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
	    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
	    el = el.offsetParent;
	  }

	  return {
	    x: xPosition,
	    y: yPosition
	  };
	}  	
	function redraw() {	

		if (frames%2000 == 0) {						
			if (jumpingTimeControl > 0) jumpingTimeControl -= jumpingTimeControl;
			if (jumpingTimeControl == 0) jumping = false;			
		}	
		
		// Draw shadow
		if (jumping) {
			drawEllipse(insideX + (50 * factor), insideY + (30 * factor), (120 * factor) - breathAmt, 4 * factor, "black");
	  	} else {
			drawEllipse(insideX + (50 * factor), insideY + (30 * factor), (240 * factor) - breathAmt, 8 * factor, "red");
		}	  		
		
		if (jumping) {			
			context.drawImage(img["leftArm-jump"]		, insideX + (40 * factor)	, insideY - (42 * factor)	- (breathAmt) ,img["leftArm-jump"].width	* factor, factor * img["leftArm-jump"].height);
	  	} else {
	  		context.drawImage(img["leftArm"]		, insideX + (40 * factor)	, insideY - (42 * factor)	- (breathAmt) ,img["leftArm"].width	* factor, factor * img["leftArm"].height);
		}

		if (jumping) {			
			context.drawImage(img["legs-jump"]		, (insideX )		, (insideY ) - (6 * factor)		,img["legs-jump"].width		* factor, factor * img["legs-jump"].height);
	  	} else {			
			context.drawImage(img["legs"]		, (insideX)		, (insideY )		,img["legs"].width		* factor, factor * img["legs"].height);
		}

		context.drawImage(img["torso"]		, insideX					, insideY - (50	* factor)	,img["torso"].width 	* factor, factor * img["torso"].height);		

		context.drawImage(img["head"]		, insideX - (10 * factor)	, insideY - (125 * factor)	- breathAmt , img["head"].width		* factor, factor * img["head"].height);
		context.drawImage(img["hair"]		, insideX - (37 * factor)	, insideY - (138 * factor)	- breathAmt , img["hair"].width 		* factor, factor * img["hair"].height);

		if (jumping) {			
			context.drawImage(img["rightArm-jump"]	, insideX - (35 * factor)	, insideY - (42	* factor) - (breathAmt * factor)	- breathAmt ,img["rightArm-jump"].width	* factor, factor * img["rightArm-jump"].height);
	  	} else {			
			context.drawImage(img["rightArm"]	, insideX - (15 * factor)	, insideY - (42	* factor) - (breathAmt * factor) - breathAmt ,img["rightArm"].width	* factor, factor * img["rightArm"].height);
	  	}	
			

		drawEllipse(insideX + (47 * factor), insideY - (68 * factor) - breathAmt, (8 * factor), (curEyeHeight * factor), "black"); // Ojo Izquierdo
	  	drawEllipse(insideX + (58 * factor), insideY - (68 * factor) - breathAmt, (8 * factor), (curEyeHeight * factor), "black"); // Ojo Derecho

		return;

	  	// if (jumping) {
		// 	Y -= jumpHeight;
		// }  	 	
	  
	}

	function drawEllipse(centerX, centerY, width, height, piFillStyle) {

	  context.beginPath();
	  
	  context.moveTo(centerX, centerY - height/2);
	  
	  context.bezierCurveTo(
		centerX + width/2, centerY - height/2,
		centerX + width/2, centerY + height/2,
		centerX, centerY + height/2);

	  context.bezierCurveTo(
		centerX - width/2, centerY + height/2,
		centerX - width/2, centerY - height/2,
		centerX, centerY - height/2);
	 
	  context.fillStyle = piFillStyle;
	  context.fill();
	  context.closePath();	
	}

	function updateBreath() { 
					
	  if (breathDir === 1) {  // breath in
		breathAmt -= breathInc;
		if (breathAmt < -breathMax) {
		  breathDir = -1;
		}
	  } else {  // breath out
		breathAmt += breathInc;
		if(breathAmt > breathMax) {
		  breathDir = 1;
		}
	  }
	}

	function updateBlink() { 
					
	  eyeOpenTime += blinkUpdateTime;
		
	  if(eyeOpenTime >= timeBtwBlinks){
		blink();
	  }
	}

	function blink() {

	  curEyeHeight -= 1;
	  if (curEyeHeight <= 0) {
		eyeOpenTime = 0;
		curEyeHeight = maxEyeHeight;
	  } else {
		setTimeout(blink, 10);
	  }
	}
	function salta(){		
		if (!jumping){
			jumping = true;
			jumpingTimeControl = 6000;
		}
	}
	
	function updateFPS() {
		
		curFPS = numFramesDrawn;
		numFramesDrawn = 0;
	}
}
