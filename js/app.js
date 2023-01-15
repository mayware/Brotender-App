// Navbar links drops
(function ($) {
    $(function () {
        $('.nav-link').click(function (e) {
            $(this).children(':last-child').toggleClass('show');
            $('.header-dropdown-content').not($(this).children(':last-child')).removeClass('show');
            e.stopPropagation();
        });
        $('html').click(function () {
            $('.header-dropdown-content').removeClass('show');
        });
    });
})(jQuery);

//----------//////////----------//////////----------//////////----------//////////----------//////////
// Sidebar toggler
function sideToggler() {
    document.querySelector('[data-sidebar]').classList.toggle('open');
    document.getElementById('content').classList.toggle('open');
}







//----------//////////----------//////////----------//////////----------//////////----------//////////
// Get ingredients
function dataFetcher(volume) {
    document.getElementById('helpMsg').style.display = 'none';
    const url = 'https://brotender.lyteloli.space/api/Ingredients';
    fetch(url).then(res => res.json()).then(data => dataGetter(data, volume));
}

function dataGetter(drinks, vol) {
    if (vol === 1) {
        document.getElementById('alcBtn').classList.add('active');
        document.getElementById('nonAlcBtn').classList.remove('active');
        document.getElementById('alcBtn').setAttribute('disabled', 'true');
        document.getElementById('nonAlcBtn').removeAttribute('disabled');
        document.getElementById('alcdrinkList').style.display = 'block';
        document.getElementById('nonAlcDrinkList').style.display = 'none';
        const alcs = drinks.filter(function (item) {
            return item.isAlcohol == 1;
        });
        for (let i = 0; i < alcs.length; i++) {
            const alcBlock = document.getElementById('alcholoBlock');
            const drinkList = document.getElementById('alcdrinkList');
            const drinkItem = document.createElement('li');
            const drinkLink = document.createElement('a');
            const drinkId = document.createElement('span');
            drinkId.classList.add('cart-drink-id');
            const addBtn = document.createElement('button');
            drinkItem.classList.add('drink-item');
            drinkLink.classList.add('drink');
            drinkLink.innerText = alcs[i].name;
            drinkId.innerText = alcs[i].id;
            addBtn.classList.add('add-drink-btn');
            addBtn.setAttribute('onclick', 'addDrink(this)');
            if (drinkList.children[i]) {
                alcBlock.style.display = 'block';
            } else {
                drinkItem.append(drinkLink, drinkId, addBtn);
                drinkList.append(drinkItem);
                alcBlock.append(drinkList);
                alcBlock.style.display = 'block';
            }
        }
    } else {
        document.getElementById('nonAlcBtn').classList.add('active');
        document.getElementById('alcBtn').classList.remove('active');
        document.getElementById('nonAlcBtn').setAttribute('disabled', 'true');
        document.getElementById('alcBtn').removeAttribute('disabled');
        document.getElementById('nonAlcDrinkList').style.display = 'block';
        document.getElementById('alcdrinkList').style.display = 'none';
        const non = drinks.filter(function (item) { return item.isAlcohol == 0; });
        for (let i = 0; i < non.length; i++) {
            const nonAlcBlock = document.getElementById('nonAlcBlock');
            const drinkList = document.getElementById('nonAlcDrinkList');
            const drinkItem = document.createElement('li');
            const drinkLink = document.createElement('a');
            const drinkId = document.createElement('span');
            drinkId.classList.add('cart-drink-id');
            const addBtn = document.createElement('button');
            drinkItem.classList.add('drink-item');
            drinkLink.classList.add('drink');
            drinkLink.innerText = non[i].name;
            drinkId.innerText = non[i].id;
            addBtn.classList.add('add-drink-btn');
            addBtn.setAttribute('onclick', 'addDrink(this)');
            if (drinkList.children[i]) {
                nonAlcBlock.style.display = 'block';
            } else {
                drinkItem.append(drinkLink, drinkId, addBtn);
                drinkList.append(drinkItem);
                nonAlcBlock.append(drinkList);
                nonAlcBlock.style.display = 'block';
            }
        }
    }
}


