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

function createCard(item) {
    const card = document.createElement("div")
    card.className = "bird-card"
    const imgCont = document.createElement("div")
    imgCont.className = "image-container"
    const imgCapt = document.createElement("h2")
    imgCapt.textContent = item.primary_name
    const imgCredit = document.createElement("p")
    imgCredit.textContent = "Photo by: " + item.photo.credit
    const img = document.createElement("img")
    img.src = item.photo.source
    const name = document.createElement("h3")
    name.textContent = item.english_name
    const info = document.createElement("div")
    info.className = "information"
    const headings = document.createElement("div")
    headings.className = "headings"
    const values = document.createElement("div")
    values.className = "values"
    const familyHeading = document.createElement("p")
    familyHeading.textContent = "Family"
    const family = document.createElement("p")
    family.textContent = item.family
    const orderHeading = document.createElement("p")
    orderHeading.textContent = "Order"
    const order = document.createElement("p")
    order.textContent = item.order
    const statusHeading = document.createElement("p")
    statusHeading.textContent = "Status"
    const status = document.createElement("p")
    status.textContent = item.status
    const weightHeading = document.createElement("p")
    weightHeading.textContent = "Weight"
    const weight = document.createElement("p")
    weight.textContent = item.size.weight.value

    card.appendChild(imgCont)
    imgCont.appendChild(img)
    imgCont.appendChild(imgCapt)
    imgCont.appendChild(imgCredit)
    card.appendChild(name)
    card.appendChild(info)
    info.appendChild(headings)
    info.appendChild(values)
    headings.appendChild(familyHeading)
    values.appendChild(family)
    headings.appendChild(orderHeading)
    values.appendChild(order)
    headings.appendChild(statusHeading)
    values.appendChild(status)
    headings.appendChild(weightHeading)
    values.appendChild(weight)
    const color = colors[statusRating(item.status)]
    card.style.boxShadow = color + " 0 6px 12px -2px, " + color + " 0 3px 7px -3px"
    document.getElementById("birds-container").appendChild(card)
}


function filterPressed(){
    const searchTerm = document.getElementById("search").value.toLowerCase()
    const status = document.getElementById("statuses").value
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

                if((names.find(name => {return name === searchTerm}) || searchTerm == '') && (item.status == status || status == "Any")) {
                    birds.push(item)
                }
            })
            birds.sort(function(a,b){
                switch(sortBy) {
                    case "Name":
                        return a.name < b.name ? -1 : 1
                    case "Weight":
                        return a.size.weight.value < b.size.weight.value ? -1 : 1
                    case "Status":
                        return statusRating(a.status) < statusRating(b.status) ? -1 : 1
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