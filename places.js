import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

const apiKey = process.env.GOOGLE_PLACES_API; // Replace with your API key

const searchForImages = async (query) => {
  return new Promise(async (res, rej) => {
    try {
      const fetchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        query
      )}&inputtype=textquery&key=${apiKey}`;

      const response = await fetch(fetchUrl, {
        method: "POST",
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(
          `HTTP error fetching place id! status: ${response.status}`
        );
      }

      const results = await response.json();

      const placeId =
        response.candidates?.[0].place_id ?? results?.candidates?.[0].place_id;

      const detailsResponse = await client.placeDetails({
        params: {
          place_id: placeId,
          key: apiKey,
        },
      });

      const photos = detailsResponse.data.result.photos;
      if (photos && photos.length > 0) {
        const photoReference = photos[0].photo_reference;
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
        res(photoUrl);
      } else {
        res("");
      }
    } catch (error) {
      console.error(`Error fetching image for ${query}:`, error);
      res("");
    }
  });
};

export const fetchImagesForItinerary = async (itinerary) => {
  const promises = [];

  itinerary.days.map((day) => {
    for (const activity of day.activities) {
      promises.push(
        searchForImages(activity.description)
          .then((image) => {
            console.log("Fetching iamge for ", activity.name);
            activity.image = image; // Assign the fetched image to the activity
          })
          .catch((error) => {
            console.log(`Error fetching image for ${activity.name}:`, error);
          })
      );
    }
  });

  await Promise.all(promises);
  return itinerary;
};
