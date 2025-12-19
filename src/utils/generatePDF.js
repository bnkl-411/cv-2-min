import { API_URL } from '@config/urls'

export async function generatePDF(action = 'download') {
    const slug = window.location.href.split("/").pop()
    const localStorageData = localStorage.getItem(slug)
    const json = JSON.parse(localStorageData)

    const fullNameItem = json.data.cv.personal?.find(item => item.key === 'fullName')
    const fullName = fullNameItem?.value?.replace(/\s+/g, '-') || 'CV'

    const response = await fetch(`${API_URL}/api/cv/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            url: window.location.href,
            localStorage: localStorageData,
            fullName: fullName,
            action: action
        })
    })

    if (!response.ok) throw new Error('Export failed')

    if (action === 'store') {
        console.log('lol');
        const data = await response.json()

        console.log(data.url);
        return data.url
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CV-${fullName}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
}