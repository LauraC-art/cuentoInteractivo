//finales definidos dentro del Js
var finales = {
	reset:["Has fracasado","Has descubierto el final terciario de la historia","Has descubierto el final secundario de la historia","Has descubierto el mejor final posible"],
}
//Vidas desde la carpeta IMG_NEW
var vida={
	stat:['IMG_NEW/Vidas/full.png','IMG_NEW/Vidas/bar2.png','IMG_NEW/Vidas/bar1.png','IMG_NEW/Vidas/dead.png']
}
//Monitor desde IMG_NEW
var indagacion={
	monitor:['IMG_NEW/monitor/mon_1.png','IMG_NEW/monitor/mon_2.png','IMG_NEW/monitor/mon_3.png']
}
//
var game_data = {
	"historia":[
		[
		   {
			  
		   }
		]
	 ],
	 "portada":{
	 }
}

//Vue components

//________
var app = new Vue({
  el: '#app',
  data: {
	secret:'',
	game_data: game_data,
	pilSect:0,
	pg:0,
	//temp
	vida,	
	final:finales,
	indagacion:indagacion,
	//
	nVidas:3,//número de intentos que tiene, podría ser desde la base de datos con el # de vidas
	intentos:9,
	alOrDe:"REINTENTAR",
	resetBtn:"",
	estado:0,
	tries: 1,
  	idx: 1,
	section:'base',
	counterf:1,
	yes:true,
	//
	on:true,
	interval:null,
	unableI:false,
	unableD:false,
	//loading
	loading:true
  },
  beforeCreate(){
	const request = new Request('set.php');

	fetch(request)
	  .then(response => {
		if (response.status === 200) {
		  return response.json();
		} else {
		  throw new Error('Something went wrong on api server!');
		}
	  })
	  .then(response => {
	
		app.game_data = response;
	
	  }).catch(error => {
		console.error(error);
	  });
  },
  updated(){
	this.loading=false;
  },
  computed: {
	  //
	estilo:function(){
		if(this.section=='base'){
			return this.game_data.historia[this.pilSect][this.pg].pos_personaje;
		} else if (this.section=='final') {
			return this.game_data.finales[this.counterf][this.pg].pos_personaje;
		}
	},
	  //
    backs: function () {
      	if(this.section=='final'){
			return 'background-image:url("'+this.game_data.finales[this.counterf][this.pg].imagen_fondo+'")';
		} else if(this.section=='reset'){
			//falta pantalla de reset en DB
			return 'background-image:url("'+this.game_data.finales[this.counterf][0].imagen_fondo+'")';
		} else if(this.section=='resolver'){
			return 'background-image:url("'+this.game_data.pilares[this.pilSect].fondo_acertijo+'")';
		} else if(this.section=='acertijo'){
			return 'background-image:url("'+this.game_data.pilares[this.pilSect].torre+'")';
		} else if(this.section=='reintentar'){
			if(this.yes==false){
				return 'background-image:url("'+this.game_data.pilares[this.pilSect].fondo_acertijo+'")';
			} else {
				return 'background-image:url("'+this.game_data.post_resol[this.pilSect][this.tries].imagen_fondo+'")';
			}
		}
		else {			
			  return 'background-image:url("'+this.game_data.historia[this.pilSect][this.pg].imagen_fondo+'")';
		}
	},
	//imágenes acertijo
	imagenes: function (){
		if (this.section=='indagar'){
			return this.game_data.indagacion[this.pilSect][this.idx].imagen_fondo;
		}
		return 'background-image:url("'+this.game_data.pilares[this.pilSect].imagen_acertijo+'")';
	},
	//Imagen monitor
	monitor:function (){
		return this.indagacion.monitor[this.pilSect];
	},
	//Personaje
	personaje:function (){
		if (this.section=="base"){
			return this.game_data.historia[this.pilSect][this.pg].imagen_personaje;
		} else if (this.section=="final"){
			return this.game_data.finales[this.counterf][this.pg].imagen_personaje;
		}

	},
	//Pantalla redirección a index
	reset:function (){
		//return this.game_data.finales[this.counterf][0].texto; algo así pero con reset :V
	},
	//Texto final
	finalT:function (){
		return this.game_data.finales[this.counterf][this.pg].texto;
	},
	pass: function(){
		var secreto=this.secret.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		return secreto.toLowerCase();
	},
	total: function(){
		return Object.keys(this.game_data.pilares).length;
	},
	paginas: function(){
		if(this.section=='final'){
			return Object.keys(this.game_data.finales[this.counterf]).length;
		} else {
		return Object.keys(this.game_data.historia[this.pilSect]).length;
		}
	},
  },
  methods: {
	  //
	  von:function(){
		this.on=false;
		this.interval = setInterval(() => this.on=true, 1000);
	  },
	  //siguiente página
    activar: function (seccion, s) {
	  this.section = seccion;
	  if(this.pg!=this.paginas){
		this.pg+=s;
	  }
	  if (this.section=='base'){
		this.try=0;		
		if (this.pg==this.paginas){			
			this.section='acertijo';
		}
	}
	if (this.section=='final'){
		if (this.pg==this.paginas){			
			this.section='reset';
		}
	}
	},
	//Página Torres
    activarPilar: function (seccion) {
      this.section = seccion;
	},
	//Resolver acertijo
	resolver: function (){
		var validos=this.game_data.pilares[this.pilSect].solucion;
		this.pg=0;
		if(this.pass==validos){
			this.estado=0;
			this.yes=true;
			if(this.pilSect==this.total){
				this.again();
			} else{
				this.section='reintentar';
				this.alOrDe="¡ENHORABUENA!";
			}
		}
		//si se equivoca
		else if(this.pass!=validos){
			this.estado++;
			if(this.estado==3){
				this.counterf=0;
				this.pg==0
				this.section='final';	
				this.resetBtn="INTENTAR DESDE EL PRINCIPIO";
			}else{
				this.section='reintentar';
				this.alOrDe="REINTENTAR";
				this.intentos--;
				this.try++;
				this.yes=false;
			}
		}
		this.secret='';
	},
	nextImg: function (){
		if(this.idx<=2&&this.idx>=0){
			this.unableD=false;
			this.unableI=false;
		}
		this.idx += 1;
		if (this.idx  > 2){
			this.idx  = 2;
			this.unableD=true;
		}
	},
	prevImg: function (){
		if(this.idx<=2&&this.idx>=0){
			this.unableD=false;
			this.unableI=false;
		}
		this.idx -= 1;
		if (this.idx < 0){
			this.idx = 0;
			this.unableI=true;
		}
	},
	back: function (){
		this.section = 'acertijo';
		this.idx=1;
		this.unableD=false;
		this.unableI=false;
	},
	again: function (){
		this.section = 'acertijo';
		if(this.estado==0){//ganó, pasa al sig pilar
			
			this.pilSect++;
			this.section='base';//pagina 1 del siguiente pilar
			this.pg=0;
			s=0;
			this.idx=1;
			this.estado=0;
		}
		//Condiciones de los finales
		if(this.pilSect==this.total){
			//Final pro
			if(this.intentos>=Math.round(this.total*3)){
				this.counterf=3;
			}
			//Regular-Pro
			else if (this.intentos<Math.round(this.total*3) && this.intentos>=Math.round(this.total*3*0.7)){
				this.counterf=2;
			} 
			//Regular-malo
			else if (this.intentos<Math.round(this.total*3*0.7)){
				this.counterf=1;
			}
			this.resetBtn="JUGAR DE NUEVO Y DESCUBRIR MÁS";
			this.activar('final',0);
		}
	}
  }
});