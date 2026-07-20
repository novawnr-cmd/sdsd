import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@adamshop.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@adamshop.com",
      password: adminPassword,
      name: "Admin",
      role: Role.ADMIN,
      isVerified: true,
      phone: "0912345678",
      city: "Tripoli",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create categories
  const categories = [
    { name: "إلكترونيات", nameEn: "Electronics", slug: "electronics", icon: "📱" },
    { name: "أزياء رجالية", nameEn: "Men's Fashion", slug: "mens-fashion", icon: "👔" },
    { name: "أزياء نسائية", nameEn: "Women's Fashion", slug: "womens-fashion", icon: "👗" },
    { name: "أحذية", nameEn: "Shoes", slug: "shoes", icon: "👟" },
    { name: "أكسسوارات", nameEn: "Accessories", slug: "accessories", icon: "💎" },
    { name: "منزل وحديقة", nameEn: "Home & Garden", slug: "home-garden", icon: "🏠" },
    { name: "رياضة ولياقة", nameEn: "Sports & Fitness", slug: "sports-fitness", icon: "⚽" },
    { name: "كتب وم education", nameEn: "Books & Education", slug: "books-education", icon: "📚" },
    { name: "صحة وجمال", nameEn: "Health & Beauty", slug: "health-beauty", icon: "💄" },
    { name: "طعام ومشروبات", nameEn: "Food & Beverages", slug: "food-beverages", icon: "🍕" },
    { name: "ألعاب وألعاب", nameEn: "Games & Toys", slug: "games-toys", icon: "🎮" },
    { name: "سيارات ومركبات", nameEn: "Cars & Vehicles", slug: "cars-vehicles", icon: "🚗" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Create subcategories for Electronics
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: "electronics" } });
  if (electronicsCategory) {
    const subcategories = [
      { name: "هواتف ذكية", nameEn: "Smartphones", slug: "smartphones", icon: "📱", parentId: electronicsCategory.id },
      { name: "لابتوبات", nameEn: "Laptops", slug: "laptops", icon: "💻", parentId: electronicsCategory.id },
      { name: "سماعات", nameEn: "Headphones", slug: "headphones", icon: "🎧", parentId: electronicsCategory.id },
      { name: "ساعات ذكية", nameEn: "Smartwatches", slug: "smartwatches", icon: "⌚", parentId: electronicsCategory.id },
    ];

    for (const sub of subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: {},
        create: sub,
      });
    }
    console.log(`✅ ${subcategories.length} subcategories created`);
  }

  // Create demo settings
  const settings = [
    { key: "siteName", value: "ادم شوب", type: "text" },
    { key: "siteNameEn", value: "Adam Shop", type: "text" },
    { key: "siteDescription", value: "المتجر الإلكتروني الأول في ليبيا", type: "text" },
    { key: "sitePhone", value: "+218912345678", type: "text" },
    { key: "siteEmail", value: "info@adamshop.com", type: "text" },
    { key: "currency", value: "LYD", type: "text" },
    { key: "subscriptionPrice", value: "30", type: "number" },
    { key: "freeShippingMin", value: "100", type: "number" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  // Create demo banner
  await prisma.banner.create({
    data: {
      title: "مرحباً بك في ادم شوب",
      titleEn: "Welcome to Adam Shop",
      image: "https://res.cloudinary.com/demo/image/upload/v1/banner1.jpg",
      link: "/products",
      isActive: true,
      position: 1,
    },
  });
  console.log("✅ Demo banner created");

  console.log("\n🎉 Seeding completed!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
