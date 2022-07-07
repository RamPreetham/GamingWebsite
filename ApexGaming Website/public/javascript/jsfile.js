const navTogglerOpen = document.querySelector('.navbar-toggler-open');
const navTogglerClose = document.querySelector('.navbar-close');
const navbarCollapseDiv = document.querySelector('.NavBar-Collapse');

navTogglerOpen.addEventListener('click',() =>{
    navbarCollapseDiv.classList.add('show-NavBar-Collapse')
});

navTogglerClose.addEventListener('click', () => {
    navbarCollapseDiv.classList.remove('show-NavBar-Collapse');
});