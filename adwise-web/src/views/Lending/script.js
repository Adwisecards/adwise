const lang = document.querySelector('.language-item-selected')
const langList = document.querySelector('.auth-pagination__item_lang-ul')
const langElemets = document.querySelectorAll('.auth-pagination__item_lang-non-select')
const openMenu = document.getElementById('burger')
const closeMenu = document.getElementById('close')
const mobileMenu = document.querySelector('.auth-pagination__header')
const logoTitle = document.querySelectorAll('.logo__title')

lang.addEventListener('click', ()=>{
    if(langList.classList == 'auth-pagination__item_lang-ul dn'){
        langList.classList.remove('dn')
    } else langList.classList.add('dn')
})

langElemets.forEach(el=>{
    el.addEventListener('click', (event)=>{
        let langSelect = document.querySelector('.auth-pagination__item_lang-selected')
        langSelect.remove()
        let langEl = el.cloneNode(true)
        lang.insertAdjacentElement('afterbegin', langEl)
        let subSelected = lang.querySelector('.auth-pagination__item_lang-non-select')
        subSelected.classList.remove('auth-pagination__item_lang-non-select')
        subSelected.classList.add('auth-pagination__item_lang-selected')
        if(langList.classList == 'auth-pagination__item_lang-ul dn'){
            langList.classList.remove('dn')
        } else langList.classList.add('dn')
    })
})

openMenu.addEventListener('click', ()=>{
    openMenu.style.display = 'none'
    mobileMenu.style.display = 'flex'
    closeMenu.style.display = 'block'
    logoTitle[0].style.color = 'white'
})
closeMenu.addEventListener('click', ()=>{
    closeMenu.style.display = 'none'
    mobileMenu.style.display = 'none'
    openMenu.style.display = 'block'
    logoTitle[0].style.color = 'black'
})

wow = new WOW({
    mobile:true
})
wow.init();