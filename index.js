const KeyPublic = "f7e0910c8ee0e163a98aeafc8d379635"
const KeyPrivate = "d7d78b85d27c0ae1a038b6a62ade43b8cd76be0e"
const URL = "https://gateway.marvel.com:443/v1/public/characters?"
const limit = 100
const main = document.getElementById("marvel")
const inputPersonaje = document.getElementById("personaje")
const form = document.getElementById("buscar")
const cargaContenedor = document.getElementById("carga")

const creadoradeMArvel = (tony) => {
    const { name, thumbnail, description, comics, urls } = tony
    const imagUrl = thumbnail.path + "." + thumbnail.extension
    const comicCount = comics.available
    const links = urls.map(url => `<a href="${url.url}" target="_blank">${url.type}</a>`).join(" | ")

    main.innerHTML +=
        `<div class= "container" >
   <img src="${imagUrl}" alt="${name}"/>
   <strong>Nombre: ${name}</strong>
   <br><strong>Descripción: ${description || "No disponible por el momento por orden del Sr. Stark"} </strong>
   <br><strong>Comics: ${comicCount}</strong>
   <br><strong>Más Info: ${links}</strong>
   </div>`
}

llamadoAMarvel = async (nombre = "") => {
    main.innerHTML = ""
    cargaContenedor.style.display = "block"
    const ts = new Date().getTime()
    const hash = CryptoJS.MD5(ts + KeyPrivate + KeyPublic).toString()
    let offset = 0
    let total = 0
    try {
        const buscaURL = nombre
            ? `${URL}nameStartsWith=${nombre}&ts=${ts}&apikey=${KeyPublic}&hash=${hash}&limit=${limit}&offset=${offset}`
            : `${URL}ts=${ts}&apikey=${KeyPublic}&hash=${hash}&limit=${limit}&offset=${offset}`

        const pResult = await fetch(buscaURL)
        const Pdata = await pResult.json()
        total = Pdata.data.total
        Pdata.data.results.forEach(creadoradeMArvel)

        for (offset = 100; offset < total; offset += limit) {
            const proxURL = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${KeyPublic}&hash=${hash}&limit=100&offset=${offset}`
            let result = await fetch(proxURL)
            let data = await result.json()
            data.data.results.forEach(creadoradeMArvel)
        }
    } catch (error) {
        console.error("Tenemos un error en traer la API MARVEL, Thanos nos ha vencido", error)

    } finally {
        cargaContenedor.style.display = "none"
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombrePersonaje = inputPersonaje.value.trim();
    llamadoAMarvel(nombrePersonaje);
});
llamadoAMarvel()

