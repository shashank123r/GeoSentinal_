"""
Disaster Metadata for xBD Dataset
Real disaster information including names, locations, dates, casualties, and descriptions
"""

DISASTER_METADATA = {
    "guatemala-volcano": {
        "name": "Fuego Volcano Eruption",
        "location": "Escuintla, Guatemala",
        "country": "Guatemala",
        "coordinates": [14.4730, -90.8810],
        "date": "2018-06-03",
        "casualties": 190,
        "displaced": 12000,
        "economic_loss": 0.5,  # in billions USD
        "description": "The Fuego volcano eruption in Guatemala caused devastating pyroclastic flows, burying entire communities and displacing thousands. Satellite imagery revealed extensive damage to infrastructure and agricultural land."
    },
    "hurricane-florence": {
        "name": "Hurricane Florence",
        "location": "North Carolina, USA",
        "country": "United States",
        "coordinates": [34.2257, -77.9447],
        "date": "2018-09-14",
        "casualties": 53,
        "displaced": 10000,
        "economic_loss": 24.2,
        "description": "Hurricane Florence made landfall as a Category 1 hurricane, causing catastrophic flooding across the Carolinas. Storm surge and rainfall led to widespread infrastructure damage and prolonged displacement."
    },
    "hurricane-harvey": {
        "name": "Hurricane Harvey",
        "location": "Houston, Texas, USA",
        "country": "United States",
        "coordinates": [29.7604, -95.3698],
        "date": "2017-08-25",
        "casualties": 107,
        "displaced": 30000,
        "economic_loss": 125.0,
        "description": "Hurricane Harvey was one of the costliest natural disasters in U.S. history, dropping over 60 inches of rain on Houston. Massive flooding affected over 300,000 structures and displaced tens of thousands."
    },
    "hurricane-matthew": {
        "name": "Hurricane Matthew",
        "location": "South Carolina, USA",
        "country": "United States",
        "coordinates": [32.0809, -81.0912],
        "date": "2016-10-08",
        "casualties": 49,
        "displaced": 5000,
        "economic_loss": 10.0,
        "description": "Hurricane Matthew caused severe flooding and wind damage across the southeastern United States, particularly affecting coastal communities in South Carolina and North Carolina."
    },
    "hurricane-michael": {
        "name": "Hurricane Michael",
        "location": "Florida Panhandle, USA",
        "country": "United States",
        "coordinates": [30.1588, -85.6602],
        "date": "2018-10-10",
        "casualties": 74,
        "displaced": 8000,
        "economic_loss": 25.1,
        "description": "Hurricane Michael intensified rapidly before making landfall as a Category 5 hurricane, the first to hit the continental U.S. since Hurricane Andrew in 1992. Catastrophic damage occurred across the Florida Panhandle."
    },
    "mexico-earthquake": {
        "name": "Puebla Earthquake",
        "location": "Mexico City, Mexico",
        "country": "Mexico",
        "coordinates": [19.4326, -99.1332],
        "date": "2017-09-19",
        "casualties": 370,
        "displaced": 250000,
        "economic_loss": 2.0,
        "description": "A magnitude 7.1 earthquake struck central Mexico on the anniversary of the devastating 1985 earthquake. Significant building collapses occurred in Mexico City, with over 40 buildings destroyed."
    },
    "midwest-flooding": {
        "name": "Midwest Floods",
        "location": "Nebraska, USA",
        "country": "United States",
        "coordinates": [41.2565, -95.9345],
        "date": "2019-03-13",
        "casualties": 4,
        "displaced": 2000,
        "economic_loss": 3.0,
        "description": "Historic flooding across the Midwest caused by rapid snowmelt and heavy rainfall. Agricultural losses were extensive, with thousands of homes and businesses affected."
    },
    "moore-tornado": {
        "name": "Moore Tornado",
        "location": "Moore, Oklahoma, USA",
        "country": "United States",
        "coordinates": [35.3395, -97.4866],
        "date": "2013-05-20",
        "casualties": 24,
        "displaced": 1500,
        "economic_loss": 2.0,
        "description": "An EF5 tornado struck Moore, Oklahoma, with winds exceeding 200 mph. The tornado destroyed entire neighborhoods and two elementary schools."
    },
    "palu-tsunami": {
        "name": "Sulawesi Earthquake and Tsunami",
        "location": "Palu, Indonesia",
        "country": "Indonesia",
        "coordinates": [-0.8917, 119.8707],
        "date": "2018-09-28",
        "casualties": 4340,
        "displaced": 206000,
        "economic_loss": 0.9,
        "description": "A magnitude 7.5 earthquake triggered a devastating tsunami and liquefaction in Palu, Indonesia. Entire neighborhoods were swept away or buried, making it one of the deadliest disasters of 2018."
    },
    "santa-rosa-wildfire": {
        "name": "Tubbs Fire",
        "location": "Santa Rosa, California, USA",
        "country": "United States",
        "coordinates": [38.4404, -122.7141],
        "date": "2017-10-08",
        "casualties": 22,
        "displaced": 90000,
        "economic_loss": 1.2,
        "description": "The Tubbs Fire was the most destructive wildfire in California history at the time, destroying over 5,600 structures in Santa Rosa and surrounding areas."
    },
    "socal-fire": {
        "name": "Southern California Wildfires",
        "location": "Los Angeles, California, USA",
        "country": "United States",
        "coordinates": [34.0522, -118.2437],
        "date": "2017-12-04",
        "casualties": 3,
        "displaced": 230000,
        "economic_loss": 2.2,
        "description": "Multiple wildfires burned simultaneously across Southern California, forcing mass evacuations. The Thomas Fire became the largest wildfire in modern California history."
    },
    "woolsey-fire": {
        "name": "Woolsey Fire",
        "location": "Malibu, California, USA",
        "country": "United States",
        "coordinates": [34.1331, -118.6897],
        "date": "2018-11-08",
        "casualties": 3,
        "displaced": 295000,
        "economic_loss": 6.0,
        "description": "The Woolsey Fire burned nearly 97,000 acres, destroying over 1,600 structures in Los Angeles and Ventura counties, including many celebrity homes in Malibu."
    },
    "lower-puna-volcano": {
        "name": "Kilauea Volcano Eruption",
        "location": "Lower Puna, Hawaii, USA",
        "country": "United States",
        "coordinates": [19.4969, -154.8144],
        "date": "2018-05-03",
        "casualties": 0,
        "displaced": 2000,
        "economic_loss": 0.8,
        "description": "The 2018 Kilauea eruption destroyed over 700 homes in the Lower Puna district. Lava flows covered residential areas and created new land as it reached the ocean."
    },
    "pinery-bushfire": {
        "name": "Pinery Bushfire",
        "location": "South Australia",
        "country": "Australia",
        "coordinates": [-34.9285, 138.6007],
        "date": "2015-11-25",
        "casualties": 2,
        "displaced": 500,
        "economic_loss": 0.1,
        "description": "The Pinery bushfire burned over 82,000 hectares in South Australia, destroying 86 homes and killing two people. It was one of the most destructive fires in South Australian history."
    },
    "portugal-wildfire": {
        "name": "Portugal Wildfires",
        "location": "Pedrógão Grande, Portugal",
        "country": "Portugal",
        "coordinates": [40.2033, -8.4103],
        "date": "2017-06-17",
        "casualties": 66,
        "displaced": 1000,
        "economic_loss": 0.3,
        "description": "A series of devastating wildfires swept through central Portugal during an extreme heatwave. The fires trapped and killed dozens of people fleeing in their vehicles."
    },
    "joplin-tornado": {
        "name": "Joplin Tornado",
        "location": "Joplin, Missouri, USA",
        "country": "United States",
        "coordinates": [37.0842, -94.5133],
        "date": "2011-05-22",
        "casualties": 161,
        "displaced": 8000,
        "economic_loss": 2.8,
        "description": "An EF5 tornado devastated Joplin, Missouri, killing 161 people and destroying a third of the city. It was the deadliest single tornado in the U.S. since 1947."
    },
    "tuscaloosa-tornado": {
        "name": "Tuscaloosa Tornado",
        "location": "Tuscaloosa, Alabama, USA",
        "country": "United States",
        "coordinates": [33.2098, -87.5692],
        "date": "2011-04-27",
        "casualties": 64,
        "displaced": 5000,
        "economic_loss": 2.4,
        "description": "Part of the 2011 Super Outbreak, an EF4 tornado carved a path of destruction through Tuscaloosa and Birmingham, Alabama, causing catastrophic damage."
    },
    "nepal-flooding": {
        "name": "Nepal Monsoon Floods",
        "location": "Kathmandu Valley, Nepal",
        "country": "Nepal",
        "coordinates": [27.7172, 85.3240],
        "date": "2017-08-11",
        "casualties": 123,
        "displaced": 35000,
        "economic_loss": 0.7,
        "description": "Severe monsoon flooding affected large parts of Nepal, India, and Bangladesh. In Nepal, flooding and landslides destroyed homes and infrastructure across multiple districts."
    }
}
