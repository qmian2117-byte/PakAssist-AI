const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '..', 'govt_services_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error("Data file govt_services_data.json not found in root.");
    process.exit(1);
  }

  const dataRaw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(dataRaw);

  console.log(`Found ${data.services.length} services in file.`);

  // Load existing categories to map them
  const dbCategories = await prisma.serviceCategory.findMany();
  const categoryMap = {}; // mapping name/slug to id
  dbCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
    categoryMap[cat.name.toLowerCase()] = cat.id;
  });

  for (const svc of data.services) {
    console.log(`Importing: ${svc.service_name}...`);

    // Resolve category id
    let catSlug = svc.category.toLowerCase().replace(/\s+/g, '-');
    // Map categories like Passport -> passport, NADRA -> nadra
    if (catSlug === 'passport') catSlug = 'passport';
    if (catSlug === 'nadra') catSlug = 'nadra';

    let categoryId = categoryMap[catSlug];
    if (!categoryId) {
      // Create Category dynamically if not exists!
      const newCat = await prisma.serviceCategory.create({
        data: {
          name: svc.category,
          slug: catSlug,
          description: `${svc.category} Procedures`
        }
      });
      categoryId = newCat.id;
      categoryMap[catSlug] = categoryId;
      console.log(`Created new category: ${svc.category}`);
    }

    // Determine slug
    const slug = svc.service_name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Parse baseFee
    let baseFee = 0;
    const feesList = [];

    if (typeof svc.fee === 'number') {
      baseFee = svc.fee;
      feesList.push({ title: "Standard Fee", amount: svc.fee });
    } else if (typeof svc.fee === 'string') {
      const match = svc.fee.match(/\d[\d,.]*/);
      if (match) {
        baseFee = parseFloat(match[0].replace(/,/g, ''));
      }
      feesList.push({ title: "Standard Fee (Estimated)", amount: baseFee });
    } else if (typeof svc.fee === 'object' && svc.fee !== null) {
      if (typeof svc.fee.normal === 'number') {
        baseFee = svc.fee.normal;
        feesList.push({ title: "Normal Processing", amount: svc.fee.normal });
      }
      if (typeof svc.fee.urgent === 'number') {
        feesList.push({ title: "Urgent Processing", amount: svc.fee.urgent });
      }
      if (typeof svc.fee.executive === 'number') {
        feesList.push({ title: "Executive Processing", amount: svc.fee.executive });
      }

      // Passport style nested fees
      if (svc.fee.mrp_normal) {
        const mrpNormalKeys = Object.keys(svc.fee.mrp_normal);
        if (mrpNormalKeys.length > 0) {
          baseFee = svc.fee.mrp_normal[mrpNormalKeys[0]]; // first MRP normal fee as base
        }
        for (const [key, value] of Object.entries(svc.fee.mrp_normal)) {
          feesList.push({ title: `Normal MRP (${key.replace(/_/g, ' ')})`, amount: value });
        }
      }
      if (svc.fee.mrp_urgent) {
        for (const [key, value] of Object.entries(svc.fee.mrp_urgent)) {
          feesList.push({ title: `Urgent MRP (${key.replace(/_/g, ' ')})`, amount: value });
        }
      }
      if (svc.fee.fast_track) {
        for (const [key, value] of Object.entries(svc.fee.fast_track)) {
          feesList.push({ title: `Fast Track MRP (${key.replace(/_/g, ' ')})`, amount: value });
        }
      }
      if (svc.fee.epassport_normal) {
        for (const [key, value] of Object.entries(svc.fee.epassport_normal)) {
          feesList.push({ title: `Normal e-Passport (${key.replace(/_/g, ' ')})`, amount: value });
        }
      }
      if (svc.fee.epassport_urgent) {
        for (const [key, value] of Object.entries(svc.fee.epassport_urgent)) {
          feesList.push({ title: `Urgent e-Passport (${key.replace(/_/g, ' ')})`, amount: value });
        }
      }
    }

    // Processing time string formatting
    let procTimeStr = "";
    if (typeof svc.processing_time === 'string') {
      procTimeStr = svc.processing_time;
    } else if (typeof svc.processing_time === 'object' && svc.processing_time !== null) {
      procTimeStr = Object.entries(svc.processing_time)
        .map(([tier, duration]) => `${tier.charAt(0).toUpperCase() + tier.slice(1)}: ${duration}`)
        .join(' | ');
    }

    // Upsert GovService
    const dbSvc = await prisma.govService.upsert({
      where: { slug },
      update: {
        title: svc.service_name,
        summary: svc.description,
        categoryId,
        baseFee,
        processingTime: procTimeStr,
        officialSourceUrl: svc.official_website || null,
        isPublished: true
      },
      create: {
        title: svc.service_name,
        slug,
        summary: svc.description,
        categoryId,
        baseFee,
        processingTime: procTimeStr,
        officialSourceUrl: svc.official_website || null,
        isPublished: true
      }
    });

    // Recreate relations to match new data
    await prisma.serviceDocument.deleteMany({ where: { serviceId: dbSvc.id } });
    if (Array.isArray(svc.required_documents)) {
      for (const docTitle of svc.required_documents) {
        await prisma.serviceDocument.create({
          data: {
            serviceId: dbSvc.id,
            title: docTitle,
            isRequired: true
          }
        });
      }
    }

    await prisma.serviceStep.deleteMany({ where: { serviceId: dbSvc.id } });
    if (Array.isArray(svc.step_by_step_procedure)) {
      for (let i = 0; i < svc.step_by_step_procedure.length; i++) {
        await prisma.serviceStep.create({
          data: {
            serviceId: dbSvc.id,
            stepNumber: i + 1,
            title: `Step ${i + 1}`,
            description: svc.step_by_step_procedure[i]
          }
        });
      }
    }

    await prisma.serviceFee.deleteMany({ where: { serviceId: dbSvc.id } });
    for (const f of feesList) {
      await prisma.serviceFee.create({
        data: {
          serviceId: dbSvc.id,
          title: f.title,
          amount: f.amount
        }
      });
    }

    await prisma.serviceFAQ.deleteMany({ where: { serviceId: dbSvc.id } });
    if (Array.isArray(svc.faqs)) {
      for (const faq of svc.faqs) {
        await prisma.serviceFAQ.create({
          data: {
            serviceId: dbSvc.id,
            question: faq.q,
            answer: faq.a
          }
        });
      }
    }
  }

  console.log("Import completed successfully!");
}

main()
  .catch(e => {
    console.error("Import error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
