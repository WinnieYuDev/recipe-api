// psuedo code
// User enters in ingredient
// Check if user input correctly, filter out number searches AND uppercase turns to lowercase fetch api objects correctly
// Fetch from API recipes by search then use Recipes idMeal to fetch instructions, ingredients, title, and image
// Creates a new recipe section that takes instructions, ingredients, title, and image and appends it to new recipe sections that appear
// Use innerHTML to replace text with fetched text of objects from API
// When there is an error show error loading recipes or failure loading fetch

// main Dom
const button = document.getElementById('search-button');
const userSearch = document.getElementById('user-search');
const recipesContainer = document.getElementById('recipes-container');

// once user enters input and clicks search launch fetch api call
button.addEventListener('click', fetchRecipes);

// fetch from API recipes by search then use Recipes idMeal to fetch instructions, ingredients, title, and image

function fetchRecipes() {
    const input = userSearch.value.trim();

    if (!isNaN(input)) { //have them enter letters only
        alert('Please enter name of ingredient like "beef"');
        return;
    }

    const mainIngredient = input.toLowerCase(); // turns user search lowercase
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(mainIngredient)}`;
    recipesContainer.innerHTML = '<p>Loading recipes...Please Wait</p>';

    fetch(url) // fetch recipes when user input is placed into API url
    .then(res => res.json())
    .then(data => {
    if (!data.meals) {
        recipesContainer.innerHTML = `<p>No recipes found with ingredient: ${mainIngredient}</p>`; //if entered ingredient is not in API e.g pear
        return;
    }

// use innerHTML to replace text with fetched text of objects from API
    recipesContainer.innerHTML = '';
    const meals = data.meals.slice(0, 10); //slice creates new array of 10 meal objects containing 10 different recipes 
    
    meals.forEach(meal => { // for each object in the array, place into API call using its idMeal to look up title, img, instructions, and ingredients of recipe
        const urlDescript = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
        fetch(urlDescript) // using another api call to get recipe details
            .then(res => res.json())
            .then(detailData => {

// creates a new recipe section that takes instructions, ingredients, title, and image and appends it to new recipe sections that appear
// use innerHTML to replace text with fetched text of objects from API

    // had trouble adding 10 fetches from api call and adding it into html. Referenced Google AI overview and StackOverflow for guidance 
    // lesson is to have js add new section with child elements and change innertext
    const recipe = detailData.meals[0]; //gets the first and only meal object from the API response
    const section = document.createElement('section'); //create section
    section.className = 'recipes';
    const title = document.createElement('h3'); //create title
    title.className = 'title'; //give class name for styling
    title.innerText = recipe.strMeal; //change innertext from object text grabbed from api
    section.appendChild(title); // appends fetched title to my section
    const row = document.createElement('div'); //create div for recipe row
    row.className = 'recipe-row';
    const img = document.createElement('img'); //create img
    img.src = recipe.strMealThumb;
    img.alt = recipe.strMeal;
    row.appendChild(img); // appends fetched img to my section
    const ul = document.createElement('ul'); // creates a list for my ingredients to append aka join together
    
    // had trouble putting list into cleaned up text once pulled from ingredient list is pulled from API 
    // cleans up the text to make sure it is in a bullet point list. Referenced from Google AI overview and Learning Mode Claude
    // lesson is to use use loop to go through each object of array and clean up the inner text
    ul.className = 'ingredients'; 
    for (let i = 1; i <= 20; i++) {
    let ingredient = recipe["strIngredient" + i]; // get the ingredient name, like "strIngredient1", "strIngredient2", etc.
    let measure = recipe["strMeasure" + i];   // get the matching measure, like "strMeasure1", "strMeasure2", etc.
    if (ingredient) {   // if there is an ingredient
      if (ingredient.trim() !== "") {   // make sure its not an empty space
        let li = document.createElement("li"); // create a new list bullet point for cleaned up ingredient text
    
        let text = ""; // start with empty string
        if (measure) { // if there is a measure
          text += measure + " "; //add measure to text 
        }
    
        text += ingredient; //add ingredient name to text
    
        li.innerText = text; // change html text to cleaned up text now
        ul.appendChild(li); // add the ingredients into bullet list
      }
    }
    }
    row.appendChild(ul);
    const ol = document.createElement('ol'); //create instructions
    ol.className = 'instructions';
// condition to see if instructions exist in API
    // had trouble putting list into cleaned up text once pulled from instruction list is pulled from API 
    // cleans up the text to make sure it is in a ordered list. Referenced from Google AI overview and StackOverflow
    // lesson is to use use loop to go through each object of array and clean up the inner text        
    if (recipe.strInstructions) { 
    const instructions = recipe.strInstructions // get the instruction text from API
        .split('\n') // split whole list that was fetched into new lines                      
        .map(line => line.trim()) // remove extra place from list with map and trim functions
        .filter(line => line.length > 0); // remove empty lines with filter ()
    
        for (let i = 0; i < instructions.length; i++) {  // loop through each instruction using a for loop
        const li = document.createElement('li');   // create a new li element
        li.innerText = instructions[i].replace(/^\d+\.\s*/, '');  // remove numbering like "1. " from the start
        ol.appendChild(li);  // add the li to the  element
    }
    }
    row.appendChild(ol); // adds the ordered list to the row element
    section.appendChild(row); // adds the row to the section
    recipesContainer.appendChild(section); // adds the section to the main container
    })

// When there is an error show error loading recipes or failure loading fetch
    .catch(err => { // if there is an error
        console.log(`Error fetching recipe details: ${err}`); // show in console log
        alert('Failed to load recipe details. Try again.'); // alert user
    });
});
})

// When there is an error show error loading recipes or failure loading fetch
    .catch(err => { // if there is an error
        console.log(`Error fetching recipes: ${err}`); // show in console log
        recipesContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>'; // alert user
    });
}

// Citations:
// Referenced from Stack Overflow - https://stackoverflow.com/questions/1115310/how-can-i-add-a-class-to-a-dom-element-in-javascript and https://stackoverflow.com/questions/7695997/split-the-sentences-by-and-remove-surrounding-spaces
// Referenced from Tutorial how to fetch from API - https://www.youtube.com/watch?v=b5rjEW-_6po
// Referenced Google AI Overview, Stackflow, and Learning Mode of Claude (does not write answer for you) guidance for code syntax and debug