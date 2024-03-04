type PostalCode = {
  countryCode: string;
  postalCity: string;
  postalCode: string;
};

const fetchPostNumbers = async (prefix: string) => {
  return await fetch(
    `https://www.postnord.se/api/location/get-by-location?countryCode=SE&query=${encodeURIComponent(
      prefix
    )}`
  ).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return (json.postalCodes ?? []) as PostalCode[];
  });
};

const postalCodeCityNameMapping: Record<string, string> = {};
const range = Array(1000)
  .fill(0)
  .map((v, i) => i + 1)
  .filter((x) => x >= 100 && x <= 999)
  .map((x) => x.toString().padStart(3, "0"));

for (const prefix of range) {
  console.log(
    `${new Date().toISOString()} Fetching for ${prefix}/${range.at(-1)}`
  );
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
  const codes = await fetchPostNumbers(prefix);
  for (const code of codes) {
    postalCodeCityNameMapping[code.postalCode] = code.postalCity;
  }
}

await Deno.writeTextFile(
  "./postalcodes.json",
  JSON.stringify(postalCodeCityNameMapping, null, 2)
);
