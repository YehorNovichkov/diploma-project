export const authenticator = async () => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_IMAGEKIT_AUTHENTICATION_ENDPOINT)

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        const { signature, expire, token } = data
        return { signature, expire, token }
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`)
    }
}

export const imageKitLoader = ({ src, width, quality }) => {
    if (src[0] === '/') src = src.slice(1)
    const params = [`w-${width}`]
    if (quality) {
        params.push(`q-${quality}`)
    }
    const paramsString = params.join(',')
    var urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    if (urlEndpoint[urlEndpoint.length - 1] === '/') urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1)
    return `${urlEndpoint}/${src}?tr=${paramsString}`
}
