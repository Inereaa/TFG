
export function fetchApi(url) {
    return fetch(url)
    .then((res) => res.json())
}
