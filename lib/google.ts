export const autocomplete = async (input: string) => {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY // Access the key from Vite environment variable

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status}`)
    }

    return data.predictions // Return the predictions
  } catch (error) {
    console.error('Autocomplete error:', error)
    return []
  }
}
