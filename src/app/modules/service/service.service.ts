import { Service } from "./service.model";
import { TService } from "./service.interface";
import slugify from "slugify";

const createService = async (payload: TService) => {
  const baseSlug = slugify(payload.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Check if slug exists and increment the number if needed
  while (await Service.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  payload.slug = slug;

  const result = await Service.create(payload);
  return result;
};

const getAllServices = async () => {
  const result = await Service.find();
  return result;
};

const getService = async (slug: string) => {
  const result = await Service.findOne({ slug: slug });
  return result;
};

const updateService = async (id: string, payload: Partial<TService>) => {
  if (payload.title) {
    const baseSlug = slugify(payload.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Check if new slug already exists (excluding current service)
    while (await Service.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    payload.slug = slug;
  }

  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  return result;
};

export const ServiceServices = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