async function searchIngredients(e, elem) {
    const res = await fetch('https://brotender.lyteloli.space/api/Ingredients')
    let jsonData = await res.json();
    let inputValue = elem.previousElementSibling.value;

    var ingArr = [];
    for (let i = 0; i < jsonData.length; i++) {
        ingArr.push(jsonData[i].name);
    }
    // console.log(ingArr);

    // let newArr = ingArr.filter((element) => {
    //     return element === inputValue;
    // })
    // console.log(newArr);

    let matched = ingArr.find(element => {
        if (element.includes(inputValue)) {
            return element;
        }
    });

    console.log(matched);;

}






//----------//////////----------//////////----------//////////----------//////////----------//////////
// Add ingredient
function addDrink(element) {
    let cartList = document.getElementById('cartList');
    document.getElementById('cartIcon').style.display = 'none';
    if (!element.classList.contains('active')) {
        element.classList.toggle("active");
        let item = document.createElement('li');
        let trash = document.createElement('button');
        trash.classList.add('remove-btn');
        trash.id = 'removeBtn';
        trash.setAttribute("onclick", "removeDrink(this)");
        item.classList.add('incart-item');
        item.id = "cartItem";
        let drink = document.createElement('a');
        let drinkId = document.createElement('span');
        drinkId.classList.add('in-cart-drink-id');
        drink.classList.add('incart-drink');
        drinkId.innerText = element.previousElementSibling.innerHTML;
        drink.append(element.previousElementSibling.previousElementSibling.innerHTML);
        item.append(drink, drinkId, trash);
        cartList.append(item);
    }
}

//----------//////////----------//////////----------//////////----------//////////----------//////////
// Remove ingredient
function removeDrink(element) {
    let drinks = document.getElementsByClassName('drink');
    for (let i = 0; i < drinks.length; i++) {
        if (drinks[i].innerHTML == element.parentElement.innerText)
            drinks[i].nextElementSibling.nextElementSibling.classList.remove('active');
    }
    element.parentElement.remove();
    let cart = document.getAnimations('cartList');
    let item = document.getElementById('cartItem');
    if (!item) {
        document.getElementById('cartIcon').style.display = 'flex';
    }
}



