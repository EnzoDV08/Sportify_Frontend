// src/services/usePexelsImage.ts
import axios from 'axios'

const PEXELS_API_KEY = '7IVPe9XABLwSO9BCaXgH6ZpaFvJ8Vdwm4xG3X7UAD2uK3woHSEe6o37A'

export const fetchPexelsImage = async (query: string): Promise<string | null> => {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        Authorization: PEXELS_API_KEY
      },
      params: {
        query,
        per_page: 1
      }
    })

    const photo = response.data.photos?.[0]
    return photo ? photo.src?.medium || photo.src?.original : null
  } catch (err) {
    console.error('❌ Failed to fetch image from Pexels:', err)
    return null
  }
}
