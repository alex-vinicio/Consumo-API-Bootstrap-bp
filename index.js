const apiURL = "https://bp-marvel-api.herokuapp.com/marvel-characters";

window.addEventListener("DOMContentLoaded", function (event) {
  var busquedaInput = document.querySelector("#autoSizingInputGroup");
  //change -> active in key space down
  busquedaInput.addEventListener("input", function (event) {
    busquedaSegunInput(event.target.value);
  });
  setTodoList();
});

async function busquedaSegunInput(valorInput) {
  var jsonList = [];
  var divContainer = document.getElementById("container-group");
  jsonList = await busquedaPersonaje(valorInput, 1);

  reloadList(divContainer, jsonList);
}
async function busquedaPersonaje(valueFind, tipoBusqueda) {
  var response = await getForIdAuthor(1).then((response) => {
    return response.data;
  });

  //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  var jsonList = [];
  response.forEach((element) => {
    if (tipoBusqueda == 1) {
      if (element.title.toLowerCase().includes(valueFind.toLowerCase())) {
        jsonList.push(element);
      }
    } else if (tipoBusqueda == 2) {
      if (element._id.toUpperCase().includes(valueFind.toUpperCase())) {
        jsonList.push(element);
      }
    }
  });
  return jsonList;
}
//seccion de limpiar y listar nuevamente los personajes
function reloadList(divContainer, jsonList) {
  divContainer.innerHTML = "";
  jsonList.forEach((element) => {
    var generateContent = "";
    generateContent = `
                <div class="row m-1">
                <div class="card mb-3"
                    style="max-height: auto; max-width: auto; background-color: rgb(29, 28, 28);">
                    <div class="row g-0">
                        <div class="col-3 p-1 align-self-center">
                            <div class="border border-2 rounded-1 border-danger">
                                <img src="${element.image}"
                                    class="img-fluid rounded-start" >
                            </div>
                        </div>
                        <div class="col-7">
                            <div class="card-body">
                                <h5 class="text-white">${element.title}</h5>
                                <p class="text-white">${element.body}</p>
                            </div>
                        </div>
                        <div class="col-2 align-self-center">
                            <button class=" btn btn-light m-1" type="submit" onclick=editar('${element._id}') ><i style="color:#842029;"
                                    class="bi bi-pen-fill"></i></button>
                            <br>
                            <button class=" btn btn-light m-1" type="submit" onclick=eliminar('${element._id}')><i style="color:#842029;"
                                    class="bi bi-trash-fill"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
          `;

    divContainer.innerHTML = divContainer.innerHTML + generateContent;
  });
}
const setTodoList = async () => {
  var jsonList = await getForIdAuthor(1).then((response) => {
    return response.data;
  });
  //get values in promise

  var divContainer = document.getElementById("container-group");
  reloadList(divContainer, jsonList);
};

//seccion fin de limpiar y listar nuevamente los personajes
//seccion para editar un personaje
async function editar(idValuem) {
  mostrarContainer();
  var idHidden = document.querySelector("#id");
  var namePerson = document.querySelector("#name");
  var descriptionPerson = document.querySelector("#description");
  var imagePerson = document.querySelector("#image");

  var jsonList = await busquedaPersonaje(idValuem, 2);
  //asign value in form inputs
  idHidden.value = jsonList[0]._id;
  namePerson.value = jsonList[0].title;
  descriptionPerson.value = jsonList[0].body;
  imagePerson.value = jsonList[0].image;
}
//seccion fin para editar un personaje

