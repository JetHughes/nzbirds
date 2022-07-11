async function fetchData() {
    const response = await fetch('https://website.com/file.json');
    if (!response.ok){
        console.error(response.status});
}
const data = response.json()
}


function filterPressed(){
    // const searchTerm = document.getElementById("search").value
    // const status = document.getElementById("statuses").value
    // const sortBy = document.getElementById("sort").value
    document.getElementById("results").textContent = jsondata[0].primary_name
}