let mediaItemS = document.getElementById("mediaItemS");//select mediaItemS Div
let searchMovieInput = document.getElementById("searchMovie");
let searchMovieDBInput = document.getElementById("searchMovieDB");
let searchBtn = document.getElementById("searchBtn");
let currentMoviesPageNumber=1 ;
// get api response to get now playing movies from developers.themoviedb.org
let moviesInTheatres = [] ; 
let moviesFilterType = "now_playing";
async function getAllMovies(moviesPageNumber,moviesFilterType) {
    let apiResponse = await fetch(`https://api.themoviedb.org/3/movie/${moviesFilterType}?api_key=8906c339de6b4f155e12b0b5ae756c10&language=en-US&page=${moviesPageNumber}`);
    apiResponse =await apiResponse.json();
    moviesInTheatres = apiResponse.results

     displayAllMovies(moviesInTheatres);
     adjustPrevious(apiResponse.page) ;
     adjustNext(apiResponse.page);
}
getAllMovies(currentMoviesPageNumber,moviesFilterType);

function displayAllMovies(arrayList){
    let cartoona = ``;
    for (let index = 0; index < arrayList.length; index++) {
        cartoona += `<div class="col">
        <div class="mediaItem position-relative overflow-hidden">
            <div class="mediaItemLayer position-absolute w-100 h-100 pt-5 px-3 text-white text-center">
                <h4 class="fs-2">${arrayList[index].title}</h4>
                <p class="lead text-start user-select-all">${arrayList[index].overview}</p>
                <span class="d-block fs-2">${arrayList[index].vote_average}</span>
                <span class="lead">${arrayList[index].release_date}</span>
            </div>
            <img class="img-fluid rounded-3" src="https://image.tmdb.org/t/p/w500${arrayList[index].poster_path}" alt="${arrayList[index].title}" srcset="">
        </div>
    </div>`;       
    }
    mediaItemS.innerHTML = cartoona ; 
}


// search inside now playing movies array 
searchMovieInput.addEventListener("input",()=>{   
    if (searchMovieInput.value) {
        searchMoviesInTheatres(searchMovieInput.value);
    } else {
        displayAllMovies(moviesInTheatres);
    }
}); 
function searchMoviesInTheatres(searchTerm) {

    let cartoona = ``;
    for (let index = 0; index < moviesInTheatres.length; index++) {
       if (moviesInTheatres[index].title.toLowerCase().includes(searchTerm.toLowerCase())) {
        cartoona += `<div class="col">
        <div class="mediaItem position-relative overflow-hidden">
            <div class="mediaItemLayer position-absolute w-100 h-100 pt-5 px-3 text-white text-center">
                <h4 class="fs-2">${moviesInTheatres[index].title}</h4>
                <p class="lead text-start user-select-all">${moviesInTheatres[index].overview}</p>
                <span class="d-block fs-2">${moviesInTheatres[index].vote_average}</span>
                <span class="lead">${moviesInTheatres[index].release_date}</span>
            </div>
            <img class="img-fluid rounded-3" src="https://image.tmdb.org/t/p/w500${moviesInTheatres[index].poster_path}" alt="${moviesInTheatres[index].title}" srcset="">
        </div>
    </div>`;       
        }
    }
        mediaItemS.innerHTML = cartoona ;    

}
//End of search inside now playing movies array 
// --------------------------------------------------
//  search for movies in entire TMDb movie DB API
searchBtn.addEventListener("click",()=>{
    searchMovieDB(searchMovieDBInput.value);
})
searchMovieDBInput.addEventListener("keydown",function(eventInfo){ //invoke searchMovieDB() function by enter key
    if(eventInfo.code==="Enter"|| eventInfo.keyCode===13){
        searchMovieDB(searchMovieDBInput.value);
    }
})
async function searchMovieDB(searchTerm) {
    let apiRespone =await fetch(`https://api.themoviedb.org/3/search/movie?api_key=8906c339de6b4f155e12b0b5ae756c10&language=en-US&query=${searchTerm}&page=1&include_adult=false`);
    apiRespone = await apiRespone.json();
    let moviesDBSearchResult = apiRespone.results ;
    displayAllMovies(moviesDBSearchResult);

}
searchMovieDBInput.addEventListener("input",()=>{// invoke  displayAllMovies(moviesInTheatres) when user delete search input value
    if(!searchMovieDBInput.value){
        displayAllMovies(moviesInTheatres);
    }
})
//  search for movies in entire TMDb movie DB API
// --------------------------------------------------
//----------------JQuery----------------------------------
//pagination by number
let paginationLinks = $(".page-item .page-link").not(".page-item .paginationWord");


//console.log(paginationLinks);
for (let index = 0; index < paginationLinks.length; index++) {
    paginationLinks.eq(index).click(function(){
        scrollTopByPaginationLinks();
        currentMoviesPageNumber = $(this).html() ;
        getAllMovies( $(this).html(),moviesFilterType);
    }) 
}
//pagination by previous and next 
let paginationPrevious = $(".paginationWord").first();
let paginationNext = $(".paginationWord").last();


