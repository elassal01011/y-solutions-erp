window.addEventListener('load',()=>{

const loader = document.getElementById('loader');

if(loader){
loader.style.display='none';
}

});

function toggleSidebar(){

document
.getElementById('sidebar')
.classList.toggle('active');

}

const themeToggle = document.getElementById('themeToggle');

if(themeToggle){

themeToggle.onclick = ()=>{

document.body.classList.toggle('dark-mode');

}

}

auth.onAuthStateChanged((user)=>{

if(!user && window.location.pathname.includes('dashboard')){

window.location.href='login.html';

}

});
