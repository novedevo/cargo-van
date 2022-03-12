import emoji from "node-emoji";

const baseUrl = "https://www.marinetraffic.com/en/";
const headers = {
  "Vessel-Image": "00be19cb54b3d523161214b2a2e1d68cf011",
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  console.log("begin")
  const response = await fetch(baseUrl + "reports?asset_type=arrivals_departures&columns=shipname,move_type,ata_atd,imo,ship_type&port_in=682&ship_type_in=7,8", {
    headers
  }).then((res) => res.json());

  const ships = response.data;
  const lastShipIds = new Set(['ship1', 'ship2']); // populate from last run

  console.log("here")
  const countryResponses = ships.map(async (ship) => {
    if (!lastShipIds.has(ship.SHIP_ID)) {
      const response = await fetch(baseUrl + "search/searchAsset?what=vessel&term=" + ship.IMO, { headers }).then((res) => res.json());
      const countryCode = response[0].desc.replace(ship.SHIPNAME, "").substring(2, 4);
      return `${ship.TYPE_SUMMARY} ship ${emoji.get(`flag-${countryCode.toLowerCase()}`)}${ship.SHIPNAME} is ${ship.MOVE_TYPE_NAME === "ARRIVAL" ? "arriving" : "departing"}`;
    }
  });

  const countryCodes = await Promise.all(countryResponses);
  console.log(countryCodes);

  return new Response(JSON.stringify(countryCodes), {
    headers: { 'content-type': 'text/json' },
  });
}