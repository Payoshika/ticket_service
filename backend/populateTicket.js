const mongoose = require("./database/mongoose");
const Ticket = require("./database/models/ticket");
const esClient = require("./elasticsearch"); // Adjust the path to your Elasticsearch client
// Connect to the database
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB...");

  try {
    // Clear existing tickets (optional)
    await Ticket.deleteMany({});
    console.log("Existing tickets cleared.");

    // Sample ticket data
    const sampleEvents = [
      {
        name: "Football Match: Team A vs Team B",
        description:
          "Watch an exciting football match between Team A and Team B at the National Stadium.",
      },
      {
        name: "Rock Concert: The Rolling Beats",
        description:
          "Experience an electrifying performance by The Rolling Beats at the City Arena.",
      },
      {
        name: "Art Exhibition: Modern Art Wonders",
        description:
          "Explore the latest modern art pieces at the Downtown Art Gallery.",
      },
      {
        name: "Tech Conference: Future of AI",
        description:
          "Join industry leaders to discuss the future of artificial intelligence at the Tech Hub.",
      },
      {
        name: "Movie Premiere: Galactic Adventures",
        description:
          "Be the first to watch the premiere of Galactic Adventures at the Grand Cinema.",
      },
      {
        name: "Cooking Workshop: Italian Cuisine",
        description:
          "Learn to cook authentic Italian dishes with Chef Mario at the Culinary School.",
      },
      {
        name: "Charity Run: Run for Hope",
        description:
          "Participate in a 5K charity run to support cancer research at Central Park.",
      },
      {
        name: "Stand-Up Comedy: Laugh Out Loud",
        description:
          "Enjoy a night of laughter with top comedians at the Comedy Club.",
      },
      {
        name: "Classical Music Concert: Symphony Night",
        description:
          "Relax to the soothing sounds of a live orchestra at the Opera House.",
      },
      {
        name: "Book Fair: Literary Fest 2025",
        description:
          "Discover new books and meet authors at the annual Literary Fest.",
      },
      {
        name: "Basketball Game: City Hawks vs River Sharks",
        description:
          "Cheer for your favorite team in an intense basketball game at the Sports Arena.",
      },
      {
        name: "Photography Workshop: Capturing Moments",
        description:
          "Learn photography techniques from professionals at the Downtown Studio.",
      },
      {
        name: "Yoga Retreat: Mind and Body Harmony",
        description:
          "Rejuvenate your mind and body with a weekend yoga retreat at the Wellness Center.",
      },
      {
        name: "Science Fair: Innovations of Tomorrow",
        description:
          "Explore groundbreaking innovations at the annual Science Fair.",
      },
      {
        name: "Wine Tasting: Vineyard Delights",
        description:
          "Savor the finest wines at the Vineyard Delights wine-tasting event.",
      },
      {
        name: "Theater Play: Shakespeare's Hamlet",
        description:
          "Experience the timeless classic Hamlet performed live at the City Theater.",
      },
      {
        name: "Marathon: City Challenge 2025",
        description:
          "Join thousands of runners in the City Challenge Marathon.",
      },
      {
        name: "Gaming Tournament: Battle Royale",
        description:
          "Compete with the best gamers in the Battle Royale tournament at the Gaming Hub.",
      },
      {
        name: "Fashion Show: Spring Collection",
        description:
          "Witness the latest trends in fashion at the Spring Collection show.",
      },
      {
        name: "Music Festival: Summer Beats",
        description:
          "Dance to the rhythm of live performances at the Summer Beats Music Festival.",
      },
      {
        name: "Chess Championship: Grandmaster Showdown",
        description:
          "Watch the world's best chess players compete in the Grandmaster Showdown.",
      },
      {
        name: "Cycling Event: Tour de City",
        description:
          "Join the cycling community for the annual Tour de City event.",
      },
      {
        name: "Magic Show: Illusions Unleashed",
        description:
          "Be amazed by mind-blowing illusions at the Illusions Unleashed magic show.",
      },
      {
        name: "Startup Pitch: Innovators' Night",
        description:
          "Support budding entrepreneurs as they pitch their ideas at Innovators' Night.",
      },
      {
        name: "Poetry Slam: Voices of the Heart",
        description:
          "Enjoy heartfelt poetry performances at the Voices of the Heart Poetry Slam.",
      },
      {
        name: "Beach Volleyball Tournament",
        description:
          "Watch thrilling beach volleyball matches at the Sunny Shores.",
      },
      {
        name: "Film Screening: Indie Film Night",
        description:
          "Discover unique indie films at the Indie Film Night screening.",
      },
      {
        name: "Cultural Festival: Colors of the World",
        description:
          "Celebrate diversity at the Colors of the World cultural festival.",
      },
      {
        name: "Robotics Expo: Future Machines",
        description:
          "Explore cutting-edge robotics technology at the Future Machines expo.",
      },
      {
        name: "Karaoke Night: Sing Your Heart Out",
        description:
          "Show off your singing skills at the Sing Your Heart Out karaoke night.",
      },
      {
        name: "Astronomy Night: Stargazing Event",
        description:
          "Discover the wonders of the universe at the Stargazing Event.",
      },
      {
        name: "Dance Workshop: Salsa Moves",
        description:
          "Learn the art of salsa dancing at the Salsa Moves workshop.",
      },
      {
        name: "Charity Gala: Night of Giving",
        description:
          "Support a noble cause at the Night of Giving charity gala.",
      },
      {
        name: "Coding Bootcamp: Full-Stack Basics",
        description:
          "Learn full-stack development basics at the Coding Bootcamp.",
      },
      {
        name: "Pet Adoption Fair: Find a Friend",
        description:
          "Meet adorable pets looking for a forever home at the adoption fair.",
      },
      {
        name: "Haunted House: Fright Night",
        description:
          "Experience spine-chilling thrills at the Fright Night haunted house.",
      },
      {
        name: "Ice Skating Show: Winter Wonderland",
        description:
          "Enjoy a magical ice skating performance at Winter Wonderland.",
      },
      {
        name: "Flower Show: Blooming Beauty",
        description:
          "Admire stunning floral displays at the Blooming Beauty flower show.",
      },
      {
        name: "History Tour: Ancient Secrets",
        description: "Uncover ancient secrets on a guided history tour.",
      },
      {
        name: "Fitness Bootcamp: Get in Shape",
        description: "Join a high-energy fitness bootcamp to get in shape.",
      },
      {
        name: "Language Workshop: Learn Spanish",
        description: "Learn basic Spanish phrases at the Language Workshop.",
      },
      {
        name: "Drone Racing: Sky Speed",
        description: "Watch high-speed drone racing at the Sky Speed event.",
      },
      {
        name: "Food Festival: Taste of the City",
        description:
          "Savor delicious dishes at the Taste of the City food festival.",
      },
      {
        name: "Meditation Session: Inner Peace",
        description: "Find your inner peace at the guided meditation session.",
      },
      {
        name: "Park Cleanup: Green Earth Day",
        description:
          "Join the community in cleaning up the park on Green Earth Day.",
      },
      {
        name: "Skiing Adventure: Snowy Peaks",
        description:
          "Hit the slopes for an exciting skiing adventure at Snowy Peaks.",
      },
      {
        name: "Board Game Night: Fun and Games",
        description:
          "Enjoy a night of fun with board games at the Community Center.",
      },
      {
        name: "Photography Contest: Capture the Moment",
        description:
          "Showcase your photography skills in the Capture the Moment contest.",
      },
      {
        name: "Startup Workshop: Build Your Idea",
        description:
          "Learn how to turn your idea into a startup at this workshop.",
      },
      {
        name: "Fishing Tournament: Reel It In",
        description:
          "Compete in the annual fishing tournament at the City Lake.",
      },
      {
        name: "Baking Class: Sweet Treats",
        description:
          "Learn to bake delicious desserts at the Sweet Treats baking class.",
      },
      {
        name: "Outdoor Movie Night: Under the Stars",
        description: "Watch a classic movie under the stars at the park.",
      },
      {
        name: "Trivia Night: Test Your Knowledge",
        description: "Compete in a fun trivia night at the local pub.",
      },
      {
        name: "Ballroom Dance Night: Elegance in Motion",
        description: "Dance the night away at the Ballroom Dance Night.",
      },
    ];

    // Generate 100 dummy tickets
    const tickets = [];
    for (let i = 0; i < 100; i++) {
      const event = sampleEvents[i % sampleEvents.length]; // Cycle through sample events
      tickets.push({
        issuer: new mongoose.Types.ObjectId(), // Replace with valid user IDs if needed
        issuerName: `User ${i + 1}`,
        name: event.name,
        description: event.description,
        status: i % 2 === 0 ? "open" : "closed", // Alternate between "open" and "closed"
        createdAt: new Date(),
      });
    }

    // Insert tickets into the database
    const insertedTickets = await Ticket.insertMany(tickets);
    console.log("100 tickets populated successfully in MongoDB.");

    // Index tickets into Elasticsearch
    for (const ticket of insertedTickets) {
      try {
        await esClient.index({
          index: "tickets", // Name of your Elasticsearch index
          id: ticket._id.toString(), // Use the MongoDB document ID as the Elasticsearch document ID
          body: {
            issuer: ticket.issuer,
            issuerName: ticket.issuerName,
            name: ticket.name,
            description: ticket.description,
            status: ticket.status,
            createdAt: ticket.createdAt,
          },
        });
        console.log(`Ticket indexed in Elasticsearch: ${ticket.name}`);
      } catch (error) {
        console.error(
          `Error indexing ticket in Elasticsearch: ${ticket.name}`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error populating tickets:", error);
  } finally {
    mongoose.connection.close();
  }
});