let cocktails = document.getElementById('cocktailResults');
function drinkMaker() {
    cocktails.innerHTML = '';
    let resultsHeader = document.querySelector('.results-header');
    var cartList = document.getElementById('cartList');
    resultsHeader.innerHTML = "With your ingredients you can make the following cocktail(s)";
    var cartDrinks = [];
    for (let k = 0; k < cartList.children.length; k++)
        cartDrinks[k] = cartList.children[k].firstChild.nextSibling.innerHTML; // ID's
    var cartDrinks = cartDrinks.map(Number);
    cartDrinks = JSON.stringify(cartDrinks);

    fetch('https://brotender.lyteloli.space/api/FindDrinkByIngredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: cartDrinks,
    })
        .then((res) => res.json())
        .then((data) => {
            cocktailGetter(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function cocktailGetter(drinks) {
    let msg = 'Nothing';
    for (let i = 0; i < drinks.length; i++) {
        let cocktailResult = document.createElement('div');
        let imgResTools = document.createElement('div');
        let cocktailImg = document.createElement('div');
        let img = document.createElement('img');
        let nameRecipe = document.createElement('div');
        let cocktailName = document.createElement('div');
        let cocktailRecipe = document.createElement('div');
        let cocktailTool = document.createElement('div');
        let btnDesc = document.createElement('div');
        // let descBtn = document.createElement('button');
        // let description = document.createElement('div');

        cocktailResult.classList.add('cocktails');
        imgResTools.classList.add('img-res-tools');
        cocktailImg.classList.add('cocktail-img');
        nameRecipe.classList.add('name-res');
        cocktailTool.classList.add('cocktail-tools');
        cocktailName.classList.add('cocktail-name');
        cocktailRecipe.classList.add('cocktail-recipe');
        // btnDesc.classList.add('btn-desc');
        // descBtn.classList.add('desc-btn')
        img.classList.add('image');
        // description.classList.add('cocktail-desc');
        img.src = drinks[i].imageUrl;
        cocktailImg.append(img);
        nameRecipe.append(cocktailName, cocktailRecipe);
        cocktailName.innerHTML = drinks[i].name;
        cocktailRecipe.innerHTML = drinks[i].preparation;
        // descBtn.innerHTML = 'Description';
        // btnDesc.append(descBtn, description);
        cocktailImg.append(btnDesc);
        imgResTools.append(cocktailImg, nameRecipe);
        cocktailResult.append(imgResTools);
        cocktails.append(cocktailResult);
    }
}





// console.log(cartDrinks);


        // let cocktails = document.getElementById('cocktailResults');
        // let cocktailResult = document.createElement('div');
        // let imgResTools = document.createElement('div');
        // let cocktailImg = document.createElement('div');
        // let img = document.createElement('img');
        // let nameRecipe = document.createElement('div');
        // let cocktailName = document.createElement('div');
        // let cocktailRecipe = document.createElement('div');
        // let cocktailTool = document.createElement('div');
        // let btnDesc = document.createElement('div');
        // let descBtn = document.createElement('button');
        // let description = document.createElement('div');

        // cocktailResult.classList.add('cocktails');
        // imgResTools.classList.add('img-res-tools');
        // cocktailImg.classList.add('cocktail-img');
        // nameRecipe.classList.add('name-res');
        // cocktailTool.classList.add('cocktail-tools');
        // cocktailName.classList.add('cocktail-name');
        // cocktailRecipe.classList.add('cocktail-recipe');
        // btnDesc.classList.add('btn-desc');
        // descBtn.classList.add('desc-btn')
        // img.classList.add('image');
        // description.classList.add('cocktail-desc');
        // img.src = drinks[i].imageUrl;
        // cocktailImg.append(img);
        // nameRecipe.append(cocktailName, cocktailRecipe);
        // cocktailName.innerHTML = drinks[i].name;
        // cocktailRecipe.innerHTML = drinks[i].preparation;
        // descBtn.innerHTML = 'Description';
        // btnDesc.append(descBtn, description);
        // cocktailImg.append(btnDesc);
        // imgResTools.append(cocktailImg, nameRecipe);
        // cocktailResult.append(imgResTools);
        // cocktails.append(cocktailResult);




//----------//////////----------//////////----------//////////----------//////////----------//////////

// // topnav page setter function
// function pageSetter(id) {
//     document.querySelector('[data-sidebar]').classList.add('open');
//     let currentPage = document.getElementById('currentPage');
//     currentPage.innerHTML = id.innerText;
//     let mainContent = document.getElementById('box');
//     if (currentPage.innerHTML == "Customers") {
//         mainContent.innerHTML = customersHtml;
//     } else if (currentPage.innerHTML == "Products") {
//         mainContent.innerHTML = productsHtml;
//     } else if (currentPage.innerHTML == "Links") {
//         mainContent.innerHTML = linkPageHtml;
//     } else if (currentPage.innerHTML == "Raffles") {
//         mainContent.innerHTML = rafflePageHtml;
//     } else if (currentPage.innerHTML = "Affiliates") {
//         mainContent.innerHTML = affiliatesPageHtml;
//     }
//     else {
//         mainContent.innerHTML = customersHtml;
//     }
//     let elems = document.querySelector('.active');
//     if (elems !== null) {
//         elems.classList.remove("active");
//     }
//     id.parentNode.classList.add('active');
// }

// // top panel links activation
// function panelActive(id) {
//     let elems = document.querySelector('.panel-item.active');
//     if (elems !== null) {
//         elems.classList.remove("active");
//     }
//     id.classList.add('active');
// }

// // Collapsibles scripts
// function collapser(element) {
//     element.classList.toggle("active");
//     var content = element.nextElementSibling;
//     if (content.style.display === "flex") {
//         content.style.display = "none";
//     } else {
//         content.style.display = "flex";
//     }
// }

// function pageRetreiver(event) {
//     if (event) {
//         event.preventDefault();
//     }
//     $('#box').load('home');
//     window.history.replaceState({ additionalInformation: 'Updated the URL with JS' }, 'Home', 'home');
// }

// $(document).on("click", '#homeLink', function (event) {
//     pageRetreiver(event);
// })

// $(document).ready(function () {
//     pageRetreiver(false);
// });