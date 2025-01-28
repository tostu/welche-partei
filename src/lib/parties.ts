import afd from "$lib/images/party_logos/afd.svg"
import bsw from "$lib/images/party_logos/bsw.svg"
import cdu from "$lib/images/party_logos/cdu.svg"
import die_linke from "$lib/images/party_logos/die_linke.svg"
import fdp from "$lib/images/party_logos/fdp.svg"
import gruene from "$lib/images/party_logos/gruene.svg"
import sdp from "$lib/images/party_logos/sdp.svg"

export const parties = [
    {
        name: "AFD",
        logo: afd,
    },
    {
        name: "BSW",
        logo: bsw,
    },
    {
        name: "CDU",
        logo: cdu,
    },
    {
        name: "Die Linke",
        logo: die_linke,
    },
    {
        name: "FDP",
        logo: fdp,
    },
    {
        name: "Die Grünen",
        logo: gruene,
    },
    {
        name: "SPD",
        logo: sdp,
    },
] as const;

// Typen für Parteien
export type Party = (typeof parties)[number]["name"];
export type PartyData = (typeof parties)[number];