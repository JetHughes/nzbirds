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
        //create list
        const li = document.createElement("li")
        const p = document.createElement("p")
        li.appendChild(p)
        ul.appendChild(li)
        p.textContent = status.name
        p.style.color = status.color

        //fill select options
        let option = document.createElement("option")
        option.value = status.name
        option.text = status.name
        select.appendChild(option)
    });
    let option = document.createElement("option")
    option.value = "Any"
    option.text = "Any"
    select.appendChild(option)
}
loadStatuses()

function highlight(card, color){
    card.style.boxShadow = color + " 0 6px 12px -2px, " + color + " 0 3px 7px -3px"   
}

function removeHighlight(card){
    card.style.boxShadow = "rgba(50, 50, 93, 0.25) 0 6px 12px -2px, rgba(50, 50, 93, 0.25) 0 3px 7px -3px"
}

function createCard(item) {

    const birdCardPlaceholder = "<div class=\"bird-card\" style=\"box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(50, 50, 93, 0.25) 0px 3px 7px -3px;\"><div class=\"image-container\"><img src=\"{image}\"/><h2>{name}</h2><p>Photo by: {imgCredit}</p></div><h3>{engName}</h3><h4>{sciName}</h4><div class=\"information\"><div class=\"headings\"><p>Family</p><p>Order</p><p>Status</p><p>Weight</p></div><div class=\"values\"><p>{family}</p><p>{order}</p><p>{status}</p><p>{weight}</p></div></div></div>"

    const replacements = {
        image: item.photo.source,
        imgCredit: item.photo.credit,
        name: item.primary_name,
        engName: item.english_name,
        sciName: item.scientific_name,
        family: item.family,
        status: item.status,
        order: item.order,
        weight: item.size.weight.value
    };

    const string = birdCardPlaceholder.replace(
    /{(\w+)}/g, 
    (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
    replacements.hasOwnProperty(placeholderWithoutDelimiters) ? 
        replacements[placeholderWithoutDelimiters] : placeholderWithDelimiters
    );

    document.getElementById("birds-container").innerHTML += string
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
        const container = document.getElementById("birds-container")
        let birds = [];
        container.innerHTML = ''
        data.forEach(function(item){
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
        birds.forEach(function(bird){
            createCard(bird)
        })
        const results = birds.length
        document.getElementById("results").textContent = results + " results"
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });
    
}
document.getElementById("filter-button").addEventListener('click', filterPressed)

statuses.forEach(item => {
    if (item.name = "Relict") {
        
    }
})
    
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
    }
    return -1
}