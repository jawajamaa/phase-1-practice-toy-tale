// Global variables
let addToy = false;
const toyCollectionDiv = document.getElementById("toy-collection");
const addToyForm = document.getElementsByClassName("add-toy-form");
const toyInputName = document.querySelector('.input-text[name="name"]');
const inputToyURL = document.querySelector('.input-text[name="image"]');
const defaultNewToy = {
  "name": "Jessie",
  "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
  "likes": 0
}

// Event Listeners
// ////////////////////////////////////////////////////////////////////////


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


    addToyForm[0].addEventListener("submit", (event) => {
      console.log("submit");
      event.preventDefault();
        const newToy = {
          "name" : toyInputName.value,
          "image" : inputToyURL.value,
          "likes" : 0
        }
      if (toyInputName.value === "" || inputToyURL.value === "") {
      addNewToy(defaultNewToy);
      } else {
        addNewToy(newToy); 
      }
    })


  getAllToys();

async function updateLikes(toy) {
  console.log(toy.id);
  console.log(toy.likes);
  let newNumberOfLikes = toy.likes + 1;
  try {
    const response = await fetch(`http://localhost:3000/toys/${toy.id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
      "likes" : newNumberOfLikes
      })
    });

    const result = await response.json();
    console.log("Success", result);
    toyCollectionDiv.innerHTML =" ";
    getAllToys();
  } catch (error) {
    console.error("Error:", error);
  }
}


// Render Functions
// /////////////////////////////////////////////////////////////////////


function getAllToys() {
fetch("http://localhost:3000/toys")
.then(response => response.json())
.then(toys => {
  console.log(toys);
    toys.forEach(toy => {
    renderToyCard(toy);
    })
  }
)}

async function addNewToy(newToy) {
  try {
    const response = await fetch("http://localhost:3000/toys",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    });

    const result = await response.json();
    console.log("Success", result);
    renderToyCard(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderToyCard(toy) {
  // console.log(toy);
  let toyName = document.createElement("h2");
  toyName.textContent = toy.name;
  let imgTag = document.createElement("img");
  imgTag.src = toy.image;
  imgTag.setAttribute("class", "toy-avatar");
  let likesP = document.createElement("p");
  likesP.textContent = toy.likes
  let likeBtn = document.createElement("button");
  likeBtn.setAttribute("id", `${toy.id}`); 
  likeBtn.setAttribute("class", "like-btn");
  likeBtn.textContent = "Likes ❤️";
  likeBtn.addEventListener("click", () => updateLikes(toy));
  const toyCardDiv = document.createElement("div");
  toyCardDiv.setAttribute("class", "card");
  let toyCard = document.createElement("div");
  toyCard.append(toyName, imgTag, likesP, likeBtn);
  toyCardDiv.append(toyCard);
  toyCollectionDiv.append(toyCardDiv);

}

});