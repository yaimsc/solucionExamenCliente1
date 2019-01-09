//var arrLibros = new Array();
var arrLibros = {};

window.onload = function() {
    // image is loaded at this time
	document.getElementById("nuevo").addEventListener("submit", function(event) {
		event.preventDefault();
	});
	document.getElementById("consulta").addEventListener("submit", function(event) {
		event.preventDefault();
	});

	document.getElementById("anadir").addEventListener("click", function() {

		var titulo = document.forms["nuevo"]["titulo"];
		var autor = document.forms["nuevo"]["autor"];
		var isbn = document.forms["nuevo"]["isbn"];
		var generos = document.getElementById("checkboxes"); // div contenedor de checkboxes
		var checkboxes = document.getElementsByName("generos"); // checkbox

		if (validarFormulario()) {
			var generos = {policiaca:false, historica:false, cifi:false, fantastico:false, romantica:false};

			for (var i=0; i<checkboxes.length; i++) {
				if (checkboxes[i].type === "checkbox" && checkboxes[i].checked === true) {
					generos[checkboxes[i].value] = true;
					checkboxes[i].checked = false;
				}
			}
			reiniciarEstatus();

			var libro = {titulo:titulo.value, autor:autor.value, isbn:isbn.value, generos:generos, prestado:false, estatus:"creado"};
			//arrLibros.push( libro );
			arrLibros[titulo.value] = libro;
			
			titulo.value = autor.value = isbn.value = "";
			recargarListas();
		}


	});

	document.getElementById("prestar").addEventListener("click", function() { prestarDevolver("prestar") });
	document.getElementById("devolver").addEventListener("click", function() { prestarDevolver("devolver") });
};

function prestarDevolver(accion) {
	var titulo = document.forms["consulta"]["titulo"];
	var autor = document.forms["consulta"]["autor"];
	var isbn = document.forms["consulta"]["isbn"];
	var generos = document.getElementById("generos");

	if (validarMail()) {
		reiniciarEstatus();

		var libro = arrLibros[titulo.value];

		if (accion == "prestar") {
			libro.prestado = true;
			libro.estatus = "prestado";
		}
		else {
			libro.prestado = false;
			libro.estatus = "devuelto";
		}

		titulo.value = autor.value = isbn.value = generos.innerHTML = "";
		recargarListas();
	}
}

function reiniciarEstatus(estatus) {
	for (var key in arrLibros) {
		if (estatus = arrLibros[key].estatus || estatus == "")
			arrLibros[key].estatus = "";
	}
}

function recargarListas() {
	var ordenado = [];
	for(var key in arrLibros) {
	    ordenado[ordenado.length] = key;
	}
	ordenado.sort();

	var disponibles = document.getElementById("lista-dispo");
	var prestados = document.getElementById("lista-prest");

	disponibles.innerHTML = "";
	prestados.innerHTML = "";

	for (var i=0; i<ordenado.length; i++ ) {
		var lib = ordenado[i];

		var entrada = document.createElement("p");
		entrada.innerHTML = arrLibros[lib].titulo;

		if (arrLibros[lib].estatus) {
			entrada.classList.add(arrLibros[lib].estatus);
		}

		entrada.addEventListener("click", function(e) { listenerLista(e.target) });
		if (!arrLibros[lib].prestado)
			disponibles.appendChild(entrada);
		else
			prestados.appendChild(entrada);
	}
}

function listenerLista(p) {
	var anteriorSeleccionado = document.getElementsByClassName("seleccionado")[0];
	if (anteriorSeleccionado) {
		anteriorSeleccionado.classList.remove("seleccionado");
	}
	p.classList.add("seleccionado");

	var libro = arrLibros[p.innerHTML];

	document.forms["consulta"]["titulo"].value = libro.titulo;
	document.forms["consulta"]["autor"].value = libro.autor;
	document.forms["consulta"]["isbn"].value = libro.isbn;
	document.getElementById("generos").innerHTML = "";

	for(var key in libro.generos) {
	  if (libro.generos[key])
	  	document.getElementById("generos").innerHTML += key + " ";
	}
}

function validarFormulario() {
	var titulo = document.forms["nuevo"]["titulo"];
	var autor = document.forms["nuevo"]["autor"];
	var isbn = document.forms["nuevo"]["isbn"];
	var generos = document.getElementById("checkboxes"); // div contenedor de checkboxes
	var checkboxes = document.getElementsByName("generos"); // checkbox

	var validado = true;

	if (titulo.value == "") {
		titulo.classList.add("errorForm");
		validado = false;
	}
	else {
		titulo.classList.remove("errorForm");
	}

	if (autor.value == "") {
		autor.classList.add("errorForm");
		validado = false;
	}
	else {
		autor.classList.remove("errorForm");
	}

	if (isbn.value != "" && isNaN(parseInt(isbn.value)) ) {
		isbn.classList.add("errorForm");
		validado = false;
	}
	else {
		isbn.classList.remove("errorForm");
	}

	var count = 0;
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].type === "checkbox" && checkboxes[i].checked === true) {
		  count++;
		}
	}
	if (count<1) {
		generos.classList.add("errorForm");
		validado = false;
		//alert("Selecciona al menos un género");
	}
	else {
		generos.classList.remove("errorForm");
	}

	return validado;
};

function validarMail() {
	return true;
}
