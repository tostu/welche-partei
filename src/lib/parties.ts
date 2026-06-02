import afd from '$lib/images/party_logos/afd.svg';
import bsw from '$lib/images/party_logos/bsw.svg';
import cdu from '$lib/images/party_logos/cdu.svg';
import die_linke from '$lib/images/party_logos/die_linke.svg';
import fdp from '$lib/images/party_logos/fdp.svg';
import gruene from '$lib/images/party_logos/gruene.svg';
import sdp from '$lib/images/party_logos/sdp.svg';
import volt from '$lib/images/party_logos/volt.svg';
import freie_waehler from '$lib/images/party_logos/freie_waehler.svg';
import tierschutzpartei from '$lib/images/party_logos/tierschutzpartei.svg';
import oedp from '$lib/images/party_logos/oedp.svg';
import piratenpartei from '$lib/images/party_logos/piratenpartei.svg';

export const parties = [
	{
		name: 'AFD',
		logo: afd
	},
	{
		name: 'BSW',
		logo: bsw
	},
	{
		name: 'CDU',
		logo: cdu
	},
	{
		name: 'Die Linke',
		logo: die_linke
	},
	{
		name: 'FDP',
		logo: fdp
	},
	{
		name: 'Die Grünen',
		logo: gruene
	},
	{
		name: 'SPD',
		logo: sdp
	},
	{
		name: 'Volt',
		logo: volt
	},
	{
		name: 'Freie Wähler',
		logo: freie_waehler
	},
	{
		name: 'Tierschutzpartei',
		logo: tierschutzpartei
	},
	{
		name: 'ÖDP',
		logo: oedp
	},
	{
		name: 'Piratenpartei',
		logo: piratenpartei
	}
] as const;

// Typen für Parteien
export type Party = (typeof parties)[number]['name'];
export type PartyData = (typeof parties)[number];
