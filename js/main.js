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
	let VelocidadNormal = 15;
	let centro;
	let exponencial;
	let gravedad = 1;

	// PLATAFORMA
	let island = new Image();
	let horizonte;
	let cuadritoSize;
	let board = new Board();
	let img = new Image();
	let img2 = new Image();
	let nube = new Image();
	let bomba = new Image();
	let kapow = new Image();
	let coco = new Image();
	// let cascara = new Image();
	let fondo = new Image();
	let damage = [];
	let puntosExtra = [];
	let gameOver = false;
	let ganador = false;

	//BOMBAS
	bombas 		= [];	
	cocos   	= [];
	// cascaras 	= [];
	// for(let i = 0; i< 10; i++){
	// 	bombas[i] = {x:i * 60, y:1};
	// }				

	redimensionar();
	cargarComponentes();
	
	// startGame();

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
		// cascara.src  = "images/cascara.png"
		fondo.src = "images/background.jpg"
	}	
	function update(){ // se esta ejecutando cada fps veces por segundo		
		ctx.clearRect(0,0,cvs.width,cvs.height);
		board.draw();
		// ctx.font = "20px Arial";
		// ctx.fillText("chX: " + chX,200,20);
		// ctx.fillText("cvs.width: " + cvs.width,200,40);
		// ctx.fillText("chW / 2: " + chW ,200,60);
		let center = (cvs.width / 2);
		// ctx.fillText("Center:" + center,200,80);		
		// chX += (center2 / 100);
		// ctx.fillText("centro: " + (chX - centro),200,120);		
		exponencial = (chX - centro) / 100;
		chX += exponencial;
		// ctx.fillText("exponencial: " + exponencial,200,140);				
		score = Math.floor((frames / 60) * 100);
		if (score % 100 == 0) scoreTemp = score;
		ctx.font = "50px Avenir";
	  	ctx.fillStyle = "yellow";
	  	ctx.fillText("Cocos: " + puntosExtra.length, 400, 50);	    
	  	ctx.fillText("Puntos: " + scoreTemp, 400, 100);
	  	let misVidas = "";
	  	damage.forEach(function(elem){
	  		misVidas = misVidas + "X";
	  	});	  	
	  	ctx.fillText("Damage: " + misVidas, 400, 150);	    
		
		dibujaIsla();
		dibujaLinea();		
		dibujaCaracter();
		dibujaBombas();		
		dibujaCocos();		
		// dibujaCascaras();		
		controlTiempo();
	}
	function dibujaBombas(){
		// AGREGAR BOMBAS
		if (bombas.length < 3){
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
				}			
				// ctx.strokeStyle="red";
				// ctx.rect(bombas[i].x, bombas[i].y,bomba.width / 10 , bomba.height / 10);
				// ctx.stroke();
				// console.log("colission");				
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
				}			
				// ctx.strokeStyle="red";
				// ctx.rect(cocos[i].x, cocos[i].y,coco.width / 10 , coco.height / 10);
				// ctx.stroke();
				// console.log("colission");				
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
			
			// ctx.strokeStyle="black";
			// ctx.rect(cocos[i].x, cocos[i].y,coco.width / 10 , coco.height / 10);
			// ctx.stroke();
			if (cocos[i].y < 450) cocos[i].y = cocos[i].y * 1.025;		
		}		

		if (puntosExtra.length > 5){
			winner = true;
		}
	}
	// function dibujaCascaras(){
	// 	// AGREGAR cascaras
	// 	if (cascaras.length < 3){
	// 		cascaras.unshift({
	// 			x:(Math.random() * 900) + 60,
	// 			y:Math.random() * 20,
	// 			colision:false,
	// 			id:Math.random()
	// 		});
	// 	}
	// 	// ELIMINAR cascaras QUE YA NO ESTAN EN EL ESCENARIO
	// 	for(let i = 0; i< cascaras.length; i++){
	// 		if (cascaras[i].y > cvs.height){
	// 			cascaras.splice(i, 1);				
	// 		}
	// 	}		
	// 	// CHECAR COLISION		
	// 	// ctx.rect(cascaras[i].x, cascaras[i].y,coco.width / 10 , coco.height / 10);
	// 	// ctx.rect(chX + 25,	chY + 25,	chW - 58,			chH);
	// 	for(let i = 0; i< cascaras.length; i++){
	// 		if (
	// 			cascaras[i].x + (cascara.width / 10) > chX + 25
	// 			&&
	// 			cascaras[i].x < (chX + 25) + (chW - 58)
	// 			&&
	// 			cascaras[i].y - (cascara.height / 10) > chY
	// 			&&
	// 			cascaras[i].y - (cascara.height / 10) < chY + chH
	// 			){								
	// 			cascaras[i].colision = true;
	// 			if (puntosExtra.indexOf(cascaras[i].id) == -1){					
	// 				puntosExtra.push(cascaras[i].id);
	// 			}			
	// 			// ctx.strokeStyle="red";
	// 			// ctx.rect(cascaras[i].x, cascaras[i].y,cascara.width / 10 , cascara.height / 10);
	// 			// ctx.stroke();
	// 			// console.log("colission");				
	// 		}
	// 	}
	// 	// DIBUJAR cascaras
	// 	// if (frames%fps === 0){ cada segundo		
	// 	for(let i = 0; i< cascaras.length; i++){
			
	// 		ctx.drawImage(cascara,
	// 			cascaras[i].x,
	// 			cascaras[i].y,
	// 			cascara.width / 10,
	// 			cascara.height / 10
	// 		);			
			
	// 		// ctx.strokeStyle="black";
	// 		// ctx.rect(cascaras[i].x, cascaras[i].y,cascara.width / 10 , cascara.height / 10);
	// 		// ctx.stroke();
	// 		if (cascaras[i].y < 500) cascaras[i].y = cascaras[i].y * 1.025;		

	// 	}		

	// 	if (puntosExtra.length > 5){
	// 		winner = true;
	// 	}
	// }
	function drawEllipse(centerX, centerY, width, height, piColor) {
		ctx.beginPath();
		ctx.moveTo(centerX, centerY - height/2); // A1
		ctx.bezierCurveTo(
			centerX + width/2, centerY - height/2, // C1
			centerX + width/2, centerY + height/2, // C2
			centerX, centerY + height/2); // A2
		ctx.strokeStyle = piColor;
		ctx.stroke();
		// ctx.fillStyle = "red";
  		// ctx.fill();
  		// ctx.closePath();	
	}
	function redimensionar(){
		// RESIZE
		cvs.width = window.innerWidth - 30;
		cvs.height = window.innerHeight - 30;
		// console.log("Width " + window.innerWidth);
		// console.log("Height " + window.innerHeight);		
		chX = (cvs.width / 2) - 106.5;
		centro = chX;
		chY = cvs.height / 2;
		horizonte = cvs.height / 3;
		cuadritoSize = (cvs.height - horizonte) / 5;				
	}	

	function dibujaLinea(){				

		if ((chX - centro) == 0){
			cualH = 0;
			cualV = 0;
			// //limite izquierdo
			// ctx.beginPath();
			// ctx.moveTo(island.x + 110,550);
			// ctx.lineTo(island.x + 110,50);
			// ctx.stroke();

			// //limite derecho
			// ctx.beginPath();
			// ctx.moveTo(island.width - 990,550);
			// ctx.lineTo(island.width - 990,50);
			// ctx.stroke();

			// ctx.beginPath();
			// ctx.moveTo(cvs.width / 3,cvs.width / 2);
			// ctx.lineTo((cvs.width / 3) * 2,cvs.width / 2);
			// ctx.stroke();
		}else if((chX - centro) > 0){									
			cualH = 1;
			cualV = 0;			
			//limite izquierdo
			// ctx.beginPath();
			// ctx.moveTo(island.x + 100,550);
			// ctx.lineTo(island.x + 100,50);
			// ctx.stroke();

			// //limite derecho
			// ctx.beginPath();
			// ctx.moveTo(island.width - 1020,550);
			// ctx.lineTo(island.width - 1020,50);
			// ctx.stroke();

			if (chX + (chW / 2) > island.width - 1020){
				// hombre al agua
				cualH = 0;
				cualV = 1;
				gravedad = gravedad * 1.01;	
			}
			// peso a la derecha			
			// ctx.beginPath();
			// ctx.moveTo(	cvs.width / 3, 		cvs.width / 2);
			// ctx.lineTo(	(cvs.width / 3) * 2,(cvs.width / 2) + 50);
			// ctx.stroke();
		} else{
			cualH = 1;
			cualV = 1;			

			//limite izquierdo
			// ctx.beginPath();
			// ctx.moveTo(island.x + 130,550);
			// ctx.lineTo(island.x + 130,50);
			// ctx.stroke();
			if (chX < island.x){
				// hombre al agua
				cualH = 0;
				cualV = 1;
				gravedad = gravedad * 1.01;	
			}

			//limite derecho
			// ctx.beginPath();
			// ctx.moveTo(island.width - 975,550);
			// ctx.lineTo(island.width - 975,50);
			// ctx.stroke();
			// peso a la izquierda			
			// ctx.beginPath();
			// ctx.moveTo(	cvs.width / 3, 		(cvs.width / 2) + 50);
			// ctx.lineTo(	(cvs.width / 3) * 2,cvs.width / 2);
			// ctx.stroke();
		}				
		
	}
		
	function startGame() {		
		console.log("startGame");
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

		if ( frames > 15000 || gameOver) { // fps * 10 segundos = 600, se acaba el juego a los 10 segundos
			console.log(damage);
			ctx.font = "120px courier";
  			ctx.strokeStyle = 'red';
  			ctx.lineWidth = 8;  			  			
  			ctx.strokeText("Game Over",cvs.width / 2 - 350,250);
  			ctx.font = "40px Arial";
			stop();
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
		// ctx.strokeStyle="black";
		// ctx.rect(chX + 25,	chY + 25,	chW - 58,			chH);
		// ctx.stroke();
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
	    ctx.font = "100px Arial";
		ctx.fillText(" clic para jugar!!!",cvs.width / 2 - 350,cvs.height / 2 - 40);
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
