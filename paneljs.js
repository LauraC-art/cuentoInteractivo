var panel_data = {
	"historia":[
		[
		   {
			  
		   }
		]
   ]
}
var gallery = {
  "images":[

  ]
}
//

//
var app = new Vue({
    el: '#panelApp',
    data: {
      panel_data: panel_data,
      unique:false,
      section:'historia',
      //galería
      gallery:gallery,
      image:'',
      popUp: false,
      selected:0,
      //success modal :v
      success:false
    },
    computed:{
      tipo:function(){
        return this.panel_data.tipo;
      },
      preview:function(){
        if(this.section=='pilares'){
          return this.panel_data.current_selection.torre;
        } else if(this.section=='resolucion'){
          return this.panel_data.current_selection.fondo_acertijo;
        } else {
          return this.panel_data.current_selection.imagen_fondo;
        }
      }
    },
    methods: {      
      uploadFiles(event) {
        console.log(event.target.files);
        fetch('upload.php', {
          method: 'POST',
          body:{
            file: event.target.files,
            tipo:this.tipo
          }
        })
        
        .then(result => {
          console.log('Success:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      },
      seccion:function(actSeccion){        
        this.section=actSeccion;
      },
      activar: function (item){
        this.panel_data.current_selection = item;
        this.selected=item.imagen_id;
      },
      newImg:function(item){
        this.panel_data.current_selection.imagen_fondo = item.Imag_link;
        if(this.section=='pilares'){
          this.panel_data.current_selection.torre = item.Imag_link;
        }
      },
      //envía los datos a chancla.php
      save: function (item){
        success=true;
        var Id_pestana, num_pilar;
        if(this.section=='portada'){
          Id_pestana = item.id_portada; 
        } else if(this.section=='pilares'){
          Id_pestana = item.num_pilar;
        } else {
          Id_pestana = item.id_pestana;
        }
        if(this.selected==item.imagen_id || this.selected==0){
          this.selected=item.imagen_id;
        }        
        if (this.section=='pilares'||this.section=='resolucion'){
          fetch('savechanges.php', {
            method: 'POST',
            body: JSON.stringify({
              num_pilar:item.num_pilar,
              texto: item.texto,
              imagen_id: this.selected,
              tipo: this.tipo
            })
        });
        } else {
          fetch('savechanges.php', {
            method: 'POST',
            body: JSON.stringify({
              Id_pestana,
              texto: item.texto,
              imagen_id: this.selected,
              tipo: this.tipo
            })
        });
        }
      },
    }
});


const request = new Request('set.php');
const imgs = new Request('setCimages.php');
//data del cuento
fetch(request)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {

  app.panel_data = response;


  }).catch(error => {
    console.error(error);
  });

  //Image gallery
  fetch(imgs)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {

  app.gallery = response;

  }).catch(error => {
    console.error(error);
  });