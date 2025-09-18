import apiClient from "./apiClient";

import type { HealthRecord } from "~/types";

const endPoint = "/health-records";

export const getHealthRecord = async (id: string): Promise<HealthRecord> => {
  try {
    const { data } = await apiClient.get(`${endPoint}/${id}`);

    return data;
  } catch (err) {
    console.error(`Error fetching health record id=${id}!`, err);
    throw err;
  }
};

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  try {
    const { data } = await apiClient.get(endPoint);

    return data;
  } catch (err) {
    console.error("Error fetching health records!", err);
    throw err;
  }
};

export const createHealthRecord = async (record: HealthRecord): Promise<HealthRecord> => {
  try {
    const { data } = await apiClient.post(endPoint, record);

    return data;
  } catch (err) {
    console.error("Error creating health record!", err);
    throw err;
  }
};

export const updateHealthRecord = async (id: string, record: HealthRecord): Promise<HealthRecord> => {
  try {
    const { data } = await apiClient.put(`${endPoint}/${id}`, record);

    return data;
  } catch (err) {
    console.error(`Error updating health record id=${id}!`, err);
    throw err;
  }
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${endPoint}/${id}`);
  } catch (err) {
    console.error(`Error deleting health record id=${id}!`, err);
    throw err;
  }
};
