import { GoogleGenerativeAI } from "@google/generative-ai";

const RESPONSE_STRUCTURE =
  "## Relaxation & Heritage in Dhaka: A Detailed Itinerary\n" +
  "\n" +
  "This itinerary focuses on soaking up the atmosphere of Dhaka's old city, experiencing its rich heritage, and enjoying a relaxed pace. \n" +
  "\n" +
  "**Day 1: Arrival & Old Dhaka Exploration**\n" +
  "\n" +
  "* **Arrival:** Arrive at Hazrat Shahjalal International Airport (DAC).\n" +
  "* **Accommodation:** Check into a charming boutique hotel like the **Hotel The Peninsula** or **The Landmark Dhaka** located in the Old City for easy access to attractions.\n" +
  "* **Lunch:** Enjoy a delicious, traditional lunch at **Hotel Shahbagh** or **Chowdhury's** near your hotel.\n" +
  "* **Afternoon:** Explore the vibrant **Lalbagh Fort**, a magnificent Mughal-era fortress with a beautiful mosque and gardens.\n" +
  "* **Evening:** Take a relaxing **rickshaw ride** through the narrow lanes of Old Dhaka. Experience the bustling markets, the aroma of spices, and the vibrant street life.\n" +
  "* **Dinner:** Indulge in a traditional Bangladeshi dinner at **Star Kabab** known for its delicious grilled meats and curries.\n" +
  "\n" +
  "**Day 2: The Heart of Old Dhaka**\n" +
  "\n" +
  "* **Morning:** Visit the **Ahsan Manzil**, a beautiful 19th-century palace with fascinating history and impressive architecture.\n" +
  "* **Lunch:** Enjoy a light lunch at **Roshan's**, a popular spot for traditional Bengali snacks and sweets.\n" +
  "* **Afternoon:** Explore the bustling **Star Mosque**, an architectural masterpiece with its stunning colorful tiles and intricate designs.\n" +
  "* **Evening:** Relax and enjoy a traditional **Bengali tea** at a local tea stall and witness the city come alive at dusk.\n" +
  "* **Dinner:** Try the delicious fish and seafood at **Sixty-Four**, a restaurant renowned for its culinary excellence.\n" +
  "\n" +
  "**Day 3: Cultural Immersion & Relaxation**\n" +
  "\n" +
  "* **Morning:** Visit the **National Museum** to delve into Bangladesh's rich history and culture.\n" +
  "* **Lunch:** Enjoy a delectable lunch at **The Daily Star Restaurant**, known for its fusion of traditional and modern Bengali cuisine.\n" +
  "* **Afternoon:** Take a relaxing **boat ride** on the Buriganga River, enjoying the scenic views of the city.\n" +
  "* **Evening:** Experience the vibrant atmosphere of a traditional **Baul music performance** or visit **The Bangladesh Shilpakala Academy** for an artistic experience.\n" +
  "* **Dinner:** Savor a memorable dinner at **The Six Seasons**, a fine dining restaurant known for its exquisite ambience and international cuisine.\n" +
  "\n" +
  "**Day 4: Shopping & Departure**\n" +
  "\n" +
  "* **Morning:** Explore the vibrant **New Market**, a bustling marketplace with a wide variety of goods, from traditional garments to souvenirs.\n" +
  "* **Lunch:** Enjoy a light lunch at **The Coffee Bean & Tea Leaf** or **Cafe Ipanema** at one of the shopping malls.\n" +
  "* **Afternoon:** Relax at your hotel and reflect on your experience in Dhaka.\n" +
  "* **Evening:** Depart from Hazrat Shahjalal International Airport (DAC) with cherished memories of your relaxation and cultural journey.\n" +
  "\n" +
  "**Transportation:**\n" +
  "\n" +
  "* **Rickshaws:** The most common mode of transport in Old Dhaka for short distances.\n" +
  "* **CNGs (Compressed Natural Gas Auto-rickshaws):** Convenient and affordable for longer distances.\n" +
  "* **Taxis:** Available at most hotels and in the city center.\n" +
  "* **Bus:** A budget-friendly option for traveling within the city.\n" +
  "* **Boat:** Enjoy a relaxing boat ride on the Buriganga River for a unique perspective of the city.\n" +
  "\n" +
  "**Food Recommendations:**\n" +
  "\n" +
  '* **Breakfast:** Enjoy a traditional Bangladeshi breakfast of Luchi & Aloo Dom (fried bread and potato curry), or try the popular "Paratha" (layered flatbread).\n' +
  '* **Lunch:** Savor the delicious variety of rice dishes like "Biryani" or "Khichuri" accompanied by vegetables or fish curry.\n' +
  '* **Dinner:** Indulge in the diverse range of curries, fish preparations, and traditional street food like "Fuchka" and "Shingara" (spicy snacks).\n' +
  "\n" +
  "**Additional Tips:**\n" +
  "\n" +
  "* **Clothing:** Pack light cotton clothes as the weather in Dhaka can be hot and humid.\n" +
  "* **Bargaining:** Haggling is expected in the markets and street vendors.\n" +
  "* **Language:** Learn a few basic Bengali phrases to enhance your interaction with locals.\n" +
  "* **Safety:** Exercise caution in crowded areas and be aware of your surroundings.\n" +
  "* **Respect:** Be respectful of local customs and traditions, particularly when visiting religious sites.\n" +
  "* **Visa:** Check your visa requirements for Bangladesh based on your nationality.\n" +
  "\n" +
  "**Accommodation:**\n" +
  "\n" +
  "* **Boutique Hotels:** Hotel The Peninsula, The Landmark Dhaka, Hotel The Westin Dhaka\n" +
  "* **Budget Hotels:** Hotel The Shahbagh, Hotel The Sonargaon\n" +
  "\n" +
  "Enjoy your relaxed journey through the rich heritage of Dhaka! \n";

//Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getItinerary = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.log({ error });
  }
};

const buildPrompt = (requestPrompt) => {
  const { tarvelDays, travelDestination, travelType, extraDetails } =
    requestPrompt;

  let prompt = `Please create a detailed travel itinerary based on the following parameters:
  1. Travel Days: ${tarvelDays}
  2. Travel Destination: ${travelDestination}
  3. Travel Type: ${travelType}
  4. Extra Custom Information: ${extraDetails}
  
  I would like the itinerary to include the following details:
  - Daily activities and attractions to visit
  - Recommendations for meals (breakfast, lunch, and dinner)
  - Transportation options within the destination
  - Accommodation suggestions
  - Any additional tips or information relevant to the travel type and custom information provided

  Strictly keep the response structure like this ${RESPONSE_STRUCTURE}
  `;

  return prompt;
};

const itineraryToJSON = (itineraryStr) => {
  const itinerary = {
    title: "",
    description: "",
    days: [],
    transportation: [],
    foodRecommendations: [],
    additionalTips: [],
    accommodation: [],
    summary: null,
  };

  const lines = itineraryStr.split("\n");
  let currentDay = null;
  let currentSection = "";

  lines.forEach((line, index) => {
    line = line.trim();
    if (line.startsWith("## ")) {
      itinerary.title = line.replace("## ", "");
    } else if (index === 1) {
      itinerary.description = line;
    } else if (line.startsWith("**Day")) {
      if (currentDay) {
        itinerary.days.push(currentDay);
      }
      currentDay = {
        day: line.replace(/\*\*/g, ""),
        activities: [],
      };
      currentSection = "day";
    } else if (line.startsWith("* **") && currentSection === "day") {
      if (currentDay) {
        const lineContent = line.replace(/\*\*/g, "").replace("* ", "");
        const [name, description] = lineContent.split(":");
        currentDay.activities.push({
          name: name.trim(),
          description: description.trim(),
        });
      }
    } else if (line.startsWith("**Transportation:**")) {
      currentSection = "transportation";
    } else if (line.startsWith("**Food Recommendations:**")) {
      currentSection = "foodRecommendations";
    } else if (line.startsWith("**Additional Tips:**")) {
      currentSection = "additionalTips";
    } else if (line.startsWith("**Accommodation:**")) {
      currentSection = "accommodation";
    } else if (line.startsWith("* **") && currentSection === "transportation") {
      const lineContent = line.replace(/\*\*/g, "").replace("* ", "");
      const [name, description] = lineContent.split(":");
      itinerary.transportation.push({
        name: name.trim(),
        description: description.trim(),
      });
    } else if (
      line.startsWith("* **") &&
      currentSection === "foodRecommendations"
    ) {
      const lineContent = line.replace(/\*\*/g, "").replace("* ", "");
      const [name, description] = lineContent.split(":");
      itinerary.foodRecommendations.push({
        name: name.trim(),
        description: description.trim(),
      });
    } else if (line.startsWith("* ") && currentSection === "additionalTips") {
      const lineContent = line.replace(/\*\*/g, "").replace("* ", "");
      const [name, description] = lineContent.split(":");
      itinerary.additionalTips.push({
        name: name.trim(),
        description: description.trim(),
      });
    } else if (line.startsWith("* ") && currentSection === "accommodation") {
      const lineContent = line.replace(/\*\*/g, "").replace("* ", "");
      const [name, description] = lineContent.split(":");
      itinerary.accommodation.push({
        name: name.trim(),
        description: description.trim(),
      });
    }
  });

  if (currentDay) {
    itinerary.days.push(currentDay);
  }

  itinerary.summary = lines[lines.length - 1];

  return JSON.stringify(itinerary, null, 2);
};

export const queryGPT = async (requestPrompt) => {
  const prompt = buildPrompt(requestPrompt);
  const result = await getItinerary(prompt);
  const itineraryJSON = JSON.parse(itineraryToJSON(result));
  itineraryJSON.query = requestPrompt;
  return itineraryJSON;
};
