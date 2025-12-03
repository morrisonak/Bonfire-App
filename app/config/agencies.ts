import type { Agency, AgencyCategory } from "~/lib/types";

export const agencies: Agency[] = [
  // Federal/State Agencies
  {
    name: "Texas Department of Transportation",
    apiUrl: "https://txdot.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://txdot.bonfirehub.com/opportunities/",
    category: "state",
  },
  {
    name: "Washington State Department of Enterprise Services",
    apiUrl: "https://deswa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://deswa.bonfirehub.com/opportunities/",
    category: "state",
  },
  {
    name: "Utah Public Procurement Place (U3P)",
    apiUrl: "https://utah.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://utah.bonfirehub.com/opportunities/",
    category: "state",
  },
  {
    name: "Delaware Office of Management and Budget",
    apiUrl: "https://gss.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://gss.bonfirehub.com/opportunities/",
    category: "state",
  },
  {
    name: "Texas Workforce Commission",
    apiUrl: "https://twc-texas-gov.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://twc-texas-gov.bonfirehub.com/opportunities/",
    category: "state",
  },

  // Counties
  {
    name: "Harris County, TX",
    apiUrl: "https://harriscountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://harriscountytx.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Galveston County, TX",
    apiUrl: "https://galvestoncountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://galvestoncountytx.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Suffolk County, NY",
    apiUrl: "https://suffolkcountyny.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://suffolkcountyny.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Boulder County, CO",
    apiUrl: "https://bouldercounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bouldercounty.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Walker County, TX",
    apiUrl: "https://co-walker-tx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://co-walker-tx.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Columbia County, GA",
    apiUrl: "https://columbiacountyga.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://columbiacountyga.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Williamson County, TX",
    apiUrl: "https://wilco.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://wilco.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "County of Sussex",
    apiUrl: "https://sussex.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sussex.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "County of Wake, NC",
    apiUrl: "https://wake.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://wake.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Cook County, IL",
    apiUrl: "https://cookcountyil.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cookcountyil.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Johnson County, TX",
    apiUrl: "https://johnsoncountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://johnsoncountytx.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Montgomery County, PA",
    apiUrl: "https://montcopa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://montcopa.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Brazoria County, TX",
    apiUrl: "https://brazoriacounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://brazoriacounty.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Fairfax County, VA",
    apiUrl: "https://fairfaxcounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://fairfaxcounty.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Ventura County, CA",
    apiUrl: "https://ventura.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ventura.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Chatham County, GA",
    apiUrl: "https://chathamcountyga.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://chathamcountyga.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Broward County, FL",
    apiUrl: "https://broward.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://broward.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Milwaukee County, WI",
    apiUrl: "https://countymilwaukee.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://countymilwaukee.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Pinal County, AZ",
    apiUrl: "https://pinalcountyaz.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://pinalcountyaz.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Hillsborough County, FL",
    apiUrl: "https://hillsboroughcounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://hillsboroughcounty.bonfirehub.com/opportunities/",
    category: "county",
  },
  {
    name: "Los Alamos County, NM",
    apiUrl: "https://losalamosnm.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://losalamosnm.bonfirehub.com/opportunities/",
    category: "county",
  },

  // Cities
  {
    name: "Charlotte, NC",
    apiUrl: "https://charlottenc.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://charlottenc.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Alpharetta, GA",
    apiUrl: "https://cityofalpharetta.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cityofalpharetta.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Dallas, TX",
    apiUrl: "https://dallascityhall.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://dallascityhall.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Fort Worth, TX",
    apiUrl: "https://fortworthtexas.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://fortworthtexas.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "Paradise Valley, AZ",
    apiUrl: "https://paradisevalleyaz.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://paradisevalleyaz.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Waco, TX",
    apiUrl: "https://waco-texas.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://waco-texas.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Burleson, TX",
    apiUrl: "https://burlesontx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://burlesontx.bonfirehub.com/opportunities/",
    category: "city",
  },
  {
    name: "City of Ocoee, FL",
    apiUrl: "https://ocoee.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ocoee.bonfirehub.com/opportunities/",
    category: "city",
  },

  // Universities/Educational Institutions
  {
    name: "University of Massachusetts",
    apiUrl: "https://umass.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://umass.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "NC State University",
    apiUrl: "https://ncsu.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ncsu.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Rice University, TX",
    apiUrl: "https://rice-edu.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://rice-edu.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Bridgewater State University",
    apiUrl: "https://bridgew.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bridgew.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Southern Oregon University",
    apiUrl: "https://sou.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sou.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "University of Texas Rio Grande Valley",
    apiUrl: "https://utrgv.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://utrgv.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Chicago Public Schools",
    apiUrl: "https://cps.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cps.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Douglas County School System, GA",
    apiUrl: "https://dcssga.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://dcssga.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Education Service Center Region 10, TX",
    apiUrl: "https://region10.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://region10.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Florida Gulf Coast University",
    apiUrl: "https://fgcu.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://fgcu.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "San Antonio Independent School District",
    apiUrl: "https://saisd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://saisd.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Cobb County School District",
    apiUrl: "https://cobbk12.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cobbk12.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Fort Bend Independent School District",
    apiUrl: "https://fortbendisd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://fortbendisd.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Anaheim Union High School District",
    apiUrl: "https://auhsd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://auhsd.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "School District U-46",
    apiUrl: "https://u-46.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://u-46.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Richardson Independent School District",
    apiUrl: "https://risd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://risd.bonfirehub.com/opportunities/",
    category: "university",
  },
  {
    name: "Rockdale County School District",
    apiUrl: "https://rockdaleschools.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://rockdaleschools.bonfirehub.com/opportunities/",
    category: "university",
  },

  // Healthcare Systems
  {
    name: "University Health",
    apiUrl: "https://universityhealth.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://universityhealth.bonfirehub.com/opportunities/",
    category: "healthcare",
  },

  // Transportation/Transit Authorities
  {
    name: "Metra",
    apiUrl: "https://metra.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://metra.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "SMART",
    apiUrl: "https://sonomamarintrain.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sonomamarintrain.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "Metropolitan Transit Authority of Harris County (METRO)",
    apiUrl: "https://ridemetro.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ridemetro.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "Trinity Metro",
    apiUrl: "https://ridetm.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ridetm.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "Tri-Rail",
    apiUrl: "https://tri-rail.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://tri-rail.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "San Francisco Bay Area Water Emergency Transportation Authority (WETA)",
    apiUrl: "https://weta.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://weta.bonfirehub.com/opportunities/",
    category: "transit",
  },
  {
    name: "Pinellas Suncoast Transit Authority",
    apiUrl: "https://psta.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://psta.bonfirehub.com/opportunities/",
    category: "transit",
  },

  // Utilities/Water/Power Authorities
  {
    name: "Long Island Power Authority",
    apiUrl: "https://lipower.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://lipower.bonfirehub.com/opportunities/",
    category: "utility",
  },
  {
    name: "Eastern Municipal Water District",
    apiUrl: "https://emwd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://emwd.bonfirehub.com/opportunities/",
    category: "utility",
  },
  {
    name: "Beaufort-Jasper Water & Sewer Authority",
    apiUrl: "https://bjwsa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bjwsa.bonfirehub.com/opportunities/",
    category: "utility",
  },
  {
    name: "Great Lakes Water Authority",
    apiUrl: "https://glwater.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://glwater.bonfirehub.com/opportunities/",
    category: "utility",
  },
  {
    name: "Clayton County Water Authority",
    apiUrl: "https://ccwa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ccwa.bonfirehub.com/opportunities/",
    category: "utility",
  },

  // Regional Planning/Development Agencies
  {
    name: "Housing Authority Prince George's County",
    apiUrl: "https://hapgcprocurement.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://hapgcprocurement.bonfirehub.com/opportunities/",
    category: "regional",
  },
  {
    name: "Kentuckiana Regional Planning & Development Agency (KIPDA)",
    apiUrl: "https://kipda.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://kipda.bonfirehub.com/opportunities/",
    category: "regional",
  },
  {
    name: "MRSC Rosters - Municipal Research and Services Center",
    apiUrl: "https://mrscrosters.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://mrscrosters.bonfirehub.com/opportunities/",
    category: "regional",
  },
  {
    name: "PennBid (Pennsylvania)",
    apiUrl: "https://pennbid.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://pennbid.bonfirehub.com/opportunities/",
    category: "regional",
  },

  // International Governments
  {
    name: "Cayman Islands Government",
    apiUrl: "https://cayman.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cayman.bonfirehub.com/opportunities/",
    category: "international",
  },
  {
    name: "Barbados Government",
    apiUrl: "https://gov-bb.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://gov-bb.bonfirehub.com/opportunities/",
    category: "international",
  },
];

export const categoryLabels: Record<AgencyCategory, string> = {
  federal: "Federal Agencies",
  state: "State Agencies",
  county: "Counties",
  city: "Cities",
  university: "Universities & Schools",
  healthcare: "Healthcare Systems",
  transit: "Transportation & Transit",
  utility: "Utilities & Power",
  regional: "Regional Agencies",
  international: "International",
};