function getForIdAuthor(id) {
  return axios.get(apiURL + "/", {
    params: {
      idAuthor: id,
    },
  });
}
//seccion eleiminar
async function eliminar(id) {
  var response = await eliminarPorId(id, 1).then((response) => {
    return response;
  });
  asignAlertMessage(response);
  setTodoList();
}
function asignAlertMessage(response) {
  if (response.status == 200) {
    generateAlert(response.data.message, "success");
  } else {
    generateAlert(response.data.message, "danger");
  }
}
function eliminarPorId(id, idAuthor) {
  return axios.delete(apiURL + `/${id}`, {
    params: {
      idAuthor: idAuthor,
    },
  });
}
//fin seccion eliminar
//seccion nuevo personaje
function newPerson(name, description, image, idAuthor) {
  return axios.post(apiURL + `?idAuthor=${idAuthor}`, {
    title: name,
    body: description,
    image: image,
    idAuthor: idAuthor.toString(),
    category: "main",
    createdAt: new Date(),
  });
}
function editarPorId(id, name, description, image, idAuthor) {
  return axios.put(apiURL + `/${id}?idAuthor=${idAuthor}`, {
    title: name,
    body: description,
    image: image,
    idAuthor: idAuthor,
    category: "main",
    updatedAt: new Date(),
  });
}

//seccion fin nuevo personaje
//seccion botones envio y cancelado
async function guardarSubmit(event) {
  event.preventDefault();
  var booleanValidation = false;
  var response = null;
  var idHidden = document.querySelector("#id");
  var form = document.querySelector("#formsSubmit");
  var namePerson = document.querySelector("#name");
  var descriptionPerson = document.querySelector("#description");
  var imagePerson = document.querySelector("#image");

  booleanValidation = validateForm(namePerson, descriptionPerson, imagePerson);
  if (booleanValidation) {
    if (idHidden.value == "") {
      response = await newPerson(
        namePerson.value,
        descriptionPerson.value,
        imagePerson.value,
        1
      ).then((response) => {
        return response;
      });
      asignAlertMessage(response);
    } else {
      response = await editarPorId(
        idHidden.value,
        namePerson.value,
        descriptionPerson.value,
        imagePerson.value,
        1
      ).then((response) => {
        return response;
      });
      idHidden.value = "";
      asignAlertMessage(response);
    }
    resetForm(form, namePerson, descriptionPerson, imagePerson);
  }

  setTodoList();
}
async function cancelarSubmit(e) {
  e.preventDefault();
  var form = document.querySelector("#formsSubmit");
  var namePerson = document.querySelector("#name");
  var descriptionPerson = document.querySelector("#description");
  var imagePerson = document.querySelector("#image");

  resetForm(form, namePerson, descriptionPerson, imagePerson);

  var divFormContainer = document.querySelector("#formContain");
  divFormContainer.classList.add("d-none");
}
//seccion fin de botones envio y cancelado
//seccion validacion y reset de form
function resetForm(form, inputName, inputDescription, inputImage) {
  form.reset();
  inputName.classList.remove("is-valid");
  inputDescription.classList.remove("is-valid");
  inputImage.classList.remove("is-valid");

  inputName.classList.remove("is-invalid");
  inputDescription.classList.remove("is-invalid");
  inputImage.classList.remove("is-invalid");
}
function validateForm(namePerson, descriptionPerson, imagePerson) {
  if (namePerson.value == "") {
    namePerson.classList.add("is-invalid");
    return false;
  } else {
    namePerson.classList.remove("is-invalid");
    namePerson.classList.add("is-valid");
  }

  if (descriptionPerson.value == "") {
    descriptionPerson.classList.add("is-invalid");
    return false;
  } else {
    descriptionPerson.classList.remove("is-invalid");
    descriptionPerson.classList.add("is-valid");
  }

  if (imagePerson.value == "") {
    imagePerson.classList.add("is-invalid");
    return false;
  } else {
    imagePerson.classList.remove("is-invalid");
    imagePerson.classList.add("is-valid");
  }

  return true;
}

async function mostrarContainer() {
  var divFormContainer = document.querySelector("#formContain");
  divFormContainer.classList.remove("d-none");
}
//fin seccion validacion
function generateAlert(message, type) {
  var AlertDivContainer = document.querySelector("#alertSections");
  AlertDivContainer.innerHTML = "";
  var divAlert = `
              <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <strong>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              `;
  AlertDivContainer.innerHTML += divAlert;
}
