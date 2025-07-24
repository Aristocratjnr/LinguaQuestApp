import { db } from "./db";
import { users, characters } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // Create a default user
    const [user] = await db.insert(users).values({
      username: "learner",
      password: "password123"
    }).returning();
    
    console.log("Created user:", user.username);

    // Create Ghanaian characters for persuasion game
    const charactersData = [
      {
        name: "Kwame",
        role: "Traditional Elder",
        location: "Kumasi, Ghana",
        language: "Twi",
        personality: "Wise, traditional, values cultural customs, somewhat skeptical of modern ideas",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Kwame is a respected elder in Kumasi who deeply values Akan traditions. He often has strong opinions about modern vs traditional ways of life.",
        culturalTips: [
          "In Akan culture, respect for elders is paramount",
          "Traditional greetings involve asking about one's health and family",
          "Indirect communication is often preferred to maintain harmony"
        ],
        persuasionResistance: 70,
        currentStance: "Traditional ways are always better than modern approaches",
        isActive: true,
      },
      {
        name: "Ama",
        role: "University Student",
        location: "Accra, Ghana", 
        language: "Ga",
        personality: "Progressive, open-minded, environmentally conscious, eager to debate",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Ama studies environmental science at the University of Ghana. She's passionate about climate action but sometimes has controversial opinions.",
        culturalTips: [
          "Ga people value directness more than other Ghanaian cultures",
          "Academic discussions are highly valued in university settings",
          "Environmental consciousness is growing among young Ghanaians"
        ],
        persuasionResistance: 40,
        currentStance: "Technology will solve all environmental problems",
        isActive: true,
      },
      {
        name: "Togbe",
        role: "Chief",
        location: "Ho, Ghana",
        language: "Ewe",
        personality: "Diplomatic, thoughtful, believes in community consensus, moderate views",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Togbe is a traditional chief in the Volta Region who balances modern governance with traditional leadership. He values thoughtful discussion.",
        culturalTips: [
          "Ewe culture emphasizes community decision-making",
          "Chiefs are mediators who seek consensus",
          "Patience and careful listening are highly valued"
        ],
        persuasionResistance: 55,
        currentStance: "All important decisions should be made by community consensus",
        isActive: true,
      }
    ];

    for (const characterData of charactersData) {
      const [character] = await db.insert(characters).values(characterData).returning();
      console.log("Created character:", character.name);
    }

    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run if called directly (ES modules)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };