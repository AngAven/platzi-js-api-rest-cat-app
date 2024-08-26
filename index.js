console.log('random cats')

const URL = 'https://api.thecatapi.com/v1/images/search'
const buttonReload = document.querySelector('button')

const getCats = async () => {
    const response = await fetch(URL)
    const data = await response.json()
    const img = document.querySelector('img')

    if (data) {
        img.src = data[0].url
    }
}

buttonReload.addEventListener('click', (evt) => {
    getCats().then()
})

getCats().then()
