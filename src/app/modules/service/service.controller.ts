import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ServiceServices } from "./service.service";

const createService = catchAsync(async (req, res) => {
  const result = await ServiceServices.createService(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service created successfully.",
    data: result,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const result = await ServiceServices.getAllServices();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Services retrieved successfully.",
    data: result,
  });
});

const getService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.getService(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service retrieved successfully.",
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.updateService(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service updated successfully.",
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.deleteService(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service deleted successfully.",
    data: result,
  });
});

export const ServiceControllers = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
