import { getDb } from "../server/queries/connection";
import {
  settings,
  heroSlides,
  aboutOwner,
  timeline,
  services,
  gallery,
  reviews,
  seoPages,
  offers,
} from "./schema";

async function seed() {
  const db = getDb();

  console.log("Seeding database...");

  // ─── Settings ─────────────────────────────────────────────────────────────
  const defaultSettings = [
    { key: "siteName", value: "Mamta Makeover" },
    { key: "tagline", value: "Where Beauty Meets Artistry" },
    { key: "phone", value: "+1 (555) 234-5678" },
    { key: "whatsapp", value: "+15552345678" },
    { key: "email", value: "hello@mamtamakeover.com" },
    { key: "address", value: "123 Luxury Lane, Beverly Hills, CA 90210" },
    { key: "workingHours", value: "Mon-Sat: 9AM - 8PM | Sunday: 10AM - 6PM" },
    { key: "instagram", value: "https://instagram.com/mamtamakeover" },
    { key: "facebook", value: "https://facebook.com/mamtamakeover" },
    { key: "youtube", value: "https://youtube.com/@mamtamakeover" },
    { key: "pinterest", value: "https://pinterest.com/mamtamakeover" },
    { key: "googleMap", value: "https://maps.google.com/?q=Beverly+Hills+CA" },
    { key: "logo", value: "/logo.png" },
    { key: "favicon", value: "/favicon.ico" },
    { key: "copyright", value: "2026 Mamta Makeover. All rights reserved." },
    { key: "developerCredit", value: "Developed by KT" },
    { key: "developerContact", value: "https://kt.digitalwaveitsolution.online" },
    { key: "bookingUrl", value: "https://wa.me/15552345678" },
  ];

  for (const s of defaultSettings) {
    await db
      .insert(settings)
      .values(s)
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: s.value },
      });
  }
  console.log("Settings seeded");

  // ─── Hero Slides ──────────────────────────────────────────────────────────
  await db.insert(heroSlides).values([
    {
      type: "image",
      mediaUrl: "/hero/hero-1.jpg",
      title: "Mamta Makeover",
      subtitle: "Where Beauty Meets Artistry. Premium Makeup Services for Every Occasion.",
      buttonText: "Book Appointment",
      buttonLink: "#contact",
      secondaryButtonText: "Explore Services",
      secondaryButtonLink: "#services",
      overlayOpacity: 60,
      sortOrder: 1,
      isActive: true,
    },
    {
      type: "image",
      mediaUrl: "/hero/hero-2.jpg",
      title: "Bridal Glamour",
      subtitle: "Transform into the most beautiful version of yourself on your special day.",
      buttonText: "Book Bridal",
      buttonLink: "#contact",
      secondaryButtonText: "View Gallery",
      secondaryButtonLink: "#gallery",
      overlayOpacity: 60,
      sortOrder: 2,
      isActive: true,
    },
    {
      type: "image",
      mediaUrl: "/hero/hero-3.jpg",
      title: "Runway Ready",
      subtitle: "Fashion-forward looks for editorial, runway, and special events.",
      buttonText: "Get The Look",
      buttonLink: "#contact",
      overlayOpacity: 60,
      sortOrder: 3,
      isActive: true,
    },
  ]);
  console.log("Hero slides seeded");

  // ─── About Owner ──────────────────────────────────────────────────────────
  await db.insert(aboutOwner).values({
    name: "Mamta",
    title: "Founder & Lead Makeup Artist",
    photoUrl: "/about/owner.jpg",
    bio: "With over 12 years of experience in luxury beauty and makeup artistry, I have dedicated my career to helping clients discover their most confident selves. Trained under world-renowned artists in Paris and Milan, I bring international expertise to every brushstroke.",
    experience: "12+ Years",
    mission: "To empower every individual through the transformative art of makeup, creating looks that enhance natural beauty while reflecting personal style.",
    vision: "To be the most sought-after luxury makeup studio, known for artistry that transcends trends and creates timeless beauty.",
    achievements: ["500+ Bridal Makeovers", "Featured in Vogue Magazine", "Celebrity Makeup Artist", "International Beauty Awards Winner"],
    certificates: ["MAC Pro Certification", "Bobbi Brown Master Class", "Charlotte Tilbury Academy", "HD Makeup Specialist"],
    awards: ["Best Bridal Makeup Artist 2025", "Luxury Beauty Excellence Award", "Top 10 Makeup Artists - Hollywood"],
    isActive: true,
  });
  console.log("About owner seeded");

  // ─── Timeline ─────────────────────────────────────────────────────────────
  await db.insert(timeline).values([
    { year: "2014", title: "Started Career", description: "Began journey at MAC Cosmetics flagship store", icon: "star", sortOrder: 1, isActive: true },
    { year: "2016", title: "First Bridal Client", description: "Transformed my first bride and discovered my true passion", icon: "heart", sortOrder: 2, isActive: true },
    { year: "2018", title: "Paris Training", description: "Trained under legendary artists in Paris and Milan", icon: "plane", sortOrder: 3, isActive: true },
    { year: "2020", title: "Studio Launch", description: "Opened the first Mamta Makeover studio in Beverly Hills", icon: "home", sortOrder: 4, isActive: true },
    { year: "2023", title: "Vogue Feature", description: "Featured in Vogue's Top Makeup Artists to Watch", icon: "award", sortOrder: 5, isActive: true },
    { year: "2025", title: "1000th Client", description: "Celebrated a milestone of 1000+ happy clients", icon: "users", sortOrder: 6, isActive: true },
  ]);
  console.log("Timeline seeded");

  // ─── Services ─────────────────────────────────────────────────────────────
  await db.insert(services).values([
    {
      name: "Bridal Makeup",
      slug: "bridal-makeup",
      shortDescription: "Flawless, long-lasting bridal glamour for your special day",
      description: "Our signature bridal makeup service is designed to make you look and feel absolutely radiant on your wedding day. Using premium, long-lasting products, we create a customized look that photographs beautifully and stays flawless from ceremony to reception.",
      imageUrl: "/services/bridal.jpg",
      price: "350.00",
      duration: "2-3 hours",
      category: "Bridal",
      benefits: ["HD Photoshoot-Ready Finish", "Waterproof & Long-Lasting", "Bridal Trial Included", "Touch-up Kit Provided"],
      preparation: "Please arrive with clean, moisturized face. Avoid heavy skincare 24 hours prior.",
      afterCare: "Use gentle cleanser. Avoid touching face. Touch-up kit included for emergencies.",
      faqs: [{ question: "Do you offer trials?", answer: "Yes! A bridal trial is included in your package." }],
      sortOrder: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Party Glam",
      slug: "party-glam",
      shortDescription: "Stunning evening and party makeup looks",
      description: "Turn heads at your next event with our Party Glam service. From subtle sophistication to bold and dramatic, we create the perfect look for any celebration.",
      imageUrl: "/services/party.jpg",
      price: "150.00",
      duration: "1 hour",
      category: "Party",
      benefits: ["Smudge-Proof Application", "Custom Color Matching", "Long-Wear Formula", "Lashes Included"],
      sortOrder: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Editorial Makeup",
      slug: "editorial-makeup",
      shortDescription: "High-fashion looks for photoshoots and runway",
      description: "Editorial and fashion-forward makeup for magazine shoots, runway shows, and creative projects. Bold, artistic, and camera-ready.",
      imageUrl: "/services/editorial.jpg",
      price: "400.00",
      duration: "2-3 hours",
      category: "Fashion",
      benefits: ["HD Camera-Ready", "Creative Direction", "Full Product Kit", "On-Set Touch-ups"],
      sortOrder: 3,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Natural Everyday",
      slug: "natural-everyday",
      shortDescription: "Effortless, natural beauty enhancement",
      description: "Enhance your natural beauty with a fresh, dewy look perfect for everyday wear, interviews, or casual events.",
      imageUrl: "/services/natural.jpg",
      price: "100.00",
      duration: "45 min",
      category: "Daily",
      benefits: ["Skin-Like Finish", "Lightweight Formula", "Quick Application", "Natural Glow"],
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "Special Effects",
      slug: "special-effects",
      shortDescription: "Creative SFX makeup for events and productions",
      description: "Transformative special effects makeup for Halloween, themed events, film, and theater productions.",
      imageUrl: "/services/sfx.jpg",
      price: "300.00",
      duration: "2-4 hours",
      category: "Creative",
      benefits: ["Professional Grade Products", "Custom Design", "Safe Removal", "Long-Lasting"],
      sortOrder: 5,
      isActive: true,
    },
    {
      name: "Makeup Lessons",
      slug: "makeup-lessons",
      shortDescription: "One-on-one makeup masterclasses",
      description: "Learn professional techniques in personalized one-on-one sessions. From everyday basics to advanced contouring.",
      imageUrl: "/services/lessons.jpg",
      price: "200.00",
      duration: "2 hours",
      category: "Education",
      benefits: ["Personalized Curriculum", "Take-Home Notes", "Product Recommendations", "Hands-On Practice"],
      sortOrder: 6,
      isActive: true,
    },
  ]);
  console.log("Services seeded");

  // ─── Gallery ──────────────────────────────────────────────────────────────
  await db.insert(gallery).values([
    { imageUrl: "/gallery/bridal-1.jpg", category: "Bridal", title: "Elegant Bridal", clientName: "Sarah M.", sortOrder: 1, isActive: true },
    { imageUrl: "/gallery/bridal-2.jpg", category: "Bridal", title: "Royal Bridal", clientName: "Emma L.", sortOrder: 2, isActive: true },
    { imageUrl: "/gallery/party-1.jpg", category: "Party", title: "Glam Night", clientName: "Jessica K.", sortOrder: 3, isActive: true },
    { imageUrl: "/gallery/party-2.jpg", category: "Party", title: "Evening Elegance", clientName: "Olivia R.", sortOrder: 4, isActive: true },
    { imageUrl: "/gallery/fashion-1.jpg", category: "Fashion", title: "Runway Gold", sortOrder: 5, isActive: true },
    { imageUrl: "/gallery/fashion-2.jpg", category: "Fashion", title: "Editorial Red", sortOrder: 6, isActive: true },
    { imageUrl: "/gallery/natural-1.jpg", category: "Natural", title: "Fresh Glow", clientName: "Amanda T.", sortOrder: 7, isActive: true },
    { imageUrl: "/gallery/sfx-1.jpg", category: "Creative", title: "Fantasy Look", sortOrder: 8, isActive: true },
  ]);
  console.log("Gallery seeded");

  // ─── Reviews ──────────────────────────────────────────────────────────────
  await db.insert(reviews).values([
    { name: "Sarah Mitchell", email: "sarah@example.com", rating: 5, comment: "Absolutely stunning work! Mamta made me feel like a princess on my wedding day. The makeup lasted all day and looked incredible in photos.", status: "approved", isPinned: true },
    { name: "Emma Lewis", email: "emma@example.com", rating: 5, comment: "The attention to detail is unmatched. I've never felt more beautiful. Highly recommend for any special occasion!", status: "approved", isPinned: true },
    { name: "Jessica Kim", email: "jessica@example.com", rating: 5, comment: "Professional, talented, and so kind. Mamta understood exactly what I wanted and delivered beyond expectations.", status: "approved" },
    { name: "Olivia Rodriguez", email: "olivia@example.com", rating: 4, comment: "Amazing experience! The studio is gorgeous and the service is top-notch. Will definitely be coming back.", status: "approved" },
    { name: "Amanda Torres", email: "amanda@example.com", rating: 5, comment: "I've been to many makeup artists but Mamta is truly in a league of her own. The luxury experience is worth every penny.", status: "approved" },
    { name: "Rachel Green", email: "rachel@example.com", rating: 5, comment: "My bridal trial was incredible. Mamta took the time to understand my vision and created the perfect look.", status: "approved" },
  ]);
  console.log("Reviews seeded");

  // ─── SEO Pages ────────────────────────────────────────────────────────────
  await db.insert(seoPages).values([
    {
      page: "home",
      metaTitle: "Mamta Makeover | Premium Makeup Artist in Beverly Hills",
      metaDescription: "Luxury makeup artistry by Mamta Makeover. Bridal, editorial, party makeup & more. Book your transformation today.",
      metaKeywords: "makeup artist, bridal makeup, luxury beauty, Beverly Hills, editorial makeup",
      ogTitle: "Mamta Makeover",
      ogDescription: "Where Beauty Meets Artistry. Premium Makeup Services.",
    },
    {
      page: "about",
      metaTitle: "About Us | Mamta Makeover - Professional Makeup Artist",
      metaDescription: "Meet Mamta, award-winning makeup artist with 12+ years of experience in luxury beauty.",
    },
    {
      page: "services",
      metaTitle: "Services | Mamta Makeover - Makeup Services",
      metaDescription: "Explore our premium makeup services: bridal, party, editorial, SFX, and personal makeup lessons.",
    },
    {
      page: "gallery",
      metaTitle: "Portfolio Gallery | Mamta Makeover",
      metaDescription: "Browse our stunning makeup portfolio. Bridal, party, fashion, and creative makeup transformations.",
    },
    {
      page: "contact",
      metaTitle: "Contact | Mamta Makeover - Book Your Appointment",
      metaDescription: "Book your makeup appointment with Mamta Makeover. Call, WhatsApp, or fill out our contact form.",
    },
  ]);
  console.log("SEO pages seeded");

  // ─── Offers ───────────────────────────────────────────────────────────────
  await db.insert(offers).values([
    {
      title: "Bridal Package Special",
      description: "Book your bridal makeup and get a FREE trial session + touch-up kit worth $150!",
      imageUrl: "/offers/bridal-offer.jpg",
      discountPercent: 20,
      couponCode: "BRIDE20",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      ctaText: "Claim Offer",
      ctaLink: "#contact",
      terms: "Valid for bookings made 3+ months in advance. Non-transferable.",
      isActive: true,
    },
    {
      title: "Party Season Deal",
      description: "Book party glam for you and 3 friends, get 15% off the total!",
      imageUrl: "/offers/party-offer.jpg",
      discountPercent: 15,
      couponCode: "PARTY15",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      ctaText: "Book Now",
      ctaLink: "#contact",
      terms: "Minimum 4 people. Valid for evening appointments only.",
      isActive: true,
    },
  ]);
  console.log("Offers seeded");

  console.log("Database seeding complete!");
}

seed().catch(console.error);
