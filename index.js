const API_KEY = 'live_tfrEV6jhQkgrGWdJDeyyxkO9MUWIISaPOFAQClTCe1fVt8RQ513O4NcpCLyOIDn7'
const BASE_API = 'https://api.thecatapi.com/v1/'
const API_RANDOM_CATS = BASE_API + 'images/search?limit=2&api_key=' + API_KEY
const API_FAVORITE_CATS = BASE_API + 'favourites?&api_key=' + API_KEY
const API_DELETE_CAT = BASE_API + 'favourites/'
const headers = {
    "Content-Type": "application/json",
    'x-api-key': API_KEY
}

const spanErrorRandomCats = document.querySelector('.loadRandomCats')
const spanErrorFavoriteCats = document.querySelector('.loadFavoriteCats')
const buttonReload = document.querySelector('button')

let isFavoritesEmpty = true
const emptyFavouriteCatsMessage = document.querySelector('.emptyFavouriteCatsMessage')

const loadRandomCats = async () => {
    const response = await fetch(API_RANDOM_CATS)

    if (response.ok) {
        const data = await response.json()
        console.log('Load random cats => ', data)

        if (data) {
            data.forEach((item) => {
                createCard(
                    item.id,
                    'randomCats',
                    item.url,
                    'Save to favorites',
                    `Cat: ${item.id}`)
            })

        }
    } else {
        spanErrorRandomCats.style.visibility = 'visible'
        spanErrorRandomCats.textContent = 'Error loading random cats'
    }
}
const saveFavouriteCats = async (imageID = '') => {
    let rawBody = JSON.stringify({
        "image_id": imageID
    })

    const response = await fetch(API_FAVORITE_CATS,
        {
            method: 'POST',
            headers: headers,
            body: rawBody
        }
    )
}
const createCard = (
    cardId,
    cardIdParent,
    cardUrlImage,
    cardBtnText = '',
    cardTitleText = '',
    cardText = '') => {
    const parent = document.getElementById(cardIdParent)
    const card = document.createElement('card')
    const img = document.createElement('img')
    const cardBody = document.createElement('div')
    const cardTitle = document.createElement('h5')
    const cardDescription = document.createElement('p')
    const btn = document.createElement('button')

    card.classList.add('card')
    card.style.width = '18rem'
    img.setAttribute('src', cardUrlImage)
    img.setAttribute('alt', 'random favorite cat')
    img.classList.add('card-img-top')
    cardBody.classList.add('card-body')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = cardTitleText
    cardDescription.classList.add('card-text')
    cardDescription.textContent = cardText
    btn.setAttribute('type', 'button')
    btn.setAttribute('class', 'btn btn-primary')
    btn.textContent = cardBtnText

    if (cardBtnText === 'Save to favorites') {
        btn.addEventListener('click', async () => {
            const a = await saveFavouriteCats(cardId)
            clearFavorites()
            await loadFavoriteCats()
        })
    } else if (cardBtnText === 'Remove from favorites') {
        btn.addEventListener('click', async () => {
            await removeFavouriteCats(cardId)
            clearFavorites()
            await loadFavoriteCats()
        })

    }

    parent.appendChild(card)
    card.appendChild(img)
    card.appendChild(cardBody)
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardDescription)
    cardBody.appendChild(btn)
}
const loadFavoriteCats = async () => {
    const response = await fetch(API_FAVORITE_CATS)

    if (response.ok) {
        const data = await response.json()
        console.log('load favorite cats => ', data)

        if (data) {
            if (data.length > 0) {
                isFavoritesEmpty = false
                emptyFavouriteCatsMessage.style.visibility = 'hidden'
                data.forEach((item) => {
                    createCard(
                        item.id,
                        'favoriteCats',
                        item.image.url,
                        'Remove from favorites',
                        `Cat: ${item.image.id}`,
                    )
                })
            } else {
                isFavoritesEmpty = true
                emptyFavouriteCatsMessage.style.visibility = 'visible'
            }
        }
    } else {
        spanErrorFavoriteCats.style.visibility = 'visible'
        spanErrorFavoriteCats.textContent = 'Error loading favorite cats'
    }
}
const removeFavouriteCats = async (id) => {
    const response = await fetch(API_DELETE_CAT + id,
        {
            method: 'DELETE',
            headers: headers,
        })
}
const clearFavorites = () => {
    const favoriteCats = document.getElementById('favoriteCats')
    const cards = favoriteCats.querySelectorAll('.card')

    console.log('cards = >', cards)

    if (cards.length > 0) {
        cards.forEach((item) => {
            item.remove()
        })
    }
}

loadRandomCats().then()
loadFavoriteCats().then()
