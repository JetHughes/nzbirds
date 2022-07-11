
fetch('data/nzbird.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data.forEach(function (item) {
            const card = document.createElement("div")
            card.className = "bird-card"
            const img = document.createElement("img")
            img.src = item.photo.source
            const name = document.createElement("h2")
            name.textContent = item.primary_name
            const info = document.createElement("div")
            info.className = "information"
            const headings = document.createElement("div")
            headings.className = "headings"
            const values = document.createElement("div")
            values.className = "values"
            const familyHeading = document.createElement("p")
            familyHeading.textContent = "Family"
            const orderHeading = document.createElement("p")
            orderHeading.textContent = "Order"
            const family = document.createElement("p")
            family.textContent = item.family
            const order = document.createElement("p")
            order.textContent = item.order

            card.appendChild(img)
            card.appendChild(name)
            card.appendChild(info)
            info.appendChild(headings)
            info.appendChild(values)
            headings.appendChild(familyHeading)
            headings.appendChild(orderHeading)
            values.appendChild(family)
            values.appendChild(order)

            document.getElementById("birds-container").appendChild(card)

        })
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

//
// function filterPressed(){
//     // const searchTerm = document.getElementById("search").value
//     // const status = document.getElementById("statuses").value
//     // const sortBy = document.getElementById("sort").value
//     const data = fetchData()
//     document.getElementById("results").textContent = data[0].primary_name
// }