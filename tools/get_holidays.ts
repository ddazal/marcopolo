export type GetHolidaysInput = { year: string, countryCode: string}

export async function getHolidays({year,countryCode}: GetHolidaysInput) {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toLowerCase()}`

    const response = await fetch(url)

    if (response.status !== 200) {
        // TODO: handle error properly
        return []
    }

    const data = await response.json()
    return data
}