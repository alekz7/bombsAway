window.onload = function() {

	let cvs = document.getElementById("miCanvas");
	let ctx = cvs.getContext("2d");	
	let fps = 60;
	let frames = 0;
	let intervalo = 0;

	// PROTAGONISTA
	let spt = new Image();
	let cualH = 0;
	let cualV = 0;
	let cuantosH; // cuantos hay horizontales
	let cuantosV; // cuantos hay verticales
	let chX;	
	let chY;
	let chW;
	let chH;
	let VelocidadNormal = 100;
	let centro;
	let exponencial;
	let gravedad = 1;
	let scoreAvanzaNivel = 2000;

	// PLATAFORMA
	let island = new Image();
	let horizonte;	
	let board = new Board();
	let img = new Image();
	let img2 = new Image();
	let nube = new Image();
	let bomba = new Image();
	let kapow = new Image();
	let coco = new Image();	
	let fondo = new Image();
	let damage = [];
	let puntosExtra = [];
	let gameOver = false;
	let ganador = false;
	let winnerScore = false;
	let winnerCocos = false;
	let soundGame = new Audio();
	let soundGameOver = new Audio();
	let soundGameWinner = new Audio();		
	let soundGameCoin = new Audio();
	let soundGameBomba = new Audio();
	let dificultad = 3;
  	
	//BOMBAS
	bombas 		= [];	
	cocos   	= [];	

	redimensionar();
	cargarComponentes();
	
	function resetVariables(nivel){
		intervalo = 0;
		gameOver = false;
		ganador = false;
		winnerScore = false;
		winnerCocos = false;	
		bombas 		= [];
		cocos   	= [];
		puntosExtra = [];
		frames		= 0;
		chX = (cvs.width / 2) - 106.5;
		chY = cvs.height / 2;
		gravedad = 1;
		if (nivel == 0) {
			dificultad = 3;
			damage = [];
		}
		else {
			damage.pop()
			dificultad++;
		}		
	}

	// COMPONENTES
	function cargarComponentes(){		
		console.log("Cargando componentes");
		cuantosH = 3; // cuantos hay horizontales
		cuantosV = 2; // cuantos hay verticales
		spt.src = "images/hongo.png";						
		island.src = "images/IslandTwo.png";
		img.src = 'images/marSmall.jpg';
		img2.src = 'images/marSmall2.jpg';
		nube.src = "images/Nubes.jpg";
		bomba.src = "images/bombaFire.png";
		kapow.src = "images/kapow.png";
		coco.src  = "images/coco.png"		
		fondo.src = "images/background.jpg"
		soundGame.src = "sound/05 Super Mario 64 Main Theme.mp3";
		soundGameOver.src = "sound/New_Super_Mario_Bros_Death_Sound_Effect.mp3";
		soundGameWinner.src = "sound/19 Correct Solution.mp3";			
		soundGameCoin.src = "sound/New_Super_Mario_Bros_Coin_Sound_Effect.mp3";
		soundGameBomba.src = "sound/01_Start Up.mp3";
	}	
	function update(){ // se esta ejecutando cada fps veces por segundo		
		ctx.clearRect(0,0,cvs.width,cvs.height);
		board.draw();
		dibujaTableroScore();
		dibujaIsla();
		dibujaLinea();		
		dibujaCaracter();
		dibujaBombas();		
		dibujaCocos();		
		controlTiempo();
	}
	function dibujaTableroScore(){
		let center = (cvs.width / 2);		
		exponencial = (chX - centro) / 100;
		chX += exponencial;		
		score = Math.floor((frames / 60) * 100);
		if (score % 100 == 0) scoreTemp = score;
		ctx.font = "50px courier";
	  	ctx.fillStyle = "yellow";
	  	ctx.fillText("Cocos: " + puntosExtra.length, 400, 50);	    
	  	ctx.fillText("Puntos: " + scoreTemp, 400, 100);
	  	if (scoreTemp >= scoreAvanzaNivel) {
	  		winnerScore = true;
	  		cualH = 2;
			cualV = 0;
			dibujaCaracter();	  		
	  	}
	  	let misVidas = "";
	  	damage.forEach(function(elem){
	  		misVidas = misVidas + "X";
	  	});	  	
	  	ctx.fillText("Damage: " + misVidas, 400, 150);
	  	ctx.fillText("Nivel: " + (dificultad - 3), 950, 400);
	}
	function dibujaBombas(){
		// AGREGAR BOMBAS
		if (bombas.length < dificultad){
			bombas.unshift({
				x:(Math.random() * 900) + 60, 
				y:Math.random() * 20,
				colision:false,
				id:Math.random()
			});
		}
		// ELIMINAR BOMBAS QUE YA NO ESTAN EN EL ESCENARIO
		for(let i = 0; i< bombas.length; i++){
			if (bombas[i].y > cvs.height){
				bombas.splice(i, 1);				
			}
		}		
		// CHECAR COLISION		
		// ctx.rect(bombas[i].x, bombas[i].y,bomba.width / 10 , bomba.height / 10);
		// ctx.rect(chX + 25,	chY + 25,	chW - 58,			chH);
		for(let i = 0; i< bombas.length; i++){
			if (
				bombas[i].x + (bomba.width / 10) > chX + 25
				&&
				bombas[i].x < (chX + 25) + (chW - 58)
				&&
				bombas[i].y - (bomba.height / 10) > chY
				&&
				bombas[i].y - (bomba.height / 10) < chY + chH
				){								
				bombas[i].colision = true;
				if (damage.indexOf(bombas[i].id) == -1){					
					damage.push(bombas[i].id);					
					soundGameBomba.play();
				}							
			}
		}
		// DIBUJAR BOMBAS
		// if (frames%fps === 0){ cada segundo		
		for(let i = 0; i< bombas.length; i++){
			if (bombas[i].colision){
				ctx.drawImage(kapow,
					bombas[i].x,
					bombas[i].y,
					bomba.width / 5,
					bomba.height / 5
				);
			} else {
				ctx.drawImage(bomba,			
					bombas[i].x,
					bombas[i].y,
					bomba.width / 10,
					bomba.height / 10
				);
			}
			
			// ctx.strokeStyle="black";
			// ctx.rect(bombas[i].x, bombas[i].y,bomba.width / 10 , bomba.height / 10);
			// ctx.stroke();
			bombas[i].y = bombas[i].y * 1.025;
		}		

		if (damage.length >= 5){
			gameOver = true;
			cualH = 2;
			cualV = 1;
			dibujaCaracter();
		}
	}
	function dibujaCocos(){
		// AGREGAR COCOS
		if (cocos.length < 3){
			cocos.unshift({
				x:(Math.random() * 900) + 60,
				y:Math.random() * 20,
				colision:false,
				id:Math.random()
			});
		}
		// ELIMINAR COCOS QUE YA NO ESTAN EN EL ESCENARIO
		for(let i = 0; i< cocos.length; i++){
			if (cocos[i].colision){
				cocos.splice(i, 1);				
			}
		}		
		// CHECAR COLISION		
		// ctx.rect(cocos[i].x, cocos[i].y,coco.width / 10 , coco.height / 10);
		// ctx.rect(chX + 25,	chY + 25,	chW - 58,			chH);
		for(let i = 0; i< cocos.length; i++){
			if (
				cocos[i].x + (coco.width / 10) > chX + 25
				&&
				cocos[i].x < (chX + 25) + (chW - 58)
				&&
				cocos[i].y - (coco.height / 10) > chY
				&&
				cocos[i].y - (coco.height / 10) < chY + chH
				){								
				cocos[i].colision = true;
				if (puntosExtra.indexOf(cocos[i].id) == -1){					
					puntosExtra.push(cocos[i].id);
					soundGameCoin.play();
				}							
			}
		}
		// DIBUJAR cocoS
		// if (frames%fps === 0){ cada segundo		
		for(let i = 0; i< cocos.length; i++){
			
			ctx.drawImage(coco,
				cocos[i].x,
				cocos[i].y,
				coco.width / 10,
				coco.height / 10
			);								
			if (cocos[i].y < 450) cocos[i].y = cocos[i].y * 1.025;		
		}		

		if (puntosExtra.length >= 10){
			winnerCocos = true;
			cualH = 2;
			cualV = 0;
			dibujaCaracter();			
		}
	}	
	function redimensionar(){
		// RESIZE
		cvs.width = window.innerWidth - 30;
		cvs.height = window.innerHeight - 30;		
		chX = (cvs.width / 2) - 106.5;
		centro = chX;
		chY = cvs.height / 2;
		horizonte = cvs.height / 3;		
	}	
	function dibujaLinea(){				

		if ((chX - centro) == 0){
			cualH = 0;
			cualV = 0;			
		}else if((chX - centro) > 0){									
			cualH = 1;
			cualV = 0;						

			if (chX + (chW / 2) > island.width - 1020){
				// hombre al agua
				cualH = 0;
				cualV = 1;
				gravedad = gravedad * 1.01;	
			}
			
		} else{
			cualH = 1;
			cualV = 1;			
			
			if (chX < island.x){
				// hombre al agua
				cualH = 0;
				cualV = 1;
				gravedad = gravedad * 1.01;	
			}			
		}					
	}		
	function startGame() {
		console.log("startGame" + intervalo);
		soundGame.play();
	  	if (intervalo>0) return;
	  	else {	  		
	  		intervalo=setInterval( function(){ update(); }, 1000/fps)
	  	}	  	
	}	
	function controlTiempo(){
		frames ++;
		if (frames%fps === 0){
			// console.log("Ahora si cada segundo");			
		}			

		// if ( frames > 15000 || gameOver) { // fps * 10 segundos = 600, se acaba el juego a los 10 segundos
		if ( gameOver) { // fps * 10 segundos = 600, se acaba el juego a los 10 segundos
			soundGame.pause();
			soundGame.currentTime = 0;
			soundGameOver.play();			
			ctx.font = "120px courier";
  			ctx.strokeStyle = 'red';
  			ctx.lineWidth = 8;  			  			
  			ctx.strokeText("Game Over",cvs.width / 2 - 350,250);
  			ctx.font = "80px courier";
  			ctx.strokeText("Clic volver a Empezar", cvs.width / 2 - 550, 350);
  			ctx.font = "40px courier";  			
			stop();
			intervalo = 0;
			resetVariables(0);
		}
		if (winnerCocos){
			soundGame.pause();
			soundGameWinner.play();
			ctx.font = "100px courier";
  			ctx.strokeStyle = 'yellow';
  			ctx.lineWidth = 8;  			  			
  			ctx.strokeText("Winner",cvs.width / 2 - 350,250);
  			ctx.font = "120px courier";
  			ctx.strokeStyle = 'black';
  			ctx.strokeText("Cocos: " + puntosExtra.length, 350, 350);
  			ctx.font = "80px courier";
  			ctx.strokeStyle = 'yellow';
  			ctx.strokeText("Clic siguiente nivel", 150, 450);
  			ctx.font = "40px courier";
			stop();
			intervalo = 0;
			resetVariables(1);
		}
		if (winnerScore){
			soundGame.pause();
			soundGameWinner.play();
			ctx.font = "100px courier";
  			ctx.strokeStyle = 'yellow';
  			ctx.lineWidth = 8;  			  			
  			ctx.strokeText("Winner",cvs.width / 2 - 350,250);
  			ctx.font = "120px courier";
  			ctx.strokeStyle = 'black';
  			ctx.strokeText("Score: " + scoreTemp, 350, 350);
  			ctx.font = "80px courier";
  			ctx.strokeStyle = 'yellow';
  			ctx.strokeText("Clic siguiente nivel", 150, 450);
  			ctx.font = "40px courier";
			stop();
			resetVariables(1);
		}
	}
	function stop(){
		clearInterval(intervalo);
	}
	function dibujaCaracter(){
		// ctx.drawImage(spt, sx, sy, sw, sh, dx, dy, dw, dh)
		// ctx.drawImage(spt, 0, 0, spt.width, spt.height, (spt.width / 3) * 2 , (spt.height / 2) * 1, 300, 300);
		for(let i = 0; i< bombas.length; i++){
			if(bombas[i].colision){
				cualH = 2;
				cualV = 1;
			}
		}
		chW = ( spt.width / cuantosH ) ;
		chH = ( spt.height / cuantosV ) ;

		if(cualH ==1 && cualV == 0){
			ctx.drawImage(spt,
				chW * cualH,
				chH * cualV,
				chW - 20,
				chH,
				chX,
				chY * gravedad,
				chW,
				chH
				);
		} else if(cualH ==2 && cualV == 0) {
			ctx.drawImage(spt,
				chW * cualH - 20,
				chH * cualV,
				chW,
				chH,
				chX,
				chY * gravedad,
				chW,
				chH
				);
		} else{
			ctx.drawImage(spt,
				chW * cualH,
				chH * cualV,
				chW,
				chH,
				chX,
				chY * gravedad,
				chW,
				chH
				);
		}		
		if (	chX < (0 - (chW / 2)) ||
				chX > cvs.width - (chW / 2) ||
				(chY * gravedad) < (0 - (chH / 2)) ||
				(chY * gravedad) > cvs.height - (chH / 2)
			)
		{
			gameOver = true;
		};		
	}
	function dibujaIsla(){		
		// ctx.drawImage(spt, sx, sy, sw, sh, dx, dy, dw, dh)
		// ctx.drawImage(spt, 0, 0, spt.width, spt.height, (spt.width / 3) * 2 , (spt.height / 2) * 1, 300, 300);					
		if ((chX - centro) == 0){
			ctx.drawImage(island,
				50,
				50,
				island.width / 2,
				island.height / 2
				);		
		}else if((chX - centro) > 0){
			// peso a la derecha
			ctx.rotate(5*Math.PI/180);
			ctx.drawImage(island,
				75,
				5,
				island.width / 2,
				island.height / 2
				);		
			ctx.rotate(-5*Math.PI/180);
		} else{
			// peso a la izquierda
			// aqui hay que dibujar la isla mas a la izquierda por la rotacion
			ctx.rotate(-5*Math.PI/180);
			ctx.drawImage(island,
				25,
				95,
				island.width / 2,
				island.height / 2
				);		
			ctx.rotate(5*Math.PI/180);
		}					
	}
	// EVENTOS		
	fondo.onload = function(){		
	    ctx.drawImage(fondo,0,0,cvs.width,cvs.height);
	    ctx.font = "60px courier";
	    ctx.fillStyle = "red";
	    ctx.lineWidth = 8;
	    ctx.strokeText(" clic para jugar!!!",cvs.width / 2 - 450,cvs.height / 3 ); 
	    
	    ctx.font = "80px courier";
  		ctx.fillStyle = "yellow";
  		ctx.lineWidth = 8;  			  			

	    ctx.strokeText("junta 10 cocos",cvs.width / 2 - 450,cvs.height / 2 + 50);
	    ctx.strokeText("o acumula " + scoreAvanzaNivel + " puntos",cvs.width / 2 - 450,cvs.height / 2 + 120);
	    ctx.strokeText("para avanzar de nivel",cvs.width / 2 - 450,cvs.height / 2 + 190);	    
	}
	document.getElementById("miCanvas").onclick = function() {		
		startGame();
	}
	addEventListener('keydown', function(e){		
		switch(e.keyCode){
			case 32:				
				cualH = 2;
				cualV = 1;
				break;			
			case 37:
				// console.log("Izquierda");
				chX -= VelocidadNormal + exponencial;
				break;			
			case 38:
				// console.log("Arriba");
				chY -= VelocidadNormal + exponencial;
				break;			
			case 39:
				// console.log("Derecha");
				chX += VelocidadNormal + exponencial;
				break;			
			case 40:
				// console.log("Abajo");
				chY += VelocidadNormal + exponencial;
				break;			
			default:			
		}		
	});
	function Board(){		
	  	this.x = 0;
	  	this.y = 0;
	  	this.score = 0;
	  	this.nubeX = 0;
	  	this.derecha = false;

	  	// this.img.onload = function(){
	  	// 	this.draw();
	  	// }.bind(this); // cambiar el apuntador de img a Board

	  	// this.img2.onload = function(){
	  	// 	this.draw();
	  	// }.bind(this); // cambiar el apuntador de img a Board

	  	this.move = function(){				
	  		this.x--;
	  		if(this.x < -cvs.width) this.x = 0;

	  		if (this.derecha){
	  			// console.log("derecha");
	  			this.nubeX++;
	  			if(this.nubeX == 0 ) this.derecha = false ;
	  		} else {
	  			// console.log("izquierda");
	  			this.nubeX--;
	  			if(this.nubeX == -60 ) this.derecha = true ;
	  		}	  		
	  	}

	  	this.draw = function(){	
  			this.move();  			
  			ctx.drawImage(img, this.x, horizonte, cvs.width, cvs.height);
			ctx.drawImage(img2, (this.x + cvs.width), horizonte, cvs.width, cvs.height);			
			// dibujando las nubes
			// ctx.drawImage(nube, this.x + 10 , 0, cvs.width - 10, cvs.height - horizonte);
			ctx.drawImage(nube,
				this.nubeX,
				0,
				cvs.width + 80,
				cvs.height - (horizonte * 2));
	  	}	  	
	}
}
