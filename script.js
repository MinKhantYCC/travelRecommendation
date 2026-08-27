const queryTextInput = document.getElementById("query");
const navSearchBtn = document.getElementById("nav-search-btn");
const navCancelBtn = document.getElementById("nav-cancel-btn");
const resultContainer = document.getElementById("result");
const contentContainer = document.getElementById("content");


function showResult(results) {
    resultContainer.style.display = "flex";

    let htmlContent = `<h1>Search results</h1>
    <div class="result-cards-container">
    `;
    let resultCard = '';
    
    for (let index in results) {
        resultCard = `<div class="result-card">
            <img src="${results[index].imageUrl}" alt="${results[index].name}">
            <h2>${results[index].name}</h2>
            <p>${results[index].description}</p>
        </div>
        `
        htmlContent = htmlContent + "\n" + resultCard;
    }

    htmlContent = htmlContent + "\n" + "</div>"

    resultContainer.innerHTML = htmlContent;
}

function showNoResult() {
    resultContainer.style.display = "flex";

    let htmlContent = `<h1>Sorry, No result found!</h1>`
    resultContainer.innerHTML = htmlContent;
}


navSearchBtn.addEventListener("click", () => {
    let searchQuery = queryTextInput.value.toLowerCase();
    resultContainer.innerHTML = "";

    fetch("travel_recommendation_api.json")
    .then(resp => {
        if (!resp.ok) {
            throw new Error(`HTTP error: ${resp.status}`);
        }
        return resp.json();
    }).then((data) => {
        let results = [];
        let found = false;
        // upper level search
        for (let category in data) {
            if (category.toLowerCase().includes(searchQuery)) {
                if (Array.isArray(data[category])) {
                    if (category === "countries") {
                        for (let country of data.countries) {
                            results = results.concat(country.cities)
                        }
                    } else {
                        results = results.concat(data[category]);
                    }
                    console.log(results);
                } else {
                    results.push(data[category]);
                }
                found = true;
            } else {
                data[category].map((item) => {
                    if (category === "countries") {
                        for (let city of item.cities) {
                            if (city.name.toLowerCase().includes(searchQuery)) {
                                if (Array.isArray(city)) {
                                    results = results.concat(city);
                                } else {
                                    results.push(city);
                                }
                                found = true;
                            }
                        }
                    } else {
                        if (item.name.toLowerCase().includes(searchQuery)) {
                            if (Array.isArray(item)) {
                                results = results.concat(item);
                            } else {
                                results.push(item);
                            }
                            found = true;
                        }
                    }
                })
            }
        }

        if (found) {
            contentContainer.style.display = "none";
            console.log(results);
            showResult(results);
        } else {
            contentContainer.style.display = "none";
            showNoResult();
        }
    })
    .catch(err => {
        console.error(err);
    });
})

navCancelBtn.addEventListener("click", () => {
    queryTextInput.value = null;
    contentContainer.style.display = "block";
    resultContainer.innerHTML = "";
})