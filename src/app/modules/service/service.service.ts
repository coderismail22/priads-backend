import { Service } from "./service.model";
import { TService } from "./service.interface";

const createService = async (payload: TService) => {
  const result = await Service.create(payload);
  return result;
};

const getAllServices = async () => {
  const result = await Service.find();
  return result;
};

const getService = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateService = async (id: string, payload: Partial<TService>) => {
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