paginationPrevious.click(()=>{
    scrollTopByPaginationLinks()
    currentMoviesPageNumber-- ;
    adjustPrevious(currentMoviesPageNumber)
     if (currentMoviesPageNumber===0){
        currentMoviesPageNumber= paginationLinks.length;
        getAllMovies( currentMoviesPageNumber,moviesFilterType);
    }else{
        getAllMovies( currentMoviesPageNumber,moviesFilterType);
    }
})

paginationNext.click(()=>{
    scrollTopByPaginationLinks()
    currentMoviesPageNumber++ ;
    adjustNext(currentMoviesPageNumber);
     if (currentMoviesPageNumber > paginationLinks.length){
        currentMoviesPageNumber= 1;
        getAllMovies(currentMoviesPageNumber,moviesFilterType);
    }else{
        getAllMovies( currentMoviesPageNumber,moviesFilterType);
    }
})

function adjustPrevious(currentMoviesPageNumber){
    if(currentMoviesPageNumber===1 || currentMoviesPageNumber < 1){
        $("ul.pagination li:first-child").addClass("disabled") ;
    }else if (currentMoviesPageNumber > 1 ){
        $("ul.pagination li:first-child").removeClass("disabled") ;
    }
}

function adjustNext(currentMoviesPageNumber){
    if(currentMoviesPageNumber===paginationLinks.length ){
        $("ul.pagination li:last-child").addClass("disabled") ;
    }else if (currentMoviesPageNumber < paginationLinks.length ){
        $("ul.pagination li:last-child").removeClass("disabled") ;
    }
}

//console.log(mediaItemSOffset);
 function scrollTopByPaginationLinks(){
    let mediaItemSTopOffset = $(mediaItemS).offset().top;
     $('html,body').animate({scrollTop:mediaItemSTopOffset},2000);
}

//----------------JQuery----------------------------------
//End pagination 
// start of toggle botton to open and close menu
let openMenu = document.getElementById("openMenu");
let closeMenu = document.getElementById("closeMenu");
let mainSidebar = document.querySelector(".mainSidebar");
openMenu.addEventListener('click',function(){
    openMenu.classList.add("d-none");
    closeMenu.classList.add("d-block");
    closeMenu.classList.remove("d-none");
    mainSidebar.classList.add("start-0");

});
closeMenu.addEventListener('click',function(){
    closeMenu.classList.add("d-none");
    openMenu.classList.add("d-block");
    openMenu.classList.remove("d-none");
    mainSidebar.classList.remove("start-0");
});
// end of toggle botton to open and close menu
// menu list item tnavigate movies api (now palying,most watched , top rated)
let menuItemS=document.querySelectorAll("menu li");
for (let index = 0; index < menuItemS.length; index++) {
    menuItemS[index].addEventListener('click',()=>{
        console.log(menuItemS[index].dataset.value);
        moviesFilterType = menuItemS[index].dataset.value;
        getAllMovies(currentMoviesPageNumber,moviesFilterType);

    })
}
// session id and token
let tokenValue
let tokenObject = {};

if(localStorage.getItem("SessionIdSorageKey")){
    sessionId = localStorage.getItem("SessionIdSorageKey") ;
    console.log(sessionId);
}else{
    let sessionId ;
}

let logBtn= document.querySelector(".accountDetails span:first-of-type");
let sessionTestBtn= document.querySelector(".accountDetails span:last-of-type");



logBtn.addEventListener("click",()=>{
    requestAToken();
});
sessionTestBtn.addEventListener("click",()=>{

        setSessionID();
    
});
// get a temporary token from tmdb api valid for 60 min
async function requestAToken(){
    let apiResponse = await fetch("https://api.themoviedb.org/3/authentication/token/new?api_key=8906c339de6b4f155e12b0b5ae756c10");
    apiResponse = await apiResponse.json();
    //console.log(apiResponse)
    tokenValue = apiResponse.request_token ;
    tokenObject = {"request_token":tokenValue} ;
    localStorage.setItem("tokenStorageKey",JSON.stringify(tokenObject)) ;
    //console.log( localStorage.getItem('tokenStorageKey')); will be send like this in  setSessionID() function in API request body
    //--------JSON.stringify(tokenObject)---------{"request_token":"185d0878e1d4abcb7c5e81ac70cc66c14c71f158"}-------------
    //authorize the requested token by asking user for permission
    //and redirect back to the app
    location.href=`https://www.themoviedb.org/authenticate/${tokenValue}?redirect_to=https://amrdawood.github.io/EntertainmentMedia/`;
}

async function setSessionID() {
    let apiResponse = await fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=8906c339de6b4f155e12b0b5ae756c10&`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body:localStorage.getItem('tokenStorageKey')
    });
    apiResponse = await apiResponse.json();
   //console.log(apiResponse);
    sessionId= apiResponse.session_id ;
    localStorage.setItem("SessionIdSorageKey",sessionId);
   // console.log(localStorage.getItem("SessionIdSorageKey"));
}