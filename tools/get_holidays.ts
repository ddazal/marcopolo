import type { ToolDefinition } from "./schema";

export type GetHolidaysInput = { year: string; countryCode: string };

export const getHolidaysTool: ToolDefinition = {
  name: "get_holidays",
  description:
    "Retrieve the list of all public holidays for the specified year and country",
  parameters: {
    properties: {
      year: {
        type: "string",
        description:
          "The target year for which public holidays should be retrieved. If not specific year is asked, default to the current year",
      },
      countryCode: {
        type: "string",
        description: "A valid ISO 3166-1 alpha-2 country code.",
      },
    },
    required: ["year", "countryCode"],
  },
};

export async function getHolidays({ year, countryCode }: GetHolidaysInput) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toLowerCase()}`;

  const response = await fetch(url);

  if (response.status !== 200) {
    // TODO: handle error properly
    return [];
  }

  const data = await response.json();
  return data;
}
