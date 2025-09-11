import apiClient from "./apiClient";

import type { HealthRecord } from "~/types";

const resource = "/health-records";

export const getHealthRecord = async (id: number | string) => {
  try {
    const res = await apiClient.get(`${resource}/${id}`);

    return res.data;
  } catch (err) {
    console.error(`Error fetching health record id=${id}!`, err);
    throw err;
  }
};

export const getHealthRecords = async () => {
  try {
    const res = await apiClient.get(resource);

    return res.data;
  } catch (err) {
    console.error("Error fetching health records!", err);
    throw err;
  }
};

export const createHealthRecord = async (data: HealthRecord) => {
  try {
    const res = await apiClient.post(resource, data);

    return res.data;
  } catch (err) {
    console.error("Error creating health record!", err);
    throw err;
  }
};

export const updateHealthRecord = async (id: number | string, data: HealthRecord) => {
  try {
    const res = await apiClient.put(`${resource}/${id}`, data);

    return res.data;
  } catch (err) {
    console.error(`Error updating health record id=${id}!`, err);
    throw err;
  }
};

export const deleteHealthRecord = async (id: number | string) => {
  try {
    const res = await apiClient.delete(`${resource}/${id}`);

    return res.data;
  } catch (err) {
    console.error(`Error deleting health record id=${id}!`, err);
    throw err;
  }
};
