import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Kidorly database...");

  // ─── Categories ──────────────────────────────────────────────────────────
  const strollers = await prisma.category.upsert({
    where: { slug: "strollers" },
    update: {},
    create: {
      slug: "strollers",
      nameEn: "Strollers",
      nameAr: "عربات أطفال",
      nameDe: "Kinderwagen",
      descriptionEn: "Premium strollers for comfort and safety",
      descriptionAr: "عربات أطفال فاخرة للراحة والأمان",
      descriptionDe: "Premium Kinderwagen für Komfort und Sicherheit",
      image: "https://images.unsplash.com/photo-1566004100477-7b3d6e801e78?w=400",
    },
  });

  const scooters = await prisma.category.upsert({
    where: { slug: "scooters" },
    update: {},
    create: {
      slug: "scooters",
      nameEn: "Scooters",
      nameAr: "سكوترات",
      nameDe: "Roller",
      descriptionEn: "Fun and safe scooters for kids",
      descriptionAr: "سكوترات ممتعة وآمنة للأطفال",
      descriptionDe: "Lustige und sichere Roller für Kinder",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400",
    },
  });

  const hoverboards = await prisma.category.upsert({
    where: { slug: "hoverboards" },
    update: {},
    create: {
      slug: "hoverboards",
      nameEn: "Hoverboards",
      nameAr: "هوفربورد",
      nameDe: "Hoverboards",
      descriptionEn: "Self-balancing hoverboards for adventure seekers",
      descriptionAr: "هوفربورد ذاتي التوازن لمحبي المغامرة",
      descriptionDe: "Selbstbalancierende Hoverboards für Abenteurer",
      image: "https://images.unsplash.com/photo-1621101668838-a1d8e1d02c42?w=400",
    },
  });

  const bouncers = await prisma.category.upsert({
    where: { slug: "baby-bouncers" },
    update: {},
    create: {
      slug: "baby-bouncers",
      nameEn: "Baby Bouncers",
      nameAr: "كراسي هزازة",
      nameDe: "Babywippen",
      descriptionEn: "Comfortable bouncers for babies",
      descriptionAr: "كراسي هزازة مريحة للأطفال",
      descriptionDe: "Bequeme Wippen für Babys",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
    },
  });

  const driftCars = await prisma.category.upsert({
    where: { slug: "drift-cars" },
    update: {},
    create: {
      slug: "drift-cars",
      nameEn: "Drift Cars",
      nameAr: "سيارات دريفت",
      nameDe: "Drift-Autos",
      descriptionEn: "Electric drift cars for thrill-seeking kids",
      descriptionAr: "سيارات دريفت كهربائية للأطفال",
      descriptionDe: "Elektrische Drift-Autos für Kinder",
      image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400",
    },
  });

  const beach = await prisma.category.upsert({
    where: { slug: "beach-summer" },
    update: {},
    create: {
      slug: "beach-summer",
      nameEn: "Beach & Summer",
      nameAr: "شاطئ وصيف",
      nameDe: "Strand & Sommer",
      descriptionEn: "Summer essentials for kids",
      descriptionAr: "أساسيات الصيف للأطفال",
      descriptionDe: "Sommer-Essentials für Kinder",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400",
    },
  });

  // ─── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "premium-travel-stroller",
      nameEn: "Premium Travel Stroller",
      nameAr: "عربة أطفال سفر فاخرة",
      nameDe: "Premium Reise-Kinderwagen",
      shortDescEn: "Lightweight and compact for traveling families",
      shortDescAr: "خفيفة ومضغوطة للعائلات المسافرة",
      shortDescDe: "Leicht und kompakt für reisende Familien",
      descriptionEn: "Our Premium Travel Stroller combines lightweight design with robust safety features. Perfect for navigating airports, hotels, and city streets. Features a one-hand fold mechanism, UV-protected canopy, and all-terrain wheels.",
      descriptionAr: "عربة السفر الفاخرة تجمع بين التصميم الخفيف ومميزات الأمان القوية. مثالية للتنقل في المطارات والفنادق وشوارع المدينة.",
      descriptionDe: "Unser Premium Reise-Kinderwagen vereint leichtes Design mit robusten Sicherheitsmerkmalen. Perfekt für Flughäfen, Hotels und Stadtstraßen.",
      price: 4500,
      compareAtPrice: 5500,
      discountPercentage: 15,
      featured: true,
      categoryId: strollers.id,
      images: ["https://images.unsplash.com/photo-1566004100477-7b3d6e801e78?w=600"],
      colors: ["Black", "Navy", "Gray"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "3-wheel-pro-scooter",
      nameEn: "3-Wheel Pro Scooter",
      nameAr: "سكوتر 3 عجلات برو",
      nameDe: "3-Rad Pro Roller",
      shortDescEn: "Adjustable height, LED wheels, ages 3-8",
      shortDescAr: "ارتفاع قابل للتعديل، عجلات LED، للأعمار 3-8",
      shortDescDe: "Verstellbare Höhe, LED-Räder, Alter 3-8",
      descriptionEn: "The 3-Wheel Pro Scooter features a sturdy aluminum deck, smooth-glide LED wheels that light up, and an adjustable handlebar for growing kids. Supports up to 50kg.",
      descriptionAr: "سكوتر 3 عجلات برو يتميز بقاعدة ألمنيوم متينة، عجلات LED مضيئة، ومقود قابل للتعديل.",
      descriptionDe: "Der 3-Rad Pro Roller verfügt über ein stabiles Aluminium-Deck, LED-Räder und einen verstellbaren Lenker.",
      price: 1200,
      compareAtPrice: 1500,
      featured: true,
      categoryId: scooters.id,
      images: ["https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600"],
      colors: ["Pink", "Blue", "Green"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "bluetooth-hoverboard-65",
      nameEn: "Bluetooth Hoverboard 6.5\"",
      nameAr: "هوفربورد بلوتوث 6.5 بوصة",
      nameDe: "Bluetooth Hoverboard 6,5\"",
      shortDescEn: "Self-balancing with Bluetooth speaker",
      shortDescAr: "ذاتي التوازن مع سماعة بلوتوث",
      shortDescDe: "Selbstbalancierend mit Bluetooth-Lautsprecher",
      descriptionEn: "Experience the thrill of riding with our 6.5\" Bluetooth Hoverboard. Features LED lights, built-in Bluetooth speaker, anti-slip footpads, and UL-certified battery.",
      descriptionAr: "استمتع بتجربة الركوب مع هوفربورد 6.5 بوصة بتقنية البلوتوث. يتميز بأضواء LED وسماعة بلوتوث مدمجة.",
      descriptionDe: "Erleben Sie den Nervenkitzel mit unserem 6,5\" Bluetooth Hoverboard mit LED-Lichtern und eingebautem Lautsprecher.",
      price: 3200,
      discountPercentage: 10,
      featured: true,
      categoryId: hoverboards.id,
      images: ["https://images.unsplash.com/photo-1621101668838-a1d8e1d02c42?w=600"],
      colors: ["Black", "Red", "Chrome"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "deluxe-baby-bouncer",
      nameEn: "Deluxe Baby Bouncer",
      nameAr: "كرسي هزاز فاخر للأطفال",
      nameDe: "Deluxe Babywippe",
      shortDescEn: "Soothing vibrations, music, and toy bar",
      shortDescAr: "اهتزازات مهدئة، موسيقى، وشريط ألعاب",
      shortDescDe: "Beruhigende Vibrationen, Musik und Spielbogen",
      descriptionEn: "The Deluxe Baby Bouncer keeps your little one entertained and relaxed with gentle vibrations, calming music, and an interactive toy bar.",
      descriptionAr: "الكرسي الهزاز الفاخر يبقي طفلك مستمتعاً ومسترخياً مع اهتزازات لطيفة وموسيقى هادئة.",
      descriptionDe: "Die Deluxe Babywippe hält Ihr Baby mit sanften Vibrationen, beruhigender Musik und einem interaktiven Spielbogen zufrieden.",
      price: 2800,
      compareAtPrice: 3500,
      featured: true,
      categoryId: bouncers.id,
      images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600"],
      colors: ["Pink", "Blue", "Beige"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "electric-drift-kart",
      nameEn: "Electric Drift Kart",
      nameAr: "كارت دريفت كهربائي",
      nameDe: "Elektro Drift-Kart",
      shortDescEn: "360° spin, LED lights, ages 6+",
      shortDescAr: "دوران 360 درجة، أضواء LED، للأعمار 6+",
      shortDescDe: "360° Spin, LED-Lichter, ab 6 Jahre",
      descriptionEn: "The Electric Drift Kart delivers thrilling 360-degree spins with dual rear motors. Features LED underglow lights, adjustable seat, and a top speed of 12 km/h.",
      descriptionAr: "كارت الدريفت الكهربائي يقدم دوران 360 درجة مثير مع محركين خلفيين. يتميز بأضواء LED ومقعد قابل للتعديل.",
      descriptionDe: "Das Elektro Drift-Kart bietet aufregende 360-Grad-Drehungen mit zwei Hinterradmotoren und LED-Unterboden-Beleuchtung.",
      price: 5500,
      featured: true,
      categoryId: driftCars.id,
      images: ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600"],
      colors: ["Red", "Blue", "Black"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "inflatable-pool-set",
      nameEn: "Inflatable Pool Set",
      nameAr: "مجموعة مسبح قابل للنفخ",
      nameDe: "Aufblasbares Pool-Set",
      shortDescEn: "Large family pool with slide attachment",
      shortDescAr: "مسبح عائلي كبير مع زحلقة",
      shortDescDe: "Großes Familienpool mit Rutsche",
      descriptionEn: "Make summer unforgettable with our Inflatable Pool Set! Includes a large pool, attached slide, and repair kit. Perfect for Hurghada summer days.",
      descriptionAr: "اجعل الصيف لا يُنسى مع مجموعة المسبح القابل للنفخ! تتضمن مسبح كبير وزحلقة.",
      descriptionDe: "Machen Sie den Sommer unvergesslich mit unserem aufblasbaren Pool-Set mit Rutsche!",
      price: 1800,
      compareAtPrice: 2200,
      discountPercentage: 20,
      featured: true,
      categoryId: beach.id,
      images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"],
      colors: ["Blue/Yellow", "Pink/Purple"],
      sizes: ["Medium", "Large"],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "compact-city-stroller",
      nameEn: "Compact City Stroller",
      nameAr: "عربة أطفال مدينة مضغوطة",
      nameDe: "Kompakter Stadt-Kinderwagen",
      shortDescEn: "Ultra-compact fold for city life",
      shortDescAr: "طي فائق الضغط لحياة المدينة",
      shortDescDe: "Ultra-kompakte Faltung für das Stadtleben",
      descriptionEn: "Designed for urban families. The Compact City Stroller fits in the smallest spaces with its ultra-compact fold. Lightweight yet durable.",
      descriptionAr: "مصممة للعائلات في المدن. عربة المدينة المضغوطة تناسب أصغر المساحات بفضل طيها الفائق.",
      descriptionDe: "Für städtische Familien konzipiert. Ultra-kompakte Faltung, leicht und langlebig.",
      price: 3200,
      featured: false,
      categoryId: strollers.id,
      images: ["https://images.unsplash.com/photo-1566004100477-7b3d6e801e78?w=600"],
      colors: ["Gray", "Black"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
    {
      slug: "kids-electric-scooter",
      nameEn: "Kids Electric Scooter",
      nameAr: "سكوتر كهربائي للأطفال",
      nameDe: "Kinder Elektroroller",
      shortDescEn: "Electric, foldable, 12km range",
      shortDescAr: "كهربائي، قابل للطي، مدى 12 كم",
      shortDescDe: "Elektrisch, faltbar, 12km Reichweite",
      descriptionEn: "Our Electric Scooter for kids is foldable and features a 12km range. Comes with hand brake and rear fender brake for extra safety.",
      descriptionAr: "السكوتر الكهربائي للأطفال قابل للطي بمدى 12 كم. يأتي مع فرامل يد وفرامل خلفية.",
      descriptionDe: "Unser Elektroroller für Kinder ist faltbar mit 12km Reichweite, Handbremse und Hinterradbremse.",
      price: 2500,
      featured: true,
      categoryId: scooters.id,
      images: ["https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600"],
      colors: ["Black", "White"],
      sizes: [],
      availability: "AVAILABLE" as const,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // ─── Site Settings ───────────────────────────────────────────────────────
  const settings = [
    { key: "whatsapp_number", value: "+201234567890" },
    { key: "whatsapp_template_en", value: "Hi Kidorly! I just placed order {{orderNumber}}. Please confirm." },
    { key: "whatsapp_template_ar", value: "مرحبا كيدورلي! قمت بتقديم الطلب {{orderNumber}}. يرجى التأكيد." },
    { key: "whatsapp_template_de", value: "Hallo Kidorly! Ich habe gerade Bestellung {{orderNumber}} aufgegeben. Bitte bestätigen." },
    { key: "vodafone_cash_number", value: "01012345678" },
    { key: "instapay_id", value: "kidorly@instapay" },
    { key: "payment_instructions_en", value: "Please send the total amount to the number/account shown below, then confirm on WhatsApp with a screenshot." },
    { key: "payment_instructions_ar", value: "يرجى إرسال المبلغ الإجمالي إلى الرقم/الحساب أدناه، ثم التأكيد عبر واتساب مع لقطة شاشة." },
    { key: "payment_instructions_de", value: "Bitte senden Sie den Gesamtbetrag an die unten angezeigte Nummer/Konto und bestätigen Sie per WhatsApp mit einem Screenshot." },
    { key: "shipping_fee_hurghada", value: "50" },
    { key: "shipping_fee_cairo", value: "80" },
    { key: "shipping_fee_alexandria", value: "80" },
    { key: "global_discount_percentage", value: "0" },
    { key: "contact_email", value: "hello@kidorly.com" },
    { key: "contact_phone", value: "+201234567890" },
    { key: "social_instagram", value: "https://instagram.com/kidorly" },
    { key: "social_facebook", value: "https://facebook.com/kidorly" },
    { key: "social_tiktok", value: "https://tiktok.com/@kidorly" },
    { key: "brand_name", value: "Kidorly" },
    { key: "seo_title_en", value: "Kidorly — Premium Kids Products Delivered Across Egypt" },
    { key: "seo_title_ar", value: "كيدورلي — منتجات أطفال فاخرة توصّل في مصر" },
    { key: "seo_title_de", value: "Kidorly — Premium Kinderprodukte in Ägypten" },
    { key: "seo_desc_en", value: "Shop strollers, scooters, hoverboards and more. Delivered to Hurghada, Cairo & Alexandria. Cash on delivery, Vodafone Cash, InstaPay." },
    { key: "seo_desc_ar", value: "تسوق عربات أطفال، سكوترات، هوفربورد والمزيد. توصيل للغردقة، القاهرة والإسكندرية." },
    { key: "seo_desc_de", value: "Kinderwagen, Roller, Hoverboards und mehr. Lieferung nach Hurghada, Kairo & Alexandria." },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // ─── Homepage Sections ────────────────────────────────────────────────────
  const homepageSections = [
    {
      sectionKey: "announcement",
      data: JSON.stringify({
        textEn: "Free delivery on orders above 2000 EGP in Hurghada! 🎉",
        textAr: "توصيل مجاني للطلبات فوق 2000 ج.م في الغردقة! 🎉",
        textDe: "Kostenlose Lieferung bei Bestellungen über 2000 EGP in Hurghada! 🎉",
      }),
      sortOrder: 0,
    },
    {
      sectionKey: "hero",
      data: JSON.stringify({
        titleEn: "Premium Kids Products, Delivered to Your Door",
        titleAr: "منتجات أطفال مميزة، توصيل لباب بيتك",
        titleDe: "Premium Kinderprodukte, direkt zu Ihnen geliefert",
        subtitleEn: "Strollers, scooters, hoverboards & more — trusted quality for your little ones in Hurghada, Cairo & Alexandria.",
        subtitleAr: "عربات أطفال، سكوترات، هوفربورد والمزيد — جودة موثوقة لأطفالك.",
        subtitleDe: "Kinderwagen, Roller, Hoverboards & mehr — vertrauenswürdige Qualität.",
        ctaEn: "Shop Now",
        ctaAr: "تسوق الآن",
        ctaDe: "Jetzt einkaufen",
        image: "",
      }),
      sortOrder: 1,
    },
  ];

  for (const hs of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: hs.sectionKey },
      update: {},
      create: hs,
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   📦 ${products.length} products`);
  console.log(`   📁 6 categories`);
  console.log(`   ⚙️  ${settings.length} settings`);
  console.log(`   🏠 ${homepageSections.length} homepage sections`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
