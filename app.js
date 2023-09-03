const heading = document.getElementById('heading');
const dateInp = document.getElementById('date');
const search = document.getElementById('search-btn');
const dropdown = document.getElementById('prev');
const image = document.getElementById('image');
const text = document.getElementById('text');

let datesArr = [];

search.addEventListener('click', ()=>getImageOfTheDay());

window.onload = getCurrentImageOfTheDay;

async function getCurrentImageOfTheDay(){
    localStorage.clear();
    const currentDate = new Date().toISOString().split("T")[0];
    const your_api_key = `CSe48HVZmgZLgkhyuR1XNIWd32ngR75b356FUk7p`;
    const url = ` https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${your_api_key}`;
    if (currentDate) {
        try {
            const resp = await fetch(url);
            const res = await resp.json();
            console.log(res);
            displayUi(res);
        } catch (error) {
            handleError();
            console.log(error);
        }
    }
}
async function getImageOfTheDay(arg) {
    let date;
    if(!arg){
        date = dateInp.value;
    }else{
        date = arg;
    }
    const your_api_key = `CSe48HVZmgZLgkhyuR1XNIWd32ngR75b356FUk7p`;
    const url = ` https://api.nasa.gov/planetary/apod?date=${date}&api_key=${your_api_key}`;
    if (date) {
        try {
            const resp = await fetch(url);
            const res = await resp.json();
            console.log(res);
            dateInp.value='';
            displayUi(res);
            saveSearch({'date' : date});
        } catch (error) {
            dateInp.value='';
            handleError();
            console.log(error);
        }
    }
}

//add the dates searched in local storage;
function saveSearch(date) {
    if(localStorage.getItem('dates')){
        let newArr = JSON.parse(localStorage.getItem('dates'));
        if(newArr.some( e => e.date === date.date)){
            return;    
        }
        newArr.push(date);
        localStorage.clear();
        localStorage.setItem('dates', JSON.stringify(newArr));
    }else{
        datesArr.push(date);
        localStorage.setItem('dates', JSON.stringify(datesArr));
    }
    addSearchToHistory();
}

//show localStorage dates in ui dropdown
function addSearchToHistory() {
    dropdown.innerHTML = '';
    datesArr = JSON.parse(localStorage.getItem('dates'));
    let innerHtml = `<option value="">---Select a date---</option>`;
    datesArr.forEach(e => {
        let innerText = e.date.split('-');
        innerHtml += `<option value="${e.date}">${innerText[2]+'-'+innerText[1]+'-'+innerText[0]}</option>`
    });
    dropdown.innerHTML = innerHtml;
}

dropdown.addEventListener('change',()=>{

})

//displaying the image and text based on api search
function displayUi(data) {
    document.querySelector(".bg").style.cssText = `background: url(${data.url}) no-repeat center center/cover;`
    let innerText = data.date.split('-');
    heading.innerText = `Nasa-Picture Of ${innerText[2]+'-'+innerText[1]+'-'+innerText[0]}`;
    image.innerHTML = '';
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.title;
    image.appendChild(img);

    text.innerHTML='';
    text.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.explanation}</p>
    `
}
function handleError() {
    let imgUrl = `https://cdn.dribbble.com/users/1078347/screenshots/2799566/oops.png`;

    heading.innerText = `Nasa-Picture Of The Day`;

    image.innerHTML = '';
    const img = document.createElement('img');
    img.src =imgUrl;
    img.alt = 'error';
    image.appendChild(img);

    text.innerHTML='';
    text.innerHTML = `
    <h3>Something Went Wrong</h3>
    <p>The API key limit may have been exhausted or the image of this particular day doesn't exist</p>
    `
}


dropdown.addEventListener('change',()=>getImageOfTheDay(dropdown.value));