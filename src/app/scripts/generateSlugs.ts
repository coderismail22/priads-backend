import mongoose from "mongoose";
import slugify from "slugify";
import config from "../config";
import { Service } from "../modules/service/service.model";

const generateSlugsForExistingServices = async () => {
  await mongoose.connect(config.database_url as string);
  console.log("Connected to MongoDB");

  const services = await Service.find({ slug: { $exists: false } });
  console.log(`Found ${services.length} services without slugs.`);

  for (const service of services) {
    const baseSlug = slugify(service.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await Service.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    await Service.findByIdAndUpdate(service._id, { slug });
    console.log(`Updated ${service.title} with slug: ${slug}`);
  }

  console.log("Slug generation completed.");
  mongoose.connection.close();
};

// Run the script
generateSlugsForExistingServices().catch((err) => {
  console.error("Error updating slugs:", err);
  mongoose.connection.close();
});
