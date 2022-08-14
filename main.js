fetch('data/nzbird.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data.forEach(function(item){
            createCard(item)
        })
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });


const colors = [
    "#02a028",
    "#649a31",
    "#99cb68",
    "#fecc33",
    "#fe9a01",
    "#c26967", 
    "#9b0000",
    "#660032", 
    "#320033", 
    "#000", 
]

const statuses = [
    {"name": "Not Threatened","color": "#02a028", "rating": 0},
    {"name": "Naturally Uncommon","color": "#649a31", "rating": 1},
    {"name": "Relict","color": "#99cb68", "rating": 2},
    {"name": "Recovering","color": "#fecc33", "rating": 3},
    {"name": "Declining","color": "#fe9a01", "rating": 4},
    {"name": "Nationally Increasing","color": "#c26967", "rating": 5},
    {"name": "Nationally Vulnerable","color": "#9b0000", "rating": 6},
    {"name": "Nationally Endangered","color": "#660032", "rating": 7},
    {"name": "Nationally Critical","color": "#320033", "rating": 8},
    {"name": "Data Deficient","color": "#000", "rating": 9},
    {"name": "Extinct","color": "#000", "rating": 9},
]

function loadStatuses(){
    const ul = document.getElementById("status-list")
    const select = document.getElementById("statuses-select")
    statuses.forEach(status => {
        const item = `
        <li>
            <div class="dot" style="background-color: ${status.color}"></div>
            <p>${status.name}</p>
            </li>
            `
            ul.innerHTML += item;
        console.log(`appedn ${item}`)
        
        //fill select options
        let option = document.createElement("option")
        option.value = status.name
        option.text = status.name
        select.appendChild(option)
    });
}
loadStatuses()

function highlight(card, color){
    card.style.boxShadow = color + " 0 6px 12px -2px, " + color + " 0 3px 7px -3px"   
}

function removeHighlight(card){
    card.style.boxShadow = "rgba(50, 50, 93, 0.25) 0 6px 12px -2px, rgba(50, 50, 93, 0.25) 0 3px 7px -3px"
}

function createCard(item) {
    const card = document.createElement("div")
    card.className = "bird-card grid-item"
    card.onmouseover = function() {highlight(card, colors[statusRating(item.status)])}
    card.onmouseout = function() {removeHighlight(card)}

    card.innerHTML = `
    <div class="image-container">
                <div class="bird-color" style="background-color: ${colors[statusRating(item.status)]}"></div>
                <div class="gradient"></div>
                <img src="${item.photo.source}"/>
                <h2>${item.primary_name}</h2>
                <p>Photo by: ${item.photo.credit}</p>
                </div>
                <h3>${item.english_name}</h3>
                <h4>${item.scientific_name}</h4>
                <div class="information">                
                <p class="heading">Family</p>
                <p class="value">${item.family}</p>
                <p class="heading">Order</p>
                <p class="value">${item.order}</p>
                <p class="heading">Status</p>
                <p class="value">${item.status}</p>
                <p class="heading">Weight</p>
                <p class="value">${item.size.weight.value}</p>
            </div>
    `
    document.getElementById("birds-grid").appendChild(card)
}

function filterPressed(){
    const searchTerm = document.getElementById("search").value.toLowerCase()
    const status = document.getElementById("statuses-select").value
    const sortBy = document.getElementById("sort").value
    
    fetch('data/nzbird.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //clear elements not including the filter and status cards
        let elements = [...(document.querySelectorAll(".grid-item"))]
        elements = elements.filter(item => {
            return !item.classList.contains("bird-card")
        })
        document.getElementById("birds-grid").innerHTML = ''
        elements.forEach(element => {
            console.log(element)
            document.getElementById("birds-grid").appendChild(element);
        })

        //repopulate grid with elements that match filter options
        let birds = [];
        data.forEach(function(item){
            //get all names
            const names = [];
            names.push(item.english_name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
            names.push(item.primary_name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
            names.push(item.scientific_name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
            item.other_names.forEach(function(name) {
                names.push(name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
            })
            
            //the the name includes the search term and the is in the selected category add to the list of birds to display
            if((names.find(name => {return name.includes(searchTerm)}) || searchTerm == '') && (item.status == status || status == "Any")) {
                birds.push(item)
            }
        })

        //sort birds
        birds.sort(function(a,b){
            switch(sortBy) {
                case "Name":
                    return a.name - b.name
                case "Weight":
                    return a.size.weight.value - b.size.weight.value
                case "Status":
                    return statusRating(a.status) - statusRating(b.status)
                }
        })

        //create grid elements
        birds.forEach(function(bird){
            createCard(bird)
        })

        //update result count
        const results = birds.length
        document.getElementById("results").textContent = results + " results"
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });
    
}
document.getElementById("filter-button").addEventListener('click', filterPressed)
    
function statusRating(status){
    switch(status){
    case "Not Threatened": 
        return 0
    case "Naturally Uncommon": 
        return 1
    case "Relict": 
        return 2
    case "Recovering": 
        return 3
    case "Declining": 
        return 4
    case "Nationally Increasing": 
        return 5
    case "Nationally Vulnerable": 
        return 6
    case "Nationally Endangered": 
        return 7
    case "Nationally Critical": 
        return 8
    case "Data Deficient": 
        return 9
    case "Extinct": 
        return 9
    default:
        return -1;
    }
}
