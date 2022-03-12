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
  const lastShipIds = new Set(JSON.parse((await cargo_van.get("lastShipIds")) ?? "[]")); // populate from last run

  console.log("here")
  const countryResponses = ships.map(async (ship) => {
    if (!lastShipIds.has(ship.IMO)) {
      const response = await fetch(baseUrl + "search/searchAsset?what=vessel&term=" + ship.IMO, { headers }).then((res) => res.json());
      const countryCode = response[0].desc.replace(ship.SHIPNAME, "").substring(2, 4);
      return `${ship.TYPE_SUMMARY} ship ${flags[countryCode]} ${ship.SHIPNAME} is ${ship.MOVE_TYPE_NAME === "ARRIVAL" ? "arriving" : "departing"}`;
    }
  });

  const countryCodes = (await Promise.all(countryResponses)).filter((a) => a);

  await cargo_van.put("lastShipIds", JSON.stringify(ships.map((ship) => ship.IMO)));

  return new Response(JSON.stringify(countryCodes), {
    headers: { 'content-type': 'text/json' },
  });
}

const flags = {
  AC: "🇦🇨", AD: "🇦🇩", AE: "🇦🇪", AF: "🇦🇫", AG: "🇦🇬", AI: "🇦🇮", AL: "🇦🇱", AM: "🇦🇲", AO: "🇦🇴", AQ: "🇦🇶", AR: "🇦🇷", AS: "🇦🇸", AT: "🇦🇹", AU: "🇦🇺", AW: "🇦🇼", AX: "🇦🇽",
  AZ: "🇦🇿", BA: "🇧🇦", BB: "🇧🇧", BD: "🇧🇩", BE: "🇧🇪", BF: "🇧🇫", BG: "🇧🇬", BH: "🇧🇭", BI: "🇧🇮", BJ: "🇧🇯", BL: "🇧🇱", BM: "🇧🇲", BN: "🇧🇳", BO: "🇧🇴", BQ: "🇧🇶", BR: "🇧🇷",
  BS: "🇧🇸", BT: "🇧🇹", BV: "🇧🇻", BW: "🇧🇼", BY: "🇧🇾", BZ: "🇧🇿", CA: "🇨🇦", CC: "🇨🇨", CD: "🇨🇩", CF: "🇨🇫", CG: "🇨🇬", CH: "🇨🇭", CI: "🇨🇮", CK: "🇨🇰", CL: "🇨🇱", CM: "🇨🇲",
  CN: "🇨🇳", CO: "🇨🇴", CP: "🇨🇵", CR: "🇨🇷", CU: "🇨🇺", CV: "🇨🇻", CW: "🇨🇼", CX: "🇨🇽", CY: "🇨🇾", CZ: "🇨🇿", DE: "🇩🇪", DG: "🇩🇬", DJ: "🇩🇯", DK: "🇩🇰", DM: "🇩🇲", DO: "🇩🇴",
  DZ: "🇩🇿", EA: "🇪🇦", EC: "🇪🇨", EE: "🇪🇪", EG: "🇪🇬", EH: "🇪🇭", ER: "🇪🇷", ES: "🇪🇸", ET: "🇪🇹", EU: "🇪🇺", FI: "🇫🇮", FJ: "🇫🇯", FK: "🇫🇰", FM: "🇫🇲", FO: "🇫🇴", FR: "🇫🇷",
  GA: "🇬🇦", GB: "🇬🇧", GD: "🇬🇩", GE: "🇬🇪", GF: "🇬🇫", GG: "🇬🇬", GH: "🇬🇭", GI: "🇬🇮", GL: "🇬🇱", GM: "🇬🇲", GN: "🇬🇳", GP: "🇬🇵", GQ: "🇬🇶", GR: "🇬🇷", GS: "🇬🇸", GT: "🇬🇹",
  GU: "🇬🇺", GW: "🇬🇼", GY: "🇬🇾", HK: "🇭🇰", HM: "🇭🇲", HN: "🇭🇳", HR: "🇭🇷", HT: "🇭🇹", HU: "🇭🇺", IC: "🇮🇨", ID: "🇮🇩", IE: "🇮🇪", IL: "🇮🇱", IM: "🇮🇲", IN: "🇮🇳", IO: "🇮🇴",
  IQ: "🇮🇶", IR: "🇮🇷", IS: "🇮🇸", IT: "🇮🇹", JE: "🇯🇪", JM: "🇯🇲", JO: "🇯🇴", JP: "🇯🇵", KE: "🇰🇪", KG: "🇰🇬", KH: "🇰🇭", KI: "🇰🇮", KM: "🇰🇲", KN: "🇰🇳", KP: "🇰🇵", KR: "🇰🇷",
  KW: "🇰🇼", KY: "🇰🇾", KZ: "🇰🇿", LA: "🇱🇦", LB: "🇱🇧", LC: "🇱🇨", LI: "🇱🇮", LK: "🇱🇰", LR: "🇱🇷", LS: "🇱🇸", LT: "🇱🇹", LU: "🇱🇺", LV: "🇱🇻", LY: "🇱🇾", MA: "🇲🇦", MC: "🇲🇨",
  MD: "🇲🇩", ME: "🇲🇪", MF: "🇲🇫", MG: "🇲🇬", MH: "🇲🇭", MK: "🇲🇰", ML: "🇲🇱", MM: "🇲🇲", MN: "🇲🇳", MO: "🇲🇴", MP: "🇲🇵", MQ: "🇲🇶", MR: "🇲🇷", MS: "🇲🇸", MT: "🇲🇹", MU: "🇲🇺",
  MV: "🇲🇻", MW: "🇲🇼", MX: "🇲🇽", MY: "🇲🇾", MZ: "🇲🇿", NA: "🇳🇦", NC: "🇳🇨", NE: "🇳🇪", NF: "🇳🇫", NG: "🇳🇬", NI: "🇳🇮", NL: "🇳🇱", NO: "🇳🇴", NP: "🇳🇵", NR: "🇳🇷", NU: "🇳🇺",
  NZ: "🇳🇿", OM: "🇴🇲", PA: "🇵🇦", PE: "🇵🇪", PF: "🇵🇫", PG: "🇵🇬", PH: "🇵🇭", PK: "🇵🇰", PL: "🇵🇱", PM: "🇵🇲", PN: "🇵🇳", PR: "🇵🇷", PS: "🇵🇸", PT: "🇵🇹", PW: "🇵🇼", PY: "🇵🇾",
  QA: "🇶🇦", RE: "🇷🇪", RO: "🇷🇴", RS: "🇷🇸", RU: "🇷🇺", RU: "🇷🇺", RW: "🇷🇼", SA: "🇸🇦", SB: "🇸🇧", SC: "🇸🇨", SD: "🇸🇩", SE: "🇸🇪", SG: "🇸🇬", SH: "🇸🇭", SI: "🇸🇮", SJ: "🇸🇯",
  SK: "🇸🇰", SL: "🇸🇱", SM: "🇸🇲", SN: "🇸🇳", SO: "🇸🇴", SR: "🇸🇷", SS: "🇸🇸", ST: "🇸🇹", SV: "🇸🇻", SX: "🇸🇽", SY: "🇸🇾", SZ: "🇸🇿", TA: "🇹🇦", TC: "🇹🇨", TD: "🇹🇩", TF: "🇹🇫",
  TG: "🇹🇬", TH: "🇹🇭", TJ: "🇹🇯", TK: "🇹🇰", TL: "🇹🇱", TM: "🇹🇲", TN: "🇹🇳", TO: "🇹🇴", TR: "🇹🇷", TT: "🇹🇹", TV: "🇹🇻", TW: "🇹🇼", TZ: "🇹🇿", UA: "🇺🇦", UG: "🇺🇬", UM: "🇺🇲",
  UN: "🇺🇳", US: "🇺🇸", US: "🇺🇸", UY: "🇺🇾", UZ: "🇺🇿", VA: "🇻🇦", VC: "🇻🇨", VE: "🇻🇪", VG: "🇻🇬", VI: "🇻🇮", VN: "🇻🇳", VU: "🇻🇺", WF: "🇼🇫", WS: "🇼🇸", XK: "🇽🇰", YE: "🇾🇪",
  YT: "🇾🇹", ZA: "🇿🇦", ZM: "🇿🇲", ZW: "🇿🇼"
}